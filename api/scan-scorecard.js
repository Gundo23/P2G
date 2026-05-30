async function scanScorecardPhoto(event) {
const file = event.target.files[0];
if (!file) return;

setScanLoading(true);
setScanError("");
setScanSuccess("");

try {
const compressImage = (file) =>
new Promise((resolve, reject) => {
const img = new Image();

```
    img.onload = () => {
      const canvas = document.createElement("canvas");

      let width = img.width;
      let height = img.height;

      const maxSize = 1200;

      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }

          const reader = new FileReader();

          reader.onloadend = () => {
            resolve(reader.result.split(",")[1]);
          };

          reader.onerror = reject;
          reader.readAsDataURL(blob);
        },
        "image/jpeg",
        0.35
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });

const compressedBase64 = await compressImage(file);

const response = await fetch("/api/scan-scorecard", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    image: compressedBase64,
    mediaType: "image/jpeg",
    tee: "Yellow",
  }),
});

const text = await response.text();

let data;

try {
  data = JSON.parse(text);
} catch {
  throw new Error(
    `Scan API returned non-JSON response. Status ${response.status}.`
  );
}

if (!response.ok) {
  throw new Error(data.message || `Server error ${response.status}`);
}

const newCourse = {
  name: data.course_name,
  tee: data.tee || "Yellow",
  par: data.par,
  rating: data.course_rating,
  slope: data.slope_rating,
};

const alreadyExists = courses.some(
  (c) => c.name.toLowerCase() === newCourse.name.toLowerCase()
);

if (!alreadyExists) {
  setCourses((prev) => [...prev, newCourse]);
}

setSelectedCourse(courseKey(newCourse));
setCourseSearch(newCourse.name);

setScanSuccess(`✅ ${newCourse.name} scanned successfully`);
```

} catch (err) {
setScanError(`❌ ${err.message}`);
} finally {
setScanLoading(false);
event.target.value = "";
}
}

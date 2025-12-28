const inputImg = document.querySelector("#imageinput");
const originaImg = document.querySelector("#original-image");
const resultImg = document.querySelector("#processed-image");
const removeBgBtn = document.querySelector(".remove-bg-btn");
const downloadBtn = document.querySelector(".download-btn");
downloadBtn.style.display = "none";

// Displays the uploaded image
inputImg.addEventListener("change", () => {
  const file = inputImg.files[0];
  if (file) {
    originaImg.src = URL.createObjectURL(file);
  }
});

// Remove background
removeBgBtn.addEventListener("click", async () => {
  const file = inputImg.files[0];
  if (!file) {
    alert("Please upload an image first");
    return;
  }

  const formData = new FormData();
  formData.append("image_file", file);
  formData.append("size", "auto");

  removeBgBtn.style.backgroundColor = "#e01c2fff";
  removeBgBtn.style.color = "white";
  removeBgBtn.textContent = "Removing Background...";

  removeBgBtn.disabled = true;
  try {
    const response = await fetch("http://localhost:5000/api/remove-bg", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error("Failed to remove background");

    const blob = await response.blob();
    resultImg.src = URL.createObjectURL(blob);

    // Show download button AFTER image is ready
    downloadBtn.style.display = "block";
    removeBgBtn.remove();

    // Remove any previous click listeners before adding
    downloadBtn.replaceWith(downloadBtn.cloneNode(true));
    const newDownloadBtn = document.querySelector(".download-btn");
    newDownloadBtn.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = resultImg.src;
      a.download =
        inputImg.files[0].name.replace(/\.[^/.]+$/, "") + "_no_bg.png";
      a.click();
      window.location.reload();
    });
  } catch (error) {
    alert(error.message);
    removeBgBtn.textContent = "Remove Background";
    removeBgBtn.style.backgroundColor = "rgb(241, 52, 241)";
    removeBgBtn.style.color = "white";
    removeBgBtn.disabled = false;
  }
});

const inputImg = document.querySelector("#imageinput");
const originaImg = document.querySelector("#original-image");
const resultImg = document.querySelector("#processed-image");
const removeBgBtn = document.querySelector(".remove-bg-btn");
const downloadBtn = document.createElement("button");
downloadBtn.textContent = "Download Image";
downloadBtn.classList.add("btn", "btn-warning", "");
// Displays the uploaded image
inputImg.addEventListener("change", () => {
  const file = inputImg.files[0];
  if (file) {
    originaImg.src = URL.createObjectURL(file);
  }
});
// If there is no image uploaded!
removeBgBtn.addEventListener("click", async () => {
  const file = inputImg.files[0];
  if (!file) {
    alert("Please upload an image first");
    return;
  }
  // Making the API call to remove Background
  removeBgBtn.textContent = "Removing Background...";
  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: {
      "X-Api-Key": "YOUR_API_KEY",
    },
    body: new FormData(inputImg),
  });
  const blob = await response.blob();
  resultImg.src = URL.createObjectURL(blob);
});

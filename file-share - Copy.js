document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const qrContainer = document.getElementById("qr");
  const status = document.getElementById("status");

  fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    status.textContent = "Uploading...";
    qrContainer.innerHTML = "";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("https://file.io", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        const downloadLink = result.link;

        // Display QR code
        new QRCode(qrContainer, {
          text: downloadLink,
          width: 250,
          height: 250,
        });

        status.innerHTML = `✅ File uploaded. Scan QR to download:<br><a href="${downloadLink}" target="_blank">${downloadLink}</a>`;
      } else {
        status.textContent = "❌ Upload failed. Try again.";
        console.error(result);
      }
    } catch (error) {
      status.textContent = "❌ Upload error. Check your connection.";
      console.error("Upload error:", error);
    }
  });
});

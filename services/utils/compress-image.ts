const compressImage = (
  file: File,
  callback: (compressedFile: File) => void
) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set  canvas dimensions to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx!.drawImage(img, 0, 0);

      // Apply basic compression (adjust quality as needed)
      const quality = 0.1; // Adjust quality as needed

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/jpeg", quality);

      // Convert data URL back to Blob
      const byteString = atob(dataURL.split(",")[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const compressedFile = new File([ab], file.name, { type: "image/jpeg" });

      callback(compressedFile);
    };
    img.src = e.target!.result as string;
  };

  reader.readAsDataURL(file);
};
export default compressImage;

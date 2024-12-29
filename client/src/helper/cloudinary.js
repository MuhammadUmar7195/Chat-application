const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_NAME}/auto/upload`;

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "chat-application");
  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export default uploadFile;

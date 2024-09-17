

export const uploadImage = async (image: string): Promise<string | null> => {
    const formData = new FormData();
    const mail = "trancationData.id";
    const props = {
      uri: image,
      type: "image/jpeg",
      name: `upload_${Date.now()}.jpg`,
    };
    formData.append("file", props as unknown as Blob);
    formData.append("public_id", `Data/${mail}/upload_${Date.now()}`);
    formData.append("upload_preset", "Default");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dxvmt15ez/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Upload successful:", result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  };
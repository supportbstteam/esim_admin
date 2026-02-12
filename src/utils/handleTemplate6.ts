import { uploadImage } from "@/lib/UploadImage";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleImageUploadForSection = async (section: any) => {
  const data = { ...section.data };

  if (data.imageFile instanceof File) {
    try {
      const res = await uploadImage(data.imageFile);

      console.log("UPLOAD RESPONSE RAW ===>", res);

      const imagePath =
        res?.path ||
        res?.url ||
        res?.data?.path ||
        res?.data?.url ||
        res?.data?.filePath;

      if (!imagePath) {
        throw new Error("No image path returned from upload API");
      }

      data.image = imagePath;

      // cleanup temp-only fields
      delete data.imageFile;
      delete data.imagePreview;
    } catch (error) {
      console.error("Template6 image upload failed:", error);
      throw error; // ⛔ stop saveAll
    }
  }

  return {
    ...section,
    data,
  };
};

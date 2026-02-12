// lib/resolveImageUrl.ts
const BACKEND_URL = "http://localhost:4000/api";

export const resolveImageUrl = (image?: string) => {
  if (!image) return "";
  return image.startsWith("http")
    ? image
    : `${BACKEND_URL}${image}`;
};

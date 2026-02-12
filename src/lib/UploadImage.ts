import axios from "axios";
import Cookies from "js-cookie";

export const uploadImage = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append("image", file);

        const token = Cookies.get("token");
        console.log("UPLOAD URL =>", `${process.env.NEXT_PUBLIC_API_URL}admin/image/upload`);

        // ⛔ Execution blocks HERE until HTTP finishes
        const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}admin/image/upload`,
            formData,
            {
                headers: {
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                withCredentials: true,
            }
        );

        console.log(
            "-=-=-=-=-=-=- uploadImage SUCCESS response -=-=-=-=",
            res
        );

        // Validate response early (important)
        if (!res.data) {
            throw new Error("Upload succeeded but no response data returned");
        }

        return res.data; // 🔒 Only returns AFTER upload completes
    } catch (error) {
        console.error("uploadImage FAILED:", error);
        throw error; // ⛔ Propagate error to stop upstream flow
    }
};

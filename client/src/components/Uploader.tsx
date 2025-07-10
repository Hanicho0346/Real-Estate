import { useDropzone } from "react-dropzone";
import { Camera } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export const ProfilePictureUploader = () => {
  const { currentUser, updateUser } = useContext(AuthContext);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    noClick: true,
    onDrop: async (acceptedFiles) => {
      if (!currentUser?.id) {
        console.error("User not logged in");
        return;
      }

      const file = acceptedFiles[0];
      await uploadImage(file);
    },
  });

  const uploadImage = async (file: File) => {
    try {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", file);
      cloudinaryFormData.append("upload_preset", "profile-pictures");

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: cloudinaryFormData }
      );

      if (!cloudinaryRes.ok) throw new Error("Cloudinary upload failed");

      const { secure_url } = await cloudinaryRes.json();

      await axios.put(
        `/api/users/${currentUser?.id}/avatar`,
        { avatar: secure_url },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      updateUser({ avatar: secure_url });
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload image");
    }
  };

  if (!currentUser) {
    return (
      <div className="relative">
        <div className="rounded-full w-24 h-24 overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100">
          <img
            src="/default-avatar.jpg"
            alt="Default avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">Please login to upload</p>
      </div>
    );
  }

  return (
    <div {...getRootProps()} className="relative">
      <div className="rounded-full w-24 h-24 overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100">
        <img
          src={currentUser.avatar || "/default-avatar.jpg"}
          alt="User avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <input {...getInputProps()} />
      <button
        onClick={(e) => {
          e.stopPropagation();
          document
            .querySelector<HTMLInputElement>('input[type="file"]')
            ?.click();
        }}
        className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors shadow-lg"
      >
        <Camera className="w-4 h-4" />
      </button>
    </div>
  );
};

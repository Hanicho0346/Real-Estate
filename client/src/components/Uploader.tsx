import { useDropzone } from "react-dropzone";
import { Camera, Loader2 } from "lucide-react";
import { useContext, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import apiRequest from "../lib/apiRequest";

export const ProfilePictureUploader = () => {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [url, setUrl] = useState(currentUser?.avatar);
  const [isUploading, setIsUploading] = useState(false);
  const firstLetter = currentUser?.username?.charAt(0) || "";
  const token = localStorage.getItem("token");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!acceptedFiles.length) return;

      setIsUploading(true);
      try {

        const imageFormData = new FormData();
        imageFormData.append("file", acceptedFiles[0]);
        imageFormData.append("upload_preset", "myimages");
        imageFormData.append("cloud_name", "dv9cwipyp");
        if (currentUser?.id) {
        imageFormData.append("public_id", `myimages/${currentUser.id}`);
        imageFormData.append("overwrite", "false"); 
      }

        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dv9cwipyp/image/upload",
          imageFormData
        );

        const newAvatarUrl = data.secure_url;

        setUrl(newAvatarUrl);
        if (currentUser) {
          updateUser({
            ...currentUser,
            avatar: newAvatarUrl,
          });
        }

        const updateData = { avatar: newAvatarUrl };
        await apiRequest.put(
          `/user/${currentUser?.id}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload profile picture");
        setUrl(currentUser?.avatar);
        if (currentUser) {
          updateUser({
            ...currentUser,
            avatar: currentUser.avatar,
          });
        }
      } finally {
        setIsUploading(false);
      }
    },
    [currentUser, token, updateUser]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*",
    maxFiles: 1,
  });

  if (!currentUser) {
    return (
      <div className="relative">
        <div className="rounded-full w-24 h-24 overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100 bg-gray-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-gray-600">
            {firstLetter}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2">Please login to upload</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        {...getRootProps()}
        className="rounded-full w-24 h-24 overflow-hidden border-4 border-white shadow-2xl ring-4 ring-blue-100 cursor-pointer relative"
      >
        <input {...getInputProps()} />
        {url ? (
          <img src={url} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-600">
              {firstLetter}
            </span>
          </div>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-black" />
          </div>
        )}
      </div>
    </div>
  );
};
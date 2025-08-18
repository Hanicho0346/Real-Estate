import { useState, useCallback, useContext } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  X,
  ImagePlus,
  Loader2,
} from "lucide-react";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { toast } from "react-hot-toast";
import type { ImageData } from "../../types/type";

const Toolbar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-2 border-b border-gray-200 pb-2">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bold")
            ? "bg-gray-100 text-blue-600"
            : "text-gray-600"
        }`}
        aria-label="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("italic")
            ? "bg-gray-100 text-blue-600"
            : "text-gray-600"
        }`}
        aria-label="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("bulletList")
            ? "bg-gray-100 text-blue-600"
            : "text-gray-600"
        }`}
        aria-label="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${
          editor.isActive("orderedList")
            ? "bg-gray-100 text-blue-600"
            : "text-gray-600"
        }`}
        aria-label="Numbered List"
      >
        <ListOrdered size={18} />
      </button>
    </div>
  );
};

const AddPost = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Describe your property in detail...</p>",
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    try {
      setIsUploading(true);
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "postimages");
        formData.append("cloud_name", "dv9cwipyp");

        const { data } = await axios.post(
          "https://api.cloudinary.com/v1_1/dv9cwipyp/image/upload",
          formData
        );
        return { url: data.secure_url };
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedImages]);
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      toast.error("Failed to upload images");
      console.error("Image upload error:", error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image removed");
  };

 const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!currentUser) return;

  const description = editor?.getHTML() || "";
  if (description.trim() === "<p></p>") {
    setError("Description is required");
    toast.error("Please provide a description");
    return;
  }

  if (images.length === 0) {
    setError("At least one image is required");
    toast.error("Please upload at least one image");
    return;
  }

  try {
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData);

    const postData = {
      Title: formValues.title as string,
      price: formValues.price as string,
      address: formValues.address as string,
      city: formValues.city as string,
      bedroom: formValues.bedroom as string,
      bathroom: formValues.bathroom as string,
      type: formValues.type as string,
      property: (formValues.propertyType as string).toLowerCase(),
    };

    const postDetail = {
      des: description,
      utilities: formValues.utilities as string,
      pet: formValues.petAllowed as string,
      income: formValues.income as string,
      size: formValues.size as string,
      school: formValues.schools as string,
      busDistance: formValues.busDistance as string,
      restaurants: formValues.restaurants as string,
    };

    const response = await apiRequest.post("/post/addpost", {
      postData,
      postDetail,
      images: images.map(img => img.url), // Send Cloudinary URLs
    });

    toast.success("Property listed successfully!");
    navigate(`/singlepage/${response.data.post.id}`);
  } catch (error: any) {
    console.error("Submission error:", error);
    const errorMessage = error.response?.data?.message || "Failed to create listing";
    setError(errorMessage);
    toast.error(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          List Your Property
        </h1>
        <p className="text-gray-500">Please login to list your property</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          List Your Property
        </h1>
        <p className="text-gray-500 mt-2">
          Fill in the details to add your property to our listings
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title*
              </label>
              <input
                type="text"
                name="title"
                placeholder="Beautiful 3-bedroom apartment"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">$</span>
                <input
                  type="number"
                  name="price"
                  placeholder="2500"
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms*
              </label>
              <input
                type="number"
                name="bedroom"
                placeholder="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms*
              </label>
              <input
                type="number"
                name="bathroom"
                placeholder="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                max="20"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Listing Type*
              </label>
              <select
                name="type"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                defaultValue="rent"
              >
                <option value="rent">For Rent</option>
                <option value="buy">For Sale</option>
              </select>
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200">
            Location Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address*
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main Street"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City*
              </label>
              <input
                type="text"
                name="city"
                placeholder="New York"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type*
              </label>
              <select
                name="propertyType"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                defaultValue=""
              >
                <option value="">Select property type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                name="latitude"
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                name="longitude"
                placeholder="Optional"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200">
            Description
          </h2>
          <div className="bg-white p-4 rounded-lg border border-gray-300 min-h-[200px]">
            {editor && <Toolbar editor={editor} />}
            <EditorContent
              editor={editor}
              className="prose max-w-none min-h-[150px] p-2 focus:outline-none"
            />
          </div>
        </div>

        {/* Additional Details Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200">
            Additional Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Size (sq ft)*
              </label>
              <input
                type="number"
                name="size"
                placeholder="1200"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bus Distance (m)
              </label>
              <input
                type="number"
                name="busDistance"
                placeholder="500"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Utilities
              </label>
              <select
                name="utilities"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue=""
              >
                <option value="">Select utilities</option>
                <option value="included">Included</option>
                <option value="not-included">Not Included</option>
                <option value="some-included">Some Included</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pet Policy
              </label>
              <select
                name="petAllowed"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue=""
              >
                <option value="">Select pet policy</option>
                <option value="allowed">Pets Allowed</option>
                <option value="not-allowed">No Pets</option>
                <option value="case-by-case">Case by Case</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schools Nearby
              </label>
              <input
                type="number"
                name="schools"
                placeholder="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurants Nearby
              </label>
              <input
                type="number"
                name="restaurants"
                placeholder="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Income Requirement
              </label>
              <select
                name="income"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                defaultValue="Required"
              >
                <option value="Required">Proof of Income Required</option>
                <option value="Not Required">No Income Proof Needed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Upload Section */}
        <div className="bg-gray-50 p-4 md:p-6 rounded-lg">
          <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200">
            Property Media
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images*
            </label>
            <p className="text-xs text-gray-500 mb-3">
              At least one image is required (max 10 images)
            </p>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative group h-32 rounded-lg overflow-hidden border border-gray-200"
                  >
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div
              {...getRootProps()}
              className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                isDragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <div className="space-y-1 text-center">
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                    <p className="mt-2 text-sm text-gray-600">
                      Uploading images...
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center">
                      <ImagePlus size={40} />
                    </div>
                    <div className="flex text-sm text-gray-600 justify-center flex-wrap">
                      <input {...getInputProps()} />
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                        Click to upload
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG up to 10MB each
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`relative bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 md:py-3 px-6 md:px-8 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium ${
              isSubmitting ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <span className="invisible">Submit Property</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </span>
              </>
            ) : (
              "Submit Property"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;

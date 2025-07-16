import { useState, useCallback, useMemo, useContext, useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, List, ListOrdered, X } from "lucide-react";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

interface PostData {
  Title: string; 
  price: number;
  img: string[];
  address: string;
  bedroom: number;
  bathroom: number;
  city: string;
  latitude: string;
  longitude: string;
  type: "rent" | "buy";
  property: "apartment" | "house" | "villa" | "condo" | "townhouse" | "";
  userId: string;
}

interface PostDetail {
  des: string;
  utilities: "included" | "not-included" | "some-included" | "";
  pet: "allowed" | "not-allowed" | "case-by-case" | "";
  income: "Required" | "Not Required";
  size: number;
  school: number;
  bus: number;
  restaurant: number;
}

interface FormInputs {
  title: string;
  price: string;
  address: string;
  bedroom: string;
  bathroom: string;
  city: string;
  latitude?: string;
  longitude?: string;
  type: "rent" | "buy";
  propertyType: "apartment" | "house" | "villa" | "condo" | "townhouse" | "";
  utilities: "included" | "not-included" | "some-included" | "";
  petAllowed: "allowed" | "not-allowed" | "case-by-case" | "";
  income: "Required" | "Not Required";
  size: string;
  schools?: string;
  busDistance?: string;
  restaurants?: string;
  images?: FileList;
}

const AddPost = () => {
  const { currentUser } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [description, setDescription] = useState<string>(""); 
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [imagePreviews, setImagePreviews] = useState<Array<{ file: File; preview: string }>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editorConfig = useMemo(() => ({
    extensions: [StarterKit],
    content: description,
    onUpdate: ({ editor }: { editor: any }) => { 
      setDescription(editor.getHTML());
    },
  }), [description]);

  const editor = useEditor(editorConfig);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      
      const newImagePreviews = imageFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));

      setImagePreviews(prev => [...prev, ...newImagePreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    if (imagePreviews.length === 1 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const Toolbar = useMemo(() => {
    if (!editor) return null;

    return () => (
      <div className="flex gap-2 mb-2 border-b pb-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bold") ? "bg-gray-100" : ""
          }`}
          aria-label="Bold"
        >
          <Bold size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("italic") ? "bg-gray-100" : ""
          }`}
          aria-label="Italic"
        >
          <Italic size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("bulletList") ? "bg-gray-100" : ""
          }`}
          aria-label="Bullet List"
        >
          <List size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-gray-100 ${
            editor.isActive("orderedList") ? "bg-gray-100" : ""
          }`}
          aria-label="Ordered List"
        >
          <ListOrdered size={18} />
        </button>
      </div>
    );
  }, [editor]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const inputs: FormInputs = Object.fromEntries(formData) as unknown as FormInputs;

    if (!currentUser) {
      setError("You must be logged in to create a post.");
      setIsSubmitting(false);
      return;
    }

    if (!description || description.trim() === "<p></p>") {
      setError("Please provide a description");
      setIsSubmitting(false);
      return;
    }

    if (imagePreviews.length === 0) {
      setError("Please upload at least one image");
      setIsSubmitting(false);
      return;
    }

    try {
      // Parse and validate numeric inputs
      const price = parseFloat(inputs.price);
      const bedroom = parseInt(inputs.bedroom);
      const bathroom = parseInt(inputs.bathroom);
      const size = parseFloat(inputs.size);

      if (isNaN(price) || price <= 0) {
        setError("Please enter a valid price");
        setIsSubmitting(false);
        return;
      }

      if (isNaN(bedroom) || bedroom <= 0) {
        setError("Please enter a valid number of bedrooms");
        setIsSubmitting(false);
        return;
      }

      if (isNaN(bathroom) || bathroom <= 0) {
        setError("Please enter a valid number of bathrooms");
        setIsSubmitting(false);
        return;
      }

      if (isNaN(size) || size <= 0) {
        setError("Please enter a valid size");
        setIsSubmitting(false);
        return;
      }

   
      const postData: PostData = {
        Title: inputs.title, 
        price: price,
        img: [],
        address: inputs.address,
        bedroom: bedroom,
        bathroom: bathroom,
        city: inputs.city,
        latitude: inputs.latitude || "0",
        longitude: inputs.longitude || "0",
        type: inputs.type,
        property: inputs.propertyType,
        userId: currentUser.id,
      };

      const postDetail: PostDetail = {
        des: description,
        utilities: inputs.utilities || "",
        pet: inputs.petAllowed || "",
        income: inputs.income || "Required",
        size: size,
        school: parseInt(inputs.schools || "0") || 0,
        bus: parseInt(inputs.busDistance || "0") || 0,
        restaurant: parseInt(inputs.restaurants || "0") || 0,
      };

    
      const requestFormData = new FormData();
      
     
      requestFormData.append('postData', JSON.stringify(postData));
      requestFormData.append('postDetail', JSON.stringify(postDetail));
      
 
      imagePreviews.forEach(({ file }) => {
        requestFormData.append('images', file);
      });

    
      const res = await apiRequest.post("/post/addpost", requestFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Post created successfully:', res.data);
      navigate(`/singlepage/${res.data.post.id}`);
    } catch (err: any) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [description, currentUser, navigate, imagePreviews]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(({ preview }) => {
        URL.revokeObjectURL(preview);
      });
    };
  }, []);

  return (
    <div className='max-w-5xl mx-auto p-4 md:p-8 bg-white rounded-xl shadow-lg'>
      <div className='mb-8'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-800'>List Your Property</h1>
        <p className='text-gray-500 mt-2'>Fill in the details to add your property to our listings</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200'>
            Basic Information
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Title*</label>
              <input
                type="text"
                name='title'
                placeholder='Beautiful 3-bedroom apartment'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                required
                maxLength={100}
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Price*</label>
              <div className='relative'>
                <span className='absolute left-3 top-2 text-gray-400'>$</span>
                <input
                  type="number"
                  name='price'
                  placeholder='2500'
                  className='w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  min="1"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Bedrooms*</label>
              <input
                type="number"
                name='bedroom'
                placeholder='3'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="1"
                max="20"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Bathrooms*</label>
              <input
                type="number"
                name='bathroom'
                placeholder='2'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="1"
                max="20"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Listing Type*</label>
              <select
                name="type"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
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
        <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200'>
            Location Details
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Address*</label>
              <input
                type="text"
                name='address'
                placeholder='123 Main Street'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>City*</label>
              <input
                type="text"
                name='city'
                placeholder='New York'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Property Type*</label>
              <select
                name="propertyType"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                required
                defaultValue=""
              >
                <option value="">Select property type</option>
                <option value="apartment">apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Latitude</label>
              <input
                type="text"
                name='latitude'
                placeholder='Optional'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Longitude</label>
              <input
                type="text"
                name='longitude'
                placeholder='Optional'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
          </div>
        </div>

        <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200'>
            Description
          </h2>
          <div className="bg-white p-4 rounded-lg border border-gray-300 min-h-[200px]">
            {editor && <Toolbar />}
            <EditorContent
              editor={editor}
              className="prose max-w-none min-h-[150px] p-2 focus:outline-none"
            />
          </div>
          {!description || description.trim() === "<p></p>" ? (
            <p className="mt-1 text-sm text-red-500">Description is required</p>
          ) : null}
        </div>

        <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200'>
            Additional Details
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Total Size (sq ft)*</label>
              <input
                type="number"
                name='size'
                placeholder='1200'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="1"
                required
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Bus Distance (m)</label>
              <input
                type="number"
                name='busDistance'
                placeholder='500'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="0"
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Utilities</label>
              <select
                name="utilities"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                defaultValue=""
              >
                <option value="">Select utilities</option>
                <option value="included">Included</option>
                <option value="not-included">Not Included</option>
                <option value="some-included">Some Included</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Pet Policy</label>
              <select
                name="petAllowed"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                defaultValue=""
              >
                <option value="">Select pet policy</option>
                <option value="allowed">Pets Allowed</option>
                <option value="not-allowed">No Pets</option>
                <option value="case-by-case">Case by Case</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Schools Nearby</label>
              <input
                type="number"
                name='schools'
                placeholder='3'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="0"
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Restaurants Nearby</label>
              <input
                type="number"
                name='restaurants'
                placeholder='5'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                min="0"
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Income Requirement</label>
              <select
                name="income"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                defaultValue="Required"
              >
                <option value="Required">Proof of Income Required</option>
                <option value="Not Required">No Income Proof Needed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Media Upload Section */}
        <div className='bg-gray-50 p-4 md:p-6 rounded-lg'>
          <h2 className='text-lg md:text-xl font-semibold text-gray-700 mb-4 md:mb-6 pb-2 border-b border-gray-200'>
            Property Media
          </h2>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Upload Images*</label>
            {/* Image Previews */}
            {imagePreviews.length > 0 && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {imagePreviews.map((image, index) => (
                  <div key={index} className="relative group h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={image.preview}
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
            <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg'>
              <div className='space-y-1 text-center'>
                <svg
                  className='mx-auto h-12 w-12 text-gray-400'
                  stroke='currentColor'
                  fill='none'
                  viewBox='0 0 48 48'
                  aria-hidden='true'
                >
                  <path
                    d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                    strokeWidth={2}
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
                <div className='flex text-sm text-gray-600 justify-center flex-wrap'>
                  <label
                    htmlFor='images'
                    className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'
                  >
                    <span>Upload files</span>
                    <input
                      id='images'
                      name='images'
                      type='file'
                      className='sr-only'
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      ref={fileInputRef}
                      required={imagePreviews.length === 0}
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs text-gray-500'>PNG, JPG up to 10MB each</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white py-2 md:py-3 px-6 md:px-8 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
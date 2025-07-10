const AddPost = () => {
 
  return (
    <div className='max-w-5xl mx-auto p-8 bg-white rounded-xl shadow-lg'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-800'>List Your Property</h1>
        <p className='text-gray-500 mt-2'>Fill in the details to add your property to our listings</p>
      </div>
      
      <div className='space-y-8'>
        {/* Basic Information Section */}
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200'>Basic Information</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Title*</label>
              <input 
                type="text" 
                name='title' 
                placeholder='Beautiful 3-bedroom apartment'
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all'
                required
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
                required
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200'>Location Details</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+")] bg-no-repeat bg-[center_right_0.5rem]'
                required
              >
                <option value="">Select property type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200'>Description</h2>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Detailed Description*</label>
            <textarea 
              name="description" 
              placeholder='Describe your property in detail...'
              rows={5}
              className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              required
            ></textarea>
          </div>
        </div>

        {/* Additional Details Section */}
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200'>Additional Details</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+")] bg-no-repeat bg-[center_right_0.5rem]'
              >
                <option value="">Select utilities</option>
                <option value="included">Included</option>
                <option value="not-included">Not Included</option>
              </select>
            </div>
            
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>Pet Policy</label>
              <select 
                name="petAllowed"
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNoZXZyb24tZG93biI+PHBhdGggZD0ibTYgOSA2IDYgNi02Ii8+PC9zdmc+")] bg-no-repeat bg-[center_right_0.5rem]'
              >
                <option value="">Select pet policy</option>
                <option value="yes">Pets Allowed</option>
                <option value="no">No Pets</option>
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
          </div>
        </div>

        {/* Media Upload Section */}
        <div className='bg-gray-50 p-6 rounded-lg'>
          <h2 className='text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200'>Property Media</h2>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Upload Images/Video*</label>
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
                <div className='flex text-sm text-gray-600'>
                  <label
                    htmlFor='file-upload'
                    className='relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500'
                  >
                    <span>Upload files</span>
                    <input 
                      id='file-upload' 
                      name='file-upload' 
                      type='file' 
                      className='sr-only'
                      accept="image/*,video/*"
                      multiple
                      required
                    />
                  </label>
                  <p className='pl-1'>or drag and drop</p>
                </div>
                <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
        </div>

        <div className='flex justify-end'>
          <button
            type="button"
            className='bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg font-medium'
          >
            Submit Property
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPost
import { useState } from "react";
import {
  FaBath,
  FaBed,
  FaBookmark,
  FaBus,
  FaHotel,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";
import { FaBookBookmark, FaChartArea, FaLocationDot, FaMessage, FaSchool } from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import image from "../../assets/360_F_299042079_vGBD7wIlSeNl7vOevWHiL93G4koMM967.jpg"

const SinglePage = () => {
  const position = [51.505, -0.09];
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  ];

  const openGallery = (index) => {
    setCurrentImageIndex(index);
    setIsGalleryOpen(true);
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const goToPrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90  z-50 flex items-center justify-center p-4">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <FaTimes />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-screen">
            <img
              src={images[currentImageIndex]}
              alt={`Property ${currentImageIndex + 1}`}
              className="w-full h-full object-contain"
            />

            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              &lt;
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
            >
              &gt;
            </button>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentImageIndex === index ? "bg-white" : "bg-gray-500"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-2/3">
          <div className="flex flex-col md:flex-row gap-2 h-96">
            <div
              className="md:w-3/4 h-full bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => openGallery(0)}
            >
              <img
                src={images[0]}
                alt="Main property"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:w-1/4 flex flex-col gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-1/3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openGallery(item)}
                >
                  <img
                    src={images[item]}
                    alt={`Property ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Modern Apartment in Downtown
              </h1>
              <div className="flex items-center mt-2 text-gray-600">
                <FaLocationDot className="mr-1" />
                <span>123 Main Street, New York, NY</span>
              </div>
            </div>
            <div className="flex items-center flex-col gap-2 bg-gray-100 p-3 rounded-lg">
           <div className="rounded-full w-14 h-14 overflow-hidden border-2 border-white shadow-md">
    <img 
      src={image} 
      alt="User avatar" 
      className="w-full h-full object-cover"
    />
  </div>
              <span className="font-medium">JohnDoe</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-green-600">
              $1,200 <span className="text-lg text-gray-500">/month</span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 leading-relaxed">
              This beautiful modern apartment features 2 bedrooms, 1 bathroom,
              and a spacious living area. Located in the heart of downtown with
              easy access to public transportation, restaurants, and shopping.
              The apartment comes fully furnished with all utilities included.
            </p>
          </div>
        </div>

        <div className="md:w-1/3 bg-gray-100 p-3 rounded-xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg  ">General</h3>

              <div className="bg-white ">
                <div className="flex gap-4 items-start">
                  <div className="p-3 m-2 bg-blue-100 rounded-full">
                    <FaUtensils className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Utilities</h3>
                    <div className="flex flex-wrap gap-2">
                      {["Water", "Electricity", "Internet", "Gas"].map(
                        (util) => (
                          <span
                            key={util}
                            className="bg-blue-50 text-green-700 px-3 py-1 rounded-full text-sm"
                          >
                            {util}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white ">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 m-2 bg-blue-100 rounded-full">
                      <FaUtensils className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">Pets</h3>
                      <p>pet Allowed</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white ">
                  <div className="flex gap-4 items-start">
                    <div className="p-3 m-2 bg-blue-100 rounded-full">
                      <FaUtensils className="text-green-600 text-lg" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 mb-1">
                        Property Fee
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <p> No extra Fee</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-3">Room Sizes</h3>
                <div className="grid grid-cols-3 gap-7 text-center ">
                  <div className="flex items-center px-2 text-black bg-white rounded-md">
                    <FaChartArea className="text-xl text-gray-800" />
                    <span className="text-lg  ml-1 font-medium ">80sqm</span>
                  </div>
                  <div className="flex items-center px-2 text-black bg-white">
                    <FaBed className="text-xl text-gray-800" />
                    <span className="text-lg  ml-1">3</span>
                    <span className="text-lg  ml-1 font-medium ">Bed</span>
                  </div>
                  <div className="flex items-center px-3 py-1 text-black bg-white">
                    <FaBath className="text-xl text-gray-800" />
                    <span className="text-lg  ml-1">1</span>
                    <span className="text-lg  ml-1 font-medium ">Bath</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-lg mb-3">Nearby Places</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex items-center flex-row gap-3 bg-white  rounded-md text-black">
                    <FaSchool className="text-xl ml-1" />
                    <div className="flex flex-col">
                      <span className="text-lg  ml-1">School</span>
                      <p className="text-sm  ml-1 font-medium ">25m away</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-row gap-3 bg-white  rounded-md text-black">
                    <FaBus className="text-xl ml-1" />
                    <div className="flex flex-col">
                      <span className="text-lg  ">Bu Stop</span>
                      <p className="text-sm  ml-1 font-medium ">25m away</p>
                    </div>
                  </div>
                  <div className="flex items-center flex-row gap-3 bg-white  rounded-md  text-black">
                    <FaHotel className="text-xl ml-1" />
                    <div className="flex flex-col">
                      <span className="text-lg  ml-1">Resturant</span>
                      <p className="text-sm  ml-1 font-medium ">25m away</p>
                    </div>
                  </div>
                </div>
              </div>
              {!isGalleryOpen && (
                <div className="h-64 w-full bg-gray-200 rounded-lg">
                  <MapContainer
                    center={position}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                      <Popup>Bole</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}

              <div className="flex flex-row gap-3 justify-between">
                <button className="bg-green-600 hover:bg-green-400 text-white py-2 px-3 rounded-lg font-medium transition-colors">
                  <div className="flex flex-row gap-2 text-center">
                    <FaMessage className=" mt-1"/>
                    <span >Send message</span>
                  </div>
                </button>
                <button className="border border-green-600  hover:bg-blue-50 py-2 px-3 rounded-lg font-medium transition-colors">
                  <div className="flex flex-row gap-2 text-center">
                    <FaBookmark className=" mt-1"/>
                    <span>Save place</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePage;

import { useState } from "react";
import {
  FaBath,
  FaBed,
  FaBookmark,
  FaBus,
  FaHotel,
  FaTimes,
  FaUtensils,
  FaPaw,
  FaMoneyBillWave,
} from "react-icons/fa";
import {
  FaChartArea,
  FaLocationDot,
  FaMessage,
  FaSchool,
} from "react-icons/fa6";
import { RxAvatar } from "react-icons/rx";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";

const SinglePage = () => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { post } = useLoaderData();

  const {
    Title,
    price,
    images,
    address,
    bedroom,
    bathroom,
    latitude,
    longitude,
    user,
    postDetail,
  } = post;

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

  const formatPrice = (price) => {
    return Number(price).toLocaleString();
  };
  const API_URL = "http://localhost:8800";
  
  const isValidCoordinate = (coord) => {
    const num = Number(coord);
    return !isNaN(num) && isFinite(num);
  };


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeGallery}
            className="absolute top-4 right-4 text-white text-3xl"
          >
            <FaTimes />
          </button>

          <div className="relative w-full max-w-4xl h-full max-h-screen">
            <img
              src={`${API_URL}${images[currentImageIndex]}`}
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
              {images.slice(1, 4).map((image, index) => (
                <div
                  key={index}
                  className="h-1/3 bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => openGallery(index + 1)}
                >
                  <img
                    src={`${API_URL}${image}`}
                    alt={`Property ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start mt-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{Title}</h1>
              <div className="flex items-center mt-2 text-gray-600">
                <FaLocationDot className="mr-1" />
                <span>{address}</span>
              </div>
            </div>
            <div className="flex items-center flex-col gap-2 bg-gray-100 p-3 rounded-lg">
              <div className="rounded-full w-14 h-14 overflow-hidden border-2 border-white shadow-md">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <RxAvatar className="w-full h-full text-gray-400" />
                )}
              </div>
              <span className="font-medium">{user?.username}</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-3xl font-bold text-green-600">
              ${formatPrice(price)}{" "}
              <span className="text-lg text-gray-500">/month</span>
            </p>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <div
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(postDetail.desc),
              }}
            />
          </div>
        </div>

        <div className="md:w-1/3 bg-gray-100 p-3 rounded-xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-lg">General</h3>

              <div className="bg-white p-4 rounded-lg">
                <div className="flex gap-4 items-start mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaUtensils className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Utilities</h3>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-50 text-green-700 px-3 py-1 rounded-full text-sm">
                        {postDetail.utilities}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 items-start mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaPaw className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">Pets</h3>
                    <p>{postDetail.pet}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FaMoneyBillWave className="text-green-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-1">
                      Income Requirement
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <p>{postDetail.income}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Room Sizes</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center p-2">
                    <FaChartArea className="text-xl text-gray-800" />
                    <span className="text-sm mt-1 font-medium">
                      {postDetail.size} sqm
                    </span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaBed className="text-xl text-gray-800" />
                    <span className="text-sm mt-1">{bedroom} Bed</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaBath className="text-xl text-gray-800" />
                    <span className="text-sm mt-1">{bathroom} Bath</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-3">Nearby Places</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center p-2">
                    <FaSchool className="text-xl" />
                    <span className="text-sm mt-1">School</span>
                    <p className="text-xs font-medium">
                      {postDetail.school}m away
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaBus className="text-xl" />
                    <span className="text-sm mt-1">Bus Stop</span>
                    <p className="text-xs font-medium">
                      {postDetail.bus}m away
                    </p>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <FaHotel className="text-xl" />
                    <span className="text-sm mt-1">Restaurant</span>
                    <p className="text-xs font-medium">
                      {postDetail.restaurant}m away
                    </p>
                  </div>
                </div>
              </div>

              {isValidCoordinate(latitude) && isValidCoordinate(longitude) ? (
                <div className="h-64 w-full bg-gray-200 rounded-lg">
                  <MapContainer
                    center={[Number(latitude), Number(longitude)]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[Number(latitude), Number(longitude)]}>
                      <Popup>{address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              ) : (
                <div className="h-64 w-full bg-gray-200 rounded-lg flex items-center justify-center">
                  <p>Map location not available</p>
                </div>
              )}

              <div className="flex flex-row gap-3 justify-between">
                <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <FaMessage />
                  <span>Send message</span>
                </button>
                <button className="border border-green-600 hover:bg-blue-50 py-2 px-3 rounded-lg font-medium transition-colors flex items-center gap-2">
                  <FaBookmark />
                  <span>Save place</span>
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

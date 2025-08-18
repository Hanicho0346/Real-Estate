import { Link } from "react-router-dom";
import { BiBookmark } from "react-icons/bi";
import {  FaLocationDot, } from "react-icons/fa6";
import { FaBath, FaBed } from "react-icons/fa";
import { GrContact } from "react-icons/gr";

  const API_URL = "http://localhost:8800";
const Card = ({ item }) => {
  return (
    <div className="bg-white mb-6 border-gray-100 overflow-hidden transition-transform duration-300 hover:scale-[1.01] hover:shadow-md">
      <Link to="#" className="flex flex-col md:flex-row h-full">
        <div className="w-full  md:w-75 h-40 md:h-50">
          <img
            className="w-full rounded-lg h-full object-cover"
            src={`${API_URL}${item.images[0]}`}
            alt={item.title }
          />
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1 line-clamp-1">
              {item.title }
            </h3>
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {item.description }
            </p>
            <div className="text-xl text-gray-500 mb-3 flex gap-2 flex-row ">
              <span className="justify-center align-middle mt-2">
                <FaLocationDot />
              </span>
              <div className="flex flex-row gap-2">
              <p> {item.address},</p> 
              <p>{item.city}</p>
              </div>
            </div>
            <p>
              <span className="text-2xl font-semibold text-green-600">
                {item.price?.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex flex-row gap-4">
              <div className="flex items-center  text-black">
                <FaBed />
                <span className="text-sm  ml-1">
                  {item.bedroom }
                </span>
                <span className="text-sm  ml-1 font-medium ">
                  BedRoom:
                </span>
              </div>
              <div className="flex items-center  text-balck">
                <FaBath />
                <span className="text-sm ml-1">
                  {item.bathroom}
                </span>
                <span className="text-sm font-medium ">
                  BathRoom:
                </span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button className="text-gray-500 hover:text-gray-700">
                <BiBookmark aria-label="favorite" title="favorite" size={24} className="" />
              </button>
              <button className="text-gray-500 hover:text-blue-500">
                <GrContact aria-label="contact seller" title="Contact Seller" className="" size={24} />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Card;

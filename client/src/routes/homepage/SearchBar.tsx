import React, { useState } from "react";
import { FiSearch, FiMapPin, FiHome, FiDollarSign } from "react-icons/fi";
import { Link } from "react-router-dom";

const SearchBar = () => {
  const [searchParams, setSearchParams] = useState({
    type: "",
    location: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (type) => {
    setSearchParams((prev) => ({ ...prev, type }));
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="flex bg-white rounded-xl p-1 mb-4 shadow-sm border border-gray-200">
        {["buy", "rent", "sell"].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleTypeChange(type)}
            className={`flex-1 py-2 px-4 rounded-lg font-medium capitalize transition-all ${
              searchParams.type === type
                ? "bg-emerald-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative">
            <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <FiHome className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="propertyType"
              value={searchParams.propertyType}
              onChange={(e)=>{
                const value = e.target.value;
                setSearchParams((prev) => ({
                  ...prev,
                  propertyType: value,
                }));
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>

          <div className="relative">
            <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              name="priceRange"
              value={`${searchParams.minPrice || ""}-${
                searchParams.maxPrice || ""
              }`}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setSearchParams({
                    ...searchParams,
                    minPrice: "",
                    maxPrice: "",
                  });
                } else if (value.endsWith("+")) {
                  const min = value.replace("+", "");
                  setSearchParams({
                    ...searchParams,
                    minPrice: min,
                    maxPrice: "",
                  });
                } else {
                  const [min, max] = value.split("-");
                  setSearchParams({
                    ...searchParams,
                    minPrice: min,
                    maxPrice: max,
                  });
                }
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none bg-white"
            >
              <option value="">Price Range</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-3000">$2,000 - $3,000</option>
              <option value="3000+">$3,000+</option>
            </select>
          </div>

          <Link
            to={`/list?type=${searchParams.type}&location=${searchParams.location}&propertyType=${searchParams.propertyType}&minPrice=${searchParams.minPrice}&maxPrice=${searchParams.maxPrice}`}
            className="w-full"
          >
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-2.5 px-4 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-lg"
            >
              <FiSearch className="text-lg" />
              Search
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

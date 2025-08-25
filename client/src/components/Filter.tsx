import { useState } from "react";
import { FiHome, FiSearch } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";

const Filter = () => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState({
    typeFilter: searchParams.get("type") || "",
    locationFilter: searchParams.get("location") || "",
    propertyTypeFilter: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuery((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Search result for{" "}
        <span className="font-bold text-3xl">{query.locationFilter}</span>
      </h2>
      <div className="space-y-4">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Link
            to={`/list?type=${query.typeFilter}&location=${query.locationFilter}&propertyType=${query.propertyTypeFilter} &minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 justify-center mr-2 mt-6 items-center" />
            </div>
          </Link>
          <input
            type="search"
            name="locationFilter"
            value={query.locationFilter}
            onChange={handleChange}
            placeholder="City location"
            aria-label="City location"
            className="w-full px-4 py-3 pl-10 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="minPrice"
                  value={query.minPrice}
                  min={0}
                  max={1000000}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-6 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1 justify-center items-center mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
               Property
              </label>
              <FiHome className="absolute items-center mt-5 ml-4 transform -translate-y-1/2 text-gray-400" />
              <select
                name="propertyType"
                value={query.typeFilter}
                onChange={(e)=>{
                  const value = e.target.value;
                  setQuery((prev) => ({
                    ...prev,
                    propertyTypeFilter: value,
                  }));
                }}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent appearance-none bg-white"
              >
                <option value="">Property Type</option>
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max price
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="maxPrice"
                  value={query.maxPrice}
                  min={0}
                  onChange={handleChange}
                  max={1000000}
                  placeholder="1000000"
                  className="w-full px-6 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-end">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              aria-label="Search"
              type="submit"
            >
              <FiSearch className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;

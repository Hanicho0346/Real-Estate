import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const types = ["Buy", "Rent"];

const SearchBar = () => {
  const [query, setQuery] = useState({
    type: "Buy",
    location: "",
    minPrice: 0,
    maxPrice: 0,
  });

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex mb-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={`px-4 sm:px-10 py-3 text-black rounded-lg font-medium transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
              query.type === type
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-white text-black hover:bg-gray-100"
            } ${type === "Buy" ? "rounded-r-none" : "rounded-l-none"}`}
          >
            {type}
          </button>
        ))}
      </div>

      <form className="flex flex-col bg-white rounded-lg border border-gray-300 shadow-md overflow-hidden">
        <div className="flex flex-col sm:flex-row w-full gap-2 p-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <input
              type="search"
              name="location"
              onChange={handleChange}
              value={query.location}
              placeholder="City location"
              aria-label="City location"
              className="w-full px-4 py-3 pl-10 text-gray-800 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Price Range - Min and Max will stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                name="minPrice"
                onChange={handleChange}
                value={query.minPrice}
                min={0}
                max={1000000}
                placeholder="Min price"
                className="w-full px-6 py-3 text-gray-800 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">$</span>
              </div>
              <input
                type="number"
                name="maxPrice"
                onChange={handleChange}
                value={query.maxPrice}
                min={0}
                max={1000000}
                placeholder="Max price"
                className="w-full px-6 py-3 text-gray-800 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          <Link 
            to={`/list?type=${query.type}&city=${query.location}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
            className="w-full sm:w-auto flex-shrink-0"
          >
            <button
              className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg font-medium hover:bg-green-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              aria-label="Search"
              type="submit"
            >
              <span>Search</span>
              <FiSearch className="text-xl" />
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
// Filter.js
import React from "react";
import { FiSearch } from "react-icons/fi";

const Filter = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-5">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Search result for <span className="font-bold text-3xl">London</span>
      </h2>
      <div className="space-y-4">
        <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="City location"
            aria-label="City location"
            className="w-full px-4 py-3 pl-10 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Min price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="min"
                  min={0}
                  max={1000000}
                  placeholder="0"
                  className="w-full px-6 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="max"
                  min={0}
                  max={1000000}
                  placeholder="1000000"
                  className="w-full px-6 py-2 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Max price</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">$</span>
                </div>
                <input
                  type="number"
                  name="max"
                  min={0}
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
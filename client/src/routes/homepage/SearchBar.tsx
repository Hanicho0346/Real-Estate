import React, { useState } from 'react';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';

const SearchBar = () => {
  const [searchType, setSearchType] = useState('buy');
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [priceRange, setPriceRange] = useState('');

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-6 border border-white/20">
        {['buy', 'rent', 'sell'].map((type) => (
          <button
            key={type}
            onClick={() => setSearchType(type)}
            className={`flex-1 py-3 px-4 rounded-xl font-semibold capitalize transition-all duration-300 ${
              searchType === type
                ? 'bg-white text-emerald-600 shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
            />
          </div>

          <div className="relative">
            <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none bg-white"
            >
              <option value="">Property Type</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
            </select>
          </div>


          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 appearance-none bg-white"
            >
              <option value="">Price</option>
              <option value="0-1000">$0 - $1,000</option>
              <option value="1000-2000">$1,000 - $2,000</option>
              <option value="2000-3000">$2,000 - $3,000</option>
              <option value="3000+">$3,000+</option>
            </select>
          </div>

          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-6 rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 font-semibold">
            <Search className="h-5 w-5" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
import { useState } from 'react';
import { Heart, Play, Camera, Bed, Bath, Square, MapPin, Clock } from 'lucide-react';

const FeatureList = () => {
  const [favorites, setFavorites] = useState<number[]>([]); 
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null); 

  const properties = [
    {
      id: 1,
      price: "$3,000",
      period: "/month",
      status: "For Rent",
      location: "Downtown District",
      beds: 4,
      baths: 5,
      area: 1200,
      photos: 12,
      videos: 3,
      available: "Available Now",
      description: "Beautiful architectural townhouse with modern amenities and spacious rooms.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80"
    },
    {
      id: 2,
      price: "$4,500",
      period: "/month",
      status: "For Rent",
      location: "Riverside Area",
      beds: 3,
      baths: 2,
      area: 950,
      photos: 8,
      videos: 2,
      available: "Available Now",
      description: "Luxury apartment in the heart of downtown with stunning city views.",
      image: "https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&q=80"
    },
    {
      id: 3,
      price: "$3,800",
      period: "/month",
      status: "For Rent",
      location: "Garden Heights",
      beds: 5,
      baths: 3,
      area: 1500,
      photos: 15,
      videos: 4,
      available: "Available Soon",
      description: "Spacious family home with garden views and large backyard.",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&q=80"
    },
    {
      id: 4,
      price: "$5,200",
      period: "/month",
      status: "Premium",
      location: "Elite Square",
      beds: 4,
      baths: 4,
      area: 1800,
      photos: 20,
      videos: 5,
      available: "Available Now",
      description: "Premium penthouse with panoramic city views and luxury finishes.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&q=80"
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(propertyId => propertyId !== id) 
        : [...prev, id]
    );
  };

  const viewMedia = (propertyId: number, type: 'photos' | 'videos') => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      console.log(`Viewing ${property[type]} ${type} for property ${propertyId}`);
    }
  };

  const showDetails = (propertyId: number) => {
    setSelectedProperty(propertyId);
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      console.log(`Showing details for: ${property.location}`);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
    
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
          Featured Properties
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover our handpicked selection of premium properties that offer the perfect blend of luxury, comfort, and style.
        </p>
      </div>

     
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property, index) => (
          <div 
            key={property.id}
            className='group bg-white  rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 animate-fade-in'
            style={{ animationDelay: `${index * 150}ms` }}
          >
            
            <div className="relative overflow-hidden">
              <img 
                src={property.image} 
                alt={`Property in ${property.location}`}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                onClick={() => showDetails(property.id)}
              />
              
             
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
             
              <button 
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(property.id);
                }}
              >
                <Heart 
                  className={`w-4 h-4 transition-colors duration-300 ${
                    favorites.includes(property.id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-600 hover:text-red-500'
                  }`}
                />
              </button>
              
            
              <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
                property.status === 'Premium' 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
              }`}>
                {property.status}
              </span>
           
             
              <div className="absolute bottom-3 right-3 flex gap-2">
                <span 
                  className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-black/80 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewMedia(property.id, 'photos');
                  }}
                >
                  <Camera className="w-3 h-3" /> {property.photos}
                </span>
                <span 
                  className="flex items-center gap-1 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-black/80 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    viewMedia(property.id, 'videos');
                  }}
                >
                  <Play className="w-3 h-3" /> {property.videos}
                </span>
              </div>
            </div>
          
           
            <div className="p-5">
             
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {property.price}
                    <span className="text-sm font-normal text-gray-500">{property.period}</span>
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" />
                  {property.available}
                </div>
              </div>
              
            
              <div className="flex items-center gap-1 text-gray-600 mb-4">
                <MapPin className="w-4 h-4" />
                <p className="text-sm">{property.location}</p>
              </div>
              
           
              <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mb-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Bed className="w-4 h-4 text-emerald-600" />
                  <span>{property.beds} beds</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-4 h-4 text-emerald-600" />
                  <span>{property.baths} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Square className="w-4 h-4 text-emerald-600" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
              
          
              <button 
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                onClick={() => showDetails(property.id)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="text-center mt-12">
        <button className="bg-white text-gray-800 border-2 border-gray-200 px-8 py-3 rounded-full font-semibold hover:border-emerald-500 hover:text-emerald-600 transition-all duration-300 transform hover:scale-105">
          Load More Properties
        </button>
      </div>
    </div>
  );
};

export default FeatureList;
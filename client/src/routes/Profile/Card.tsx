import { Bed, Bath, MapPin, Heart } from "lucide-react";

interface CardProps {
  item: {
    id: number;
    title: string;
    img: string;
    bedroom: number;
    bathroom: number;
    price: number;
    address: string;
  };
}

const Card = ({ item }: CardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100">
      <div className="relative overflow-hidden">
        <img
          src={item.img}
          alt={item.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition-colors" />
        </button>
        <div className="absolute bottom-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          ${item.price}/month
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-3 line-clamp-2">{item.title}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{item.address}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-gray-600">
              <Bed className="w-4 h-4" />
              <span className="text-sm">{item.bedroom}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Bath className="w-4 h-4" />
              <span className="text-sm">{item.bathroom}</span>
            </div>
          </div>
          
          <button className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
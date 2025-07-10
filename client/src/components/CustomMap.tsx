import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

interface MapItem {
  id: string | number;
  latitude?: number;
  longitude?: number;
  title: string;
  price?: number;
  img: string;
  location: string;
  type?: string;
  bedroom?: string;
  bathroom?: string;
}

interface CustomMapProps {
  center: [number, number];
  zoom: number;
  items: MapItem[];
  selectedItem: MapItem | null;
  onMarkerClick: (item: MapItem) => void;
}

const createDefaultIcon = () => {
  return new L.Icon({
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const createColoredIcon = (color: string) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const createSvgIcon = (color = "red") => {
  return new L.DivIcon({
    html: `
      <svg viewBox="0 0 24 24" width="32" height="32" fill="${color}" stroke="#fff" stroke-width="1">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    className: "svg-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

const getMarkerIcon = (item: MapItem, isSelected: boolean) => {
  if (isSelected) return createColoredIcon("green");

  switch (item.type) {
    case "apartment":
      return createColoredIcon("blue");
    case "house":
      return createColoredIcon("orange");
    case "land":
      return createSvgIcon("brown");
    default:
      return createDefaultIcon();
  }
};

const CustomMap = ({
  center,
  zoom,
  items,
  selectedItem,
  onMarkerClick,
}: CustomMapProps) => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <MapContainer
      key={`${center[0]}-${center[1]}`}
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      className="h-full w-full rounded-lg z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {items.map((item) => {
        if (!item.latitude || !item.longitude) return null;

        const position: [number, number] = [item.latitude, item.longitude];
        const isSelected = selectedItem?.id === item.id;

        return (
          <Marker
            key={item.id}
            position={position}
            icon={getMarkerIcon(item, isSelected)}
            eventHandlers={{
              click: () => onMarkerClick(item),
            }}
          >
            <Popup >
              <div className="flex gap-3 max-w-4xl max-h-xl flex-row bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-[1.02]">
                <div className="w-2/5 md:w-1/3 flex-shrink-0">
               
                  <img
                    className="h-30 w-full justify-center object-cover"
                    src={item.img}
                    alt={item.title}
                  />
              
                </div>
                <div className="flex flex-col     md:w-2/3">
                  <Link to={"/singlepage"}>
                    <h2 className="text-xl font-md text-gray-800 mb-1">
                      {item.title}
                    </h2>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      {item.price}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      {item.location}
                    </p>
                  </Link>
                  <div className="flex flex-row items-center space-x-4 text-gray-600 text-sm">
                    <div className="flex items-center">
                      
                      <span className="mr-1">🛏️</span> {item.bedroom}
                      <span className="hidden sm:inline ml-1">bed</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">🛁</span> {item.bathroom}
                      <span className="hidden sm:inline ml-1">bath</span>
                    </div>
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default CustomMap;

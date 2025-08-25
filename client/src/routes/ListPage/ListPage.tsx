import { useState, useMemo } from "react";
import Filter from "../../components/Filter";
import Card from "../../components/Card.js";
import CustomMap from "../../components/CustomMap";
import { Search, MapPin, List } from "lucide-react";
import { useLoaderData, useSearchParams, useNavigate } from "react-router-dom";
import { FaList } from "react-icons/fa";

const DEFAULT_POSITION = [51.505, -0.09];

const ListPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("both");
  const [isLoading, setIsLoading] = useState(false);
  const { post = [] } = useLoaderData();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    location: searchParams.get("location") || "",
    priceRange: searchParams.get("priceRange") || "",
    propertyType: searchParams.get("propertyType") || "",
    bedroom: searchParams.get("bedroom") || "",
    bathroom: searchParams.get("bathroom") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleFilterChange = (newQuery) => {
    setQuery(newQuery);
    setIsLoading(false);
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(newQuery)) {
      if (value) params.set(key, value);
    }
    navigate(`?${params.toString()}`);
  };

  const filteredPosts = useMemo(() => {
    return post.filter((item) => {
      if (query.type && item.type !== query.type) {
        return false;
      }

      if (
        query.location &&
        !item.address.toLowerCase().includes(query.location.toLowerCase())
      ) {
        return false;
      }

      if (query.minPrice && item.price < Number(query.minPrice)) {
        return false;
      }
      if (query.maxPrice && item.price > Number(query.maxPrice)) {
        return false;
      }
      if (query.propertyType && item.propertyType !== query.propertyType) {
        return false;
      }

      if (query.bedroom && item.bedrooms < Number(query.bedroom)) {
        return false;
      }

      if (query.bathroom && item.bathrooms < Number(query.bathroom)) {
        return false;
      }

      return true;
    });
  }, [post, query]);

  const mapCenter = useMemo(
    () =>
      selectedItem
        ? [DEFAULT_POSITION[0], DEFAULT_POSITION[1]]
        : DEFAULT_POSITION,
    [selectedItem]
  );

  const zoomLevel = useMemo(() => (selectedItem ? 15 : 13), [selectedItem]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-xl">
                <Search className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Property Search
                </h1>
                <p className="text-sm text-gray-600">
                  {filteredPosts.length} properties available
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "list"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("both")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "both"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Both
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "map"
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <MapPin className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
          {(viewMode === "list" || viewMode === "both") && (
            <div
              className={`${
                viewMode === "both" ? "lg:w-1/2" : "w-full"
              } space-y-6`}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Filters
                </h2>
                <Filter query={query} onQueryChange={handleFilterChange} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaList className="w-2 h-2 bg-green-500 rounded-full"/>
                  List of Houses
                </h2>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Search className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-700">
                      No properties found
                    </h3>
                    <p className="text-gray-500 mt-2">
                      Try adjusting your search filters to find what you're
                      looking for.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-320px)] pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {selectedItem && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            Selected: {selectedItem.title}
                          </span>
                        </div>
                      </div>
                    )}

                    {filteredPosts.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                          selectedItem?.id === item.id
                            ? "ring-2 ring-green-500 ring-offset-2 shadow-2xl"
                            : "hover:shadow-xl"
                        }`}
                      >
                        <Card item={item} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {(viewMode === "map" || viewMode === "both") && (
            <div
              className={`${
                viewMode === "both" ? "lg:w-1/2" : "w-full"
              } relative`}
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-600" />
                    Map View
                    {selectedItem && (
                      <span className="text-sm font-normal text-gray-600 ml-auto">
                        Viewing: {selectedItem.location}
                      </span>
                    )}
                  </h2>
                </div>
                <div className="h-[calc(100%-80px)]">
                  <CustomMap
                    center={mapCenter}
                    zoom={zoomLevel}
                    items={filteredPosts.map((item) => ({
                      ...item,
                      type: item.category,
                    }))}
                    selectedItem={selectedItem}
                    onMarkerClick={handleItemClick}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white rounded-full shadow-lg border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => setViewMode("list")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "list"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              viewMode === "map"
                ? "bg-green-600 text-white"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPage;

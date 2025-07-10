import SearchBar from "./SearchBar";
import image from "../../assets/Architectural White Townhouse _ Sleek Urban Elegance 🌟🏘️.jpg";

const Homepage = () => {
  const stats = [
    { value: 2400, label: "Premium Properties" },
    { value: 4600, label: "Happy Customers" },
    { value: 350, label: "Award Winning" },
  ];

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-14 xl:gap-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col gap-8 w-full lg:w-1/2 animate-fade-in">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="bg-gradient-to-r from-white via-emerald-100 to-teal-100 bg-clip-text text-transparent">
              Your Dream
            </span>
            <br />
            <span className="text-white">Home Awaits</span>
          </h1>
          <p className="text-emerald-50/90 text-lg md:text-xl max-w-lg leading-relaxed">
            Discover exceptional properties that match your lifestyle and
            aspirations. Your perfect home is just one search away.
          </p>
          <div className="relative">
            <SearchBar />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center sm:text-left group">
              <h2 className="text-3xl sm:text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                {stat.value.toLocaleString()}
                <span className="text-emerald-400">+</span>
              </h2>
              <p className="text-emerald-100/70 capitalize text-sm tracking-wide">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-1/2 animate-fade-in delay-300">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-800/20 to-teal-900/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          <img
            src={image}
            alt="Modern architectural home with elegant design"
            className="relative w-full max-w-[600px] h-[700px] rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-105 object-cover"
          />
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;

import Homepage from './HomePage';
import NavBar from '../../components/NavBar';
import FeatureList from './FeatureList';

const HomeLayout = () => {
  return (
    <div className="min-h-screen">
     
      <div className="relative bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 min-h-screen">
       
        <div className="absolute inset-0 bg-black/20"></div>
        
    
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-40 bg-gradient-to-tr from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10">
          <NavBar />
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <Homepage />
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-b from-gray-50 to-white py-20">
        <FeatureList />
      </div>
    </div>
  );
};

export default HomeLayout;
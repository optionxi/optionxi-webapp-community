import { SearchBarCustom } from "./search-bar";

const HeroSection: React.FC = () => {
 
  return (
    <div className="flex flex-col items-center justify-center px-4 relative">
      <div className="relative z-10 max-w-4xl w-full text-center ">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          <span className=" dark:text-white text-gray-900">Welcome to </span>
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            OptionXi
          </span>
        </h1>
        <p className="dark:text-gray-300 text-gray-600 text-xl mb-8">
          Experience the future of trading with our cutting-edge platform
        </p>

        {/* Search Section */}
        <SearchBarCustom/> 
        <br/>
      </div>
    </div>
  );
};

export default HeroSection;
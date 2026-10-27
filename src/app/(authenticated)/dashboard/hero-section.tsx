import { SearchBarCustom } from "./search-bar";

const HeroSection: React.FC = () => {
 
  return (
    <div className="flex flex-col items-center justify-center px-4 relative">
      <div className="relative max-w-4xl w-full text-center ">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight leading-[1.1]">
          {/* <span className="text-gray-900 dark:text-white">Welcome to </span> */}
          <span className="text-purple-700 dark:text-purple-400">OptionXi</span>
        </h1>
        <p className="dark:text-gray-300 text-gray-600 text-xl mb-8">
          India&apos;s first open source trading platform
        </p>

        {/* Search Section */}
        <SearchBarCustom/> 
        <br/>
      </div>
    </div>
  );
};

export default HeroSection;
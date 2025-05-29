import React from 'react';
import { FallbackImage } from './cust_fallback_image';

interface NoResultFoundProps {
  description: string;
}

const NoResultFound: React.FC<NoResultFoundProps> = ({ description }) => {
  return (
    <div className="flex flex-col items-center justify-center text-white m-20">
      <FallbackImage
        src="/assets/images/maintenance/img-error-404.svg"
        alt="404 Error"
        width={350}
        height={325}
        className="max-w-full h-auto mb-8"
      />
      <h1 className="text-4xl text-center font-bold mb-4">No Result Found</h1>
      <p className="text-xl text-center max-w-md text-gray-300">
        {description}
      </p>
      <br />
    </div>
  );
}

export default NoResultFound;

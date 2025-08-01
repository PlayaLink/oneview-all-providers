import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

const TeamsToggle: React.FC = () => {
  return (
    <div className="flex flex-1 items-center gap-2 px-2 rounded-lg" role="button" tabIndex={0} aria-label="CompHealth organization selector">
      <div className="flex items-center w-7 h-7 rounded-full overflow-hidden">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58"
          alt="CompHealth logo"
          className="w-7 h-7 object-cover rounded-full"
        />
      </div>
      <div className="text-white font-bold text-base leading-7" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
        CompHealth
      </div>
      <div className="text-white text-[10.5px] leading-normal tracking-[0.429px]" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
        (Salt Lake City, Utah)
      </div>
      <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" aria-hidden="true" />
    </div>
  );
};

export default TeamsToggle; 
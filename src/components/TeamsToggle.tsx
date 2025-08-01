import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faAsterisk, faCloudArrowUp, faCircleInfo, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Team data matching the design
const teams = [
  {
    id: 1,
    name: "CHG - Credentialing",
    location: "Salt Lake City, UT",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: true
  },
  {
    id: 2,
    name: "CHG - CompHealth",
    location: "Salt Lake City, UT",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  },
  {
    id: 3,
    name: "CHG - Weatherby",
    location: "Fort Lauderdale, FL",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  },
  {
    id: 4,
    name: "Modio Health QA",
    location: "San Francisco, CA",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  }
];

const TeamsToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  const handleTeamSelect = (team: typeof teams[0]) => {
    setSelectedTeam(team);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 px-2 rounded-lg hover:bg-white/10 transition-colors"
          aria-label="Team organization selector"
          aria-haspopup="true"
          data-testid="teams-toggle-trigger"
        >
          <div className="flex items-center w-7 h-7 rounded-full overflow-hidden">
            <img
              src={selectedTeam.logo}
              alt={`${selectedTeam.name} logo`}
              className="w-7 h-7 object-cover rounded-full"
            />
          </div>
          <div className="text-white font-bold text-base leading-7" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
            {selectedTeam.name}
          </div>
          <div className="text-white text-[10.5px] leading-normal tracking-[0.429px]" style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}>
            ({selectedTeam.location})
          </div>
          <FontAwesomeIcon icon={faChevronDown} className="w-4 h-4" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[333px] p-0 border-0 bg-white rounded-lg shadow-[0_0_15px_0_rgba(0,0,0,0.10)]"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="py-1 flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-end px-2 py-1 gap-2"
            data-testid="teams-header"
          >
            <div
              className="flex-1 text-[#6C757D] text-xs font-medium tracking-[0.429px]"
              style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
            >
              Select a team:
            </div>
          </div>

          {/* Team Options */}
          {teams.map((team) => (
            <button
              key={team.id}
              onClick={() => handleTeamSelect(team)}
              className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors"
              aria-label={`Select ${team.name} team`}
              data-testid={`team-option-${team.id}`}
            >
              <div
                className="flex-1 text-xs font-medium tracking-[0.429px]"
                style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                <span className="text-[#545454]">{team.name} </span>
                <span className="text-[#6C757D]">({team.location})</span>
              </div>
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faAsterisk}
                  className="w-4 h-4 text-[#F48100]"
                  aria-label="Required indicator"
                />
              </div>
            </button>
          ))}

          {/* Separator */}
          <div className="flex items-center justify-center py-1">
            <div className="w-full h-px bg-[#EAECEF]"></div>
          </div>

          {/* Action Items */}
          <button
            className="flex items-center justify-end px-2 py-1 gap-2 hover:bg-gray-50 transition-colors"
            aria-label="Upload a logo"
            data-testid="upload-logo-action"
          >
            <div className="flex items-center justify-center w-5 h-4">
              <FontAwesomeIcon
                icon={faCloudArrowUp}
                className="w-4 h-4 text-[#F48100]"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-[#545454] text-xs font-medium tracking-[0.429px]"
                style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                Upload a logo
              </div>
            </div>
          </button>

          <button
            className="flex items-center justify-end px-2 py-1 gap-2 hover:bg-gray-50 transition-colors"
            aria-label="View team profile"
            data-testid="view-team-profile-action"
          >
            <div className="flex items-center justify-center w-5 h-4">
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="w-4 h-4 text-[#79AC48]"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-[#545454] text-xs font-medium tracking-[0.429px]"
                style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                View team profile
              </div>
            </div>
          </button>

          <button
            className="flex items-center justify-end px-2 py-1 gap-2 hover:bg-gray-50 transition-colors"
            aria-label="Grid settings"
            data-testid="grid-settings-action"
          >
            <div className="flex items-center justify-center w-5 h-4">
              <FontAwesomeIcon
                icon={faScrewdriverWrench}
                className="w-4 h-4 text-[#79AC48]"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-[#545454] text-xs font-medium tracking-[0.429px]"
                style={{ fontFamily: "Poppins, -apple-system, Roboto, Helvetica, sans-serif" }}
              >
                Grid settings
              </div>
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TeamsToggle;

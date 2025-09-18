import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faAsterisk,
  faCloudArrowUp,
  faCircleInfo,
  faScrewdriverWrench,
} from "@fortawesome/free-solid-svg-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Team data matching the design
const teams = [
  {
    id: 1,
    name: "CHG - Credentialing",
    location: "Salt Lake City, UT",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: true,
  },
  {
    id: 2,
    name: "CHG - CompHealth",
    location: "Salt Lake City, UT",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false,
  },
  {
    id: 3,
    name: "CHG - Weatherby",
    location: "Fort Lauderdale, FL",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false,
  },
  {
    id: 4,
    name: "Modio Health QA",
    location: "San Francisco, CA",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false,
  },
];

interface TeamsToggleProps {
  /** Text color variant - 'dark' for white backgrounds, 'light' for dark backgrounds */
  textVariant?: 'dark' | 'light';
}

const TeamsToggle: React.FC<TeamsToggleProps> = ({ textVariant = 'light' }) => {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);

  const handleTeamSelect = (team: (typeof teams)[0]) => {
    setSelectedTeam(team);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-lg hover:bg-white/10 transition-colors"
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
          <div
            className={`font-bold text-base leading-7 ${
              textVariant === 'dark' ? 'text-gray-800' : 'text-white'
            }`}
            style={{
              fontFamily:
                "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            {selectedTeam.name}
          </div>
          <div
            className={`text-[10px] leading-normal tracking-wide ${
              textVariant === 'dark' ? 'text-gray-600' : 'text-white'
            }`}
            style={{
              fontFamily:
                "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
            }}
          >
            ({selectedTeam.location})
          </div>
          <FontAwesomeIcon
            icon={faChevronDown}
            className={`w-4 h-4 ${
              textVariant === 'dark' ? 'text-gray-600' : 'text-white'
            }`}
            aria-hidden="true"
          />
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
              className="flex-1 text-gray-500 text-xs font-medium tracking-wide"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
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
                className="flex-1 text-xs font-medium tracking-wide"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                <span className="text-gray-600">{team.name} </span>
                <span className="text-gray-500">({team.location})</span>
              </div>
              <div className="flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faAsterisk}
                  className="w-4 h-4 text-orange-500"
                  aria-label="Required indicator"
                />
              </div>
            </button>
          ))}

          {/* Separator */}
          <div className="flex items-center justify-center py-1">
            <div className="w-full h-px bg-gray-200"></div>
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
                className="w-4 h-4 text-orange-500"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-gray-600 text-xs font-medium tracking-wide"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
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
                className="w-4 h-4 text-green-500"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-gray-600 text-xs font-medium tracking-wide"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
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
                className="w-4 h-4 text-green-500"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <div
                className="text-gray-600 text-xs font-medium tracking-wide"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
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

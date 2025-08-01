import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Dummy team data
const dummyTeams = [
  {
    id: 1,
    name: "CompHealth",
    location: "Salt Lake City, Utah",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: true
  },
  {
    id: 2,
    name: "Weatherby Healthcare",
    location: "Fort Lauderdale, Florida",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  },
  {
    id: 3,
    name: "CHG Healthcare",
    location: "Salt Lake City, Utah",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  },
  {
    id: 4,
    name: "Foundation Medical Staffing",
    location: "Omaha, Nebraska",
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/47f216dffab8a61501f2184cb57a9b37a11a21ed?width=58",
    isActive: false
  }
];

const TeamsToggle: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(dummyTeams[0]);

  const handleTeamSelect = (team: typeof dummyTeams[0]) => {
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
        className="w-80 p-0 border border-gray-200 bg-white shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Select Organization</h3>
          <div className="space-y-2">
            {dummyTeams.map((team) => (
              <button
                key={team.id}
                onClick={() => handleTeamSelect(team)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  team.isActive 
                    ? 'bg-blue-50 border border-blue-200' 
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                aria-label={`Select ${team.name} organization`}
                data-testid={`team-option-${team.id}`}
              >
                <div className="flex items-center w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={team.logo}
                    alt={`${team.name} logo`}
                    className="w-8 h-8 object-cover rounded-full"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">{team.name}</div>
                  <div className="text-sm text-gray-500">{team.location}</div>
                </div>
                {team.isActive && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" aria-label="Currently selected" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TeamsToggle; 
import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Icon from "@/components/ui/Icon";

interface UserAccountProps {
  user: any;
  onLogout: () => void;
}

const UserAccount: React.FC<UserAccountProps> = ({ user, onLogout }) => {
  const [userAccountOpen, setUserAccountOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    setUserAccountOpen(false);
  };

  return (
    <Popover open={userAccountOpen} onOpenChange={setUserAccountOpen}>
      <PopoverTrigger asChild>
        <button className="flex w-9 h-9 min-w-9 min-h-9 justify-center items-center relative">
          <div
            className="flex w-9 h-9 min-w-9 min-h-9 px-1.5 py-1.5 justify-center items-center flex-shrink-0 rounded-full bg-blue-500 transition-colors hover:opacity-80"
            aria-label="User account"
            data-testid="user-avatar"
          >
            <div
              className="text-white text-center text-xs font-bold leading-4"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              JS
            </div>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="p-2 border-0 bg-white rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.10)]"
        align="end"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-end px-2 py-1 gap-2"
            data-testid="user-account-header"
          >
            <div
              className="flex-1 text-gray-400 text-xs font-medium tracking-wide"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Account
            </div>
          </div>

          {/* User Profile Section */}
          <div className="flex items-center justify-end px-2 pb-2 pt-1 gap-2">
            {/* Profile Icon */}
            <div style={{ width: "36px", minWidth: "36px", height: "36px"}} className="flex justify-center items-center rounded-full border border-gray-300 overflow-hidden">
              <Icon icon="user" className="w-8 h-8 text-gray-400" />
            </div>

            {/* User Info */}
            <div className="flex flex-col justify-center items-start flex-1">
              <div
                className="self-stretch text-gray-600 text-xs font-medium tracking-wide"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {user?.user_metadata?.full_name || "John Smith"}
              </div>
              <div
                className="self-stretch text-gray-400 text-xs font-medium tracking-wide truncate"
                style={{
                  fontFamily:
                    "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
                }}
              >
                {user?.email || "john.smith@chghealthcare.com"}
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center justify-center py-1">
            <div className="w-[251px] h-px bg-gray-200"></div>
          </div>

          {/* Logout Button */}
          <button
            className="flex items-center justify-end px-2 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={handleLogout}
            data-testid="logout-button"
          >
            <div className="flex h-4 justify-center items-center">
              <FontAwesomeIcon
                icon={faSignOut}
                className="w-4 h-4 text-red-500"
              />
            </div>
            <div
              className="flex-1 text-red-500 text-xs font-medium tracking-wide underline"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Logout
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserAccount; 
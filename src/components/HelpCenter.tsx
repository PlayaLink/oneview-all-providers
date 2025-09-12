import React, { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const HelpCenter: React.FC = () => {
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);

  return (
    <Popover open={helpCenterOpen} onOpenChange={setHelpCenterOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center justify-center pb-px transition-colors hover:opacity-80 w-6 h-6 min-w-6 min-h-6"
          aria-label="Help Center"
          data-testid="help-center-button"
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            className="w-6 h-6 min-w-6 min-h-6 text-white"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[225px] p-2 border-0 bg-white rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.05),0_8px_10px_-6px_rgba(0,0,0,0.10)]"
        align="end"
        side="bottom"
        sideOffset={4}
      >
        <div className="flex flex-col">
          {/* Header */}
          <div
            className="flex items-center justify-end px-2 py-1 gap-2"
            data-testid="help-center-header"
          >
            <div
              className="flex-1 text-gray-400 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Resources
            </div>
          </div>

          {/* Menu Items */}
          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setHelpCenterOpen(false)}
            data-testid="training-support-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Training & Support
            </div>
          </button>

          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setHelpCenterOpen(false)}
            data-testid="modio-u-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Modio U
            </div>
          </button>

          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setHelpCenterOpen(false)}
            data-testid="refer-friend-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Refer a friend
            </div>
          </button>

          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setHelpCenterOpen(false)}
            data-testid="privacy-policy-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Privacy Policy
            </div>
          </button>

          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => setHelpCenterOpen(false)}
            data-testid="terms-conditions-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              Terms & Conditions
            </div>
          </button>

          <button
            className="flex items-center justify-end px-6 py-1 gap-2 hover:bg-gray-50 transition-colors text-left"
            onClick={() => {
              window.open("https://modiohealth.com", "_blank");
              setHelpCenterOpen(false);
            }}
            data-testid="modio-website-item"
          >
            <div
              className="flex-1 text-gray-600 text-xs font-medium tracking-[0.429px]"
              style={{
                fontFamily:
                  "Poppins, -apple-system, Roboto, Helvetica, sans-serif",
              }}
            >
              modiohealth.com
            </div>
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HelpCenter; 
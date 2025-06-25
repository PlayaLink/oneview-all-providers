import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { Provider } from "@/types";

interface SidePanelProps {
  isOpen: boolean;
  provider: Provider | null;
  onClose: () => void;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, provider, onClose }) => {
  if (!provider) return null;

  return (
    <>
      {/* Side Panel */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#008BC9] text-white">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">
              {provider.lastName}, {provider.firstName}
            </h2>
            <p className="text-sm opacity-90">
              {provider.title} - {provider.primarySpecialty}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#545454] uppercase tracking-wide mb-3">
                Basic Information
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      First Name
                    </label>
                    <p className="text-sm font-medium text-[#545454]">
                      {provider.firstName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Last Name
                    </label>
                    <p className="text-sm font-medium text-[#545454]">
                      {provider.lastName}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      Title
                    </label>
                    <p className="text-sm font-medium text-[#545454]">
                      {provider.title}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wide">
                      NPI Number
                    </label>
                    <p className="text-sm font-medium text-[#545454]">
                      {provider.npiNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Primary Specialty
                  </label>
                  <p className="text-sm font-medium text-[#545454]">
                    {provider.primarySpecialty}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-[#545454] uppercase tracking-wide mb-3">
                Contact Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Work Email
                  </label>
                  <p className="text-sm font-medium text-[#545454]">
                    {provider.workEmail}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Personal Email
                  </label>
                  <p className="text-sm font-medium text-[#545454]">
                    {provider.personalEmail}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wide">
                    Mobile Phone
                  </label>
                  <p className="text-sm font-medium text-[#545454]">
                    {provider.mobilePhone}
                  </p>
                </div>
              </div>
            </div>

            {/* Tags */}
            {provider.tags && provider.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-[#545454] uppercase tracking-wide mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {provider.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Updated */}
            <div>
              <h3 className="text-sm font-semibold text-[#545454] uppercase tracking-wide mb-3">
                Last Updated
              </h3>
              <p className="text-sm font-medium text-[#545454]">
                {provider.lastUpdated}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex gap-3">
            <button className="flex-1 bg-[#008BC9] text-white py-2 px-4 rounded text-sm font-medium hover:bg-[#007399] transition-colors">
              Edit Provider
            </button>
            <button className="flex-1 bg-gray-100 text-[#545454] py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
              View Full Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidePanel;

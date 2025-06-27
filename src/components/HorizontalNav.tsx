import React from "react";
import { cn } from "@/lib/utils";

interface HorizontalNavProps {
  selectedSection: string | null;
  onSectionSelect: (section: string) => void;
}

const HorizontalNav: React.FC<HorizontalNavProps> = ({
  selectedSection,
  onSectionSelect,
}) => {
  const sections = [
    { key: "all-sections", label: "ALL SECTIONS" },
    { key: "providerInfo", label: "PROVIDER INFO" },
    { key: "licensure", label: "LICENSURE" },
    { key: "actionsExclusions", label: "ACTIONS & EXCLUSIONS" },
    { key: "certifications", label: "CERTIFICATIONS" },
    { key: "educationTraining", label: "EDUCATION & TRAINING" },
    { key: "workExperience", label: "WORK EXPERIENCE" },
    { key: "malpracticeInsurance", label: "MALPRACTICE INSURANCE" },
    { key: "documents", label: "DOCUMENTS" },
  ];

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="px-4 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => onSectionSelect(section.key)}
              className={cn(
                "px-4 py-2 text-xs font-medium tracking-wide whitespace-nowrap rounded transition-colors",
                selectedSection === section.key
                  ? "bg-[#008BC9] text-white"
                  : "text-[#545454] hover:bg-gray-50",
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HorizontalNav;

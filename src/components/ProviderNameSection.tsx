import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCopy } from "@fortawesome/free-solid-svg-icons";
import CollapsibleSection from "./CollapsibleSection";
import { SingleSelect, SingleSelectOption } from "./SingleSelect";
import { Provider } from "@/types";

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showCopyButton?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "Start typing",
  showCopyButton = false,
}) => {
  return (
    <div className="flex items-start gap-1 self-stretch">
      <div className="flex w-[153px] py-[7px] px-2 items-start gap-1">
        <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </div>
      </div>
      <div className="flex py-[6px] px-2 items-start gap-2 flex-1 rounded border border-[#E6E6E6]">
        <div className="flex-1 text-[#545454] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
        {showCopyButton && value && (
          <div className="flex w-[20.5px] h-5 py-[1.667px] px-[3.75px] justify-center items-center gap-[6.667px] rounded-[3.333px]">
            <FontAwesomeIcon
              icon={faCopy}
              className="w-3 h-3 text-[#545454] hover:text-[#008BC9] cursor-pointer transition-colors"
            />
          </div>
        )}
      </div>
    </div>
  );
};

interface DropdownFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: string[];
}

const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  value,
  onChange,
  placeholder = "Search...",
  options,
}) => {
  return (
    <div className="flex items-start gap-1 self-stretch rounded">
      <div className="flex w-[153px] max-w-[153px] py-[7px] px-2 items-start content-start gap-1 flex-wrap">
        <div className="text-[#545454] text-xs font-semibold leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {label}
        </div>
      </div>
      <div className="flex py-2 px-2 pr-0 justify-end items-center gap-1 flex-1 rounded border border-[#E6E6E6]">
        <div className="flex-1 text-[#545454] text-xs font-normal leading-normal tracking-[0.429px] font-['Poppins',sans-serif]">
          {value || <span className="text-gray-400">{placeholder}</span>}
        </div>
        <div className="flex w-[18px] justify-between items-center self-stretch rounded-r">
          <div className="flex h-4 justify-center items-center">
            <div className="flex w-[10px] h-3 flex-col justify-center text-[#212529] text-center text-4xl font-normal leading-normal">
              <FontAwesomeIcon
                icon={faCaretDown}
                className="w-[10px] h-3 text-[#212529]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProviderNameSectionProps {
  provider: Provider;
}

const ProviderNameSection: React.FC<ProviderNameSectionProps> = ({
  provider,
}) => {
  const [prefix, setPrefix] = useState("Dr.");
  const [firstName, setFirstName] = useState(provider.firstName);
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState(provider.lastName);
  const [suffix, setSuffix] = useState("");
  const [pronouns, setPronouns] = useState("");

  const prefixOptions = ["Dr.", "Mr.", "Ms.", "Mrs.", "Prof."];
  const pronounOptions = ["He/him/his", "She/her/hers", "They/them/theirs"];

  return (
    <CollapsibleSection title="Provider Name">
      <div className="flex flex-col items-start gap-2 self-stretch">
        <DropdownField
          label="Prefix"
          value={prefix}
          onChange={setPrefix}
          placeholder="Search prefixes..."
          options={prefixOptions}
        />

        <FormField
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="Start typing"
          showCopyButton={true}
        />

        <FormField
          label="Middle Name"
          value={middleName}
          onChange={setMiddleName}
          placeholder="Start typing"
        />

        <FormField
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Start typing"
          showCopyButton={true}
        />

        <FormField
          label="Suffix"
          value={suffix}
          onChange={setSuffix}
          placeholder="Start typing"
        />

        <DropdownField
          label="Pronouns"
          value={pronouns}
          onChange={setPronouns}
          placeholder="Search pronouns..."
          options={pronounOptions}
        />
      </div>
    </CollapsibleSection>
  );
};

export default ProviderNameSection;

import React, { useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import TextInput from "./TextInput";
import { SingleSelect, SingleSelectOption } from "./SingleSelect";
import { Provider } from "@/types";

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

        <TextInput
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="Start typing"
          showCopyButton={true}
        />

        <TextInput
          label="Middle Name"
          value={middleName}
          onChange={setMiddleName}
          placeholder="Start typing"
        />

        <TextInput
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Start typing"
          showCopyButton={true}
        />

        <TextInput
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

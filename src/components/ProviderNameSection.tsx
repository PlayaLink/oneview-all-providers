import React, { useState } from "react";
import CollapsibleSection from "./CollapsibleSection";
import TextInput from "./TextInput";
import { SingleSelect, SingleSelectOption } from "./inputs/SingleSelect";
import { Provider } from "@/types";

interface ProviderNameSectionProps {
  provider: Provider;
}

const ProviderNameSection: React.FC<ProviderNameSectionProps> = ({
  provider,
}) => {
  const [prefix, setPrefix] = useState<SingleSelectOption | null>({
    id: 1,
    label: "Dr.",
  });
  const [firstName, setFirstName] = useState(provider.firstName);
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState(provider.lastName);
  const [suffix, setSuffix] = useState("");
  const [pronouns, setPronouns] = useState<SingleSelectOption | null>(null);

  const prefixOptions: SingleSelectOption[] = [
    { id: 1, label: "Dr." },
    { id: 2, label: "Mr." },
    { id: 3, label: "Ms." },
    { id: 4, label: "Mrs." },
    { id: 5, label: "Prof." },
  ];

  const pronounOptions: SingleSelectOption[] = [
    { id: 1, label: "He/him/his" },
    { id: 2, label: "She/her/hers" },
    { id: 3, label: "They/them/theirs" },
  ];

  return (
    <CollapsibleSection title="Provider Name">
      <div className="flex flex-col items-start gap-2 self-stretch">
        <SingleSelect
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
          showCopyButton={true}
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
          showCopyButton={true}
        />

        <SingleSelect
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

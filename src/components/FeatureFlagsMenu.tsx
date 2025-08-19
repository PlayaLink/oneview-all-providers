import React from 'react';
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

const FeatureFlagsMenu: React.FC = () => {
  const { allSettings, updateFlag, isLoading } = useFeatureFlags();

  return (
    <div className="p-4 flex flex-col gap-4 border-b border-gray-200">
      {/* Feature Flags */}
      <div className="pt-2 pb-1">
        <h3 className="text-md font-semibold text-gray-900 mb-1">Feature Flags</h3>
      </div>
      {allSettings.map(setting => (
        <div key={setting.setting_key} className="mb-4 flex items-center justify-between">
          <label className="font-medium text-gray-700">
            {setting.label || setting.setting_key}
          </label>
          <Switch
            checked={!!setting.setting_value}
            onCheckedChange={(checked) => updateFlag(setting.setting_key as any, checked)}
            disabled={isLoading}
            className={!!setting.setting_value ? "data-[state=checked]:bg-blue-500" : ""}
          />
        </div>
      ))}
    </div>
  );
};

export default FeatureFlagsMenu; 
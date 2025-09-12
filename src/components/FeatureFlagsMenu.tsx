import React from 'react';
import { Switch } from "@/components/ui/switch";
import { useFeatureFlags } from "@/contexts/FeatureFlagContext";

interface FeatureFlagsMenuProps {
  isAnnotationMode: boolean;
  setAnnotationMode: (value: boolean) => void;
}

const FeatureFlagsMenu: React.FC<FeatureFlagsMenuProps> = ({ isAnnotationMode, setAnnotationMode }) => {
  const { allSettings, updateFlag, isLoading } = useFeatureFlags();

  return (
    <div className="p-4 flex flex-col gap-4 border-b border-gray-200" data-testid="feature-flags-menu">
      {/* Feature Flags */}
      <div className="pt-2 pb-1">
        <div className="mb-4 flex items-center justify-between">
          <label htmlFor="annotation-mode-toggle">Annotation Mode</label>
          <Switch id="annotation-mode-toggle" checked={isAnnotationMode} onCheckedChange={setAnnotationMode} />
        </div>
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
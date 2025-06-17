// پنل تنظیمات برای این بلاک

import React from 'react';

type Props = {
  settings: any;
  onChange: (newSettings: any) => void;
};

export const TextSettings = ({ settings, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label>
        متن:
        <input
          type="text"
          value={settings.text}
          onChange={(e) => onChange({ ...settings, text: e.target.value })}
        />
      </label>

      <label>
        سایز فونت:
        <input
          type="text"
          value={settings.fontSize}
          onChange={(e) => onChange({ ...settings, fontSize: e.target.value })}
        />
      </label>

      <label>
        رنگ:
        <input
          type="color"
          value={settings.color}
          onChange={(e) => onChange({ ...settings, color: e.target.value })}
        />
      </label>

      <label>
        ترازبندی:
        <select
          value={settings.textAlign}
          onChange={(e) => onChange({ ...settings, textAlign: e.target.value })}
        >
          <option value="left">چپ‌چین</option>
          <option value="center">وسط‌چین</option>
          <option value="right">راست‌چین</option>
        </select>
      </label>
    </div>
  );
};

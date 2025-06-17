// پنل تنظیمات عمومی مثل padding, margin
import React from 'react';

type Props = {
  styles: any;
  onChange: (newStyles: any) => void;
};

export const SharedStylesPanel = ({ styles, onChange }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <label>
        Padding:
        <input
          type="text"
          value={styles.padding || ''}
          onChange={(e) => onChange({ ...styles, padding: e.target.value })}
        />
      </label>

      <label>
        Margin:
        <input
          type="text"
          value={styles.margin || ''}
          onChange={(e) => onChange({ ...styles, margin: e.target.value })}
        />
      </label>

      <label>
        پس‌زمینه:
        <input
          type="color"
          value={styles.backgroundColor || '#ffffff'}
          onChange={(e) =>
            onChange({ ...styles, backgroundColor: e.target.value })
          }
        />
      </label>

      <label>
        Border Radius:
        <input
          type="text"
          value={styles.borderRadius || ''}
          onChange={(e) =>
            onChange({ ...styles, borderRadius: e.target.value })
          }
        />
      </label>
    </div>
  );
};

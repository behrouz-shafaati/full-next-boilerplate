// کامپوننت نمایشی بلاک

import React from 'react';

export const TextBlock = ({ settings }: { settings: any }) => {
  return (
    <p
      style={{
        fontSize: settings.fontSize || '16px',
        fontWeight: settings.fontWeight || 'normal',
        textAlign: settings.textAlign || 'left',
        color: settings.color || '#000',
      }}
    >
      {settings.text || 'متن پیش‌فرض'}
    </p>
  );
};

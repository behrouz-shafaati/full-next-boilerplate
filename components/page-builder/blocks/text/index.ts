// ثبت بلاک در رجیستری

import { TextBlock } from './TextBlock';
import { TextSettings } from './TextSettings';

export const TextBlockDef = {
  type: 'text',
  label: 'متن',
  defaultSettings: {
    text: 'متن پیش‌فرض',
    fontSize: '16px',
    fontWeight: 'normal',
    textAlign: 'left',
    color: '#000000',
  },
  Component: TextBlock,
  Settings: TextSettings,
};

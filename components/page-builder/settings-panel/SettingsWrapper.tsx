// نمایش تنظیمات با توجه به بلاک انتخابی
import React from 'react';
import { SharedStylesPanel } from './SharedStylesPanel';
import { blockRegistry } from '@/components/page-builder/registry/blockRegistry';
import { BaseBlock } from '@/components/page-builder/types';

type Props = {
  block: BaseBlock;
  onUpdate: (updatedBlock: BaseBlock) => void;
};

export const SettingsWrapper = ({ block, onUpdate }: Props) => {
  const BlockDef = blockRegistry[block.type];
  if (!BlockDef) return null;

  const handleStyleChange = (newStyles: any) => {
    onUpdate({ ...block, styles: newStyles });
  };

  const handleSettingsChange = (newSettings: any) => {
    onUpdate({ ...block, settings: newSettings });
  };

  return (
    <div className="flex flex-col gap-4">
      <h3>تنظیمات عمومی</h3>
      <SharedStylesPanel styles={block.styles} onChange={handleStyleChange} />

      <h3>تنظیمات اختصاصی</h3>
      <BlockDef.Settings
        settings={block.settings}
        onChange={handleSettingsChange}
      />
    </div>
  );
};

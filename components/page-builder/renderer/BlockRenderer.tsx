// رندر کردن بلاک‌ها از روی JSON

import React from "react";
import { blockRegistry } from "@/components/page-builder/registry/blockRegistry";
import type { BaseBlock } from "@/components/page-builder/types";

type Props = {
  block: BaseBlock;
};

export const BlockRenderer = ({ block }: Props) => {
  const BlockDef = blockRegistry[block.type];
  if (!BlockDef) return <div>بلاک ناشناخته: {block.type}</div>;

  const Component = BlockDef.Component;

  return (
    <div style={block.styles}>
      <Component settings={block.settings} />
      {block.children?.length > 0 &&
        block.children.map((child) => (
          <BlockRenderer key={child.id} block={child} />
        ))}
    </div>
  );
};

  
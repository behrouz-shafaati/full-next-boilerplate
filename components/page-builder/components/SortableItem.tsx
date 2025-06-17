import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { blockRegistry } from '@/components/page-builder/registry/blockRegistry';
import { BaseBlock } from '../types';

type SortableItemProp = {
  item: BaseBlock,
  index: number,
  colId: string
}
export default function SortableItem({
  item,
  index,
  colId,
}: SortableItemProp) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
    });
  console.log('#@222222:', item);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const block = blockRegistry[item.type];
  const Component = block.Component;
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="mb-2"
    >
      <Component settings={block.defaultSettings} />
    </div>
  );
}

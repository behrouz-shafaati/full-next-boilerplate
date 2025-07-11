import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageRow } from '../../types'
import { GripVertical, Settings, Trash } from 'lucide-react'
import DroppableColumn from '../../components/DroppableColumn'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { computedStyles } from '../../utils/styleUtils'

export default function SortableRow({ row }: { row: PageRow }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
      data: {
        type: 'row',
      },
    })

  const { deleteItem, selectBlock, activeElement, selectedBlock } =
    useBuilderStore()
  console.log('#228 activeElement:', activeElement)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: activeElement?.type === 'row' ? '16px' : '0',
  }

  let activeClass = ''
  if (selectedBlock?.id == row.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  return (
    <div className={`${activeClass}`}>
      <div
        ref={setNodeRef}
        {...attributes}
        style={{ ...style, ...computedStyles(row.styles) }}
        key={`row-${row.id}`}
        className={`border rounded cursor-default relative group/row transition-all duration-300 ease-in-out`}
      >
        <div
          key={`div-${row.id}`}
          className="absolute top-1 -right-9  flex flex-col align-middle items-center justify-between pl-2 gap-2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          <GripVertical
            className="h-5 w-5  text-gray-400 cursor-grab"
            {...listeners}
            key={`gri-${row.id}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation() // جلوگیری از propagate شدن به document
              selectBlock({
                id: row.id,
                type: 'row',
                styles: row.styles,
                settings: row.settings,
              })
            }}
          >
            <Settings className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => deleteItem(row.id)}
          >
            <Trash className="h-5 w-5 text-gray-500" />
          </Button>
        </div>

        <div key={`div-col-${row.id}`} className="grid grid-cols-12 gap-4">
          {row.columns.map((col) => (
            <DroppableColumn key={`drop-${col.id}`} rowId={row.id} col={col} />
          ))}
        </div>
      </div>
    </div>
  )
}

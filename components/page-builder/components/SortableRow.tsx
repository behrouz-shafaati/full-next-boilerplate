import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { PageRow } from '../types'
import { GripVertical, MailIcon, Trash } from 'lucide-react'
import DroppableColumn from './DroppableColumn'
import { useBuilderStore } from '../store/useBuilderStore'
import Select from '@/components/form-fields/select'
import { Button } from '@/components/ui/button'

export default function SortableRow({ row }: { row: PageRow }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
    })

  const { addColumn, updateRowColumns, deleteRow } = useBuilderStore()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const columnOptions = [
    {
      label: '3-3-3-3',
      value: '3-3-3-3',
    },
    {
      label: '4-4-4',
      value: '4-4-4',
    },
    {
      label: '6-6',
      value: '6-6',
    },
    {
      label: '12',
      value: '12',
    },
    {
      label: '3-6-3',
      value: '3-6-3',
    },
    {
      label: '2-8-2',
      value: '2-8-2',
    },
  ]

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      key={`row-${row.id}`}
      className="p-4 border bg-white rounded cursor-default"
    >
      <div
        key={`div-${row.id}`}
        className="flex gap-2 items-center mb-2 justify-between"
      >
        <div>
          <GripVertical
            className="h-5 w-5 ml-2 text-gray-400 cursor-grab"
            {...listeners}
            key={`gri-${row.id}`}
          />
        </div>
        <div className="flex gap-2 flex-row items-center">
          {/* columns count */}
          <Select
            title=""
            name="status"
            defaultValue="4-4-4"
            options={columnOptions}
            placeholder="چینش ستون"
            onChange={(value) => {
              updateRowColumns(row.id, value)
            }}
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="size-8"
            onClick={() => deleteRow(row.id)}
          >
            <Trash className="h-5 w-5 text-gray-500" />
          </Button>
          {/* <button
          type="button"
          onClick={() => addColumn(row.id)}
          className="bg-blue-500 text-white px-3 py-1 rounded"
        >
          افزودن ستون
        </button> */}
        </div>
      </div>

      <div key={`div-col-${row.id}`} className="grid grid-cols-12 gap-4">
        {row.columns.map((col) => (
          <DroppableColumn key={`drop-${col.id}`} rowId={row.id} col={col} />
        ))}
      </div>
    </div>
  )
}

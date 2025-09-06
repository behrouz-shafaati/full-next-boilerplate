import { NodeViewWrapper } from '@tiptap/react'

export default function AdSlotView({ node, updateAttributes }) {
  const { slotId } = node.attrs

  return (
    <NodeViewWrapper className="ad-slot-node border p-2">
      تابلو تبلیغاتی
      {/* <select
        value={slotId}
        onChange={(e) => updateAttributes({ slotId: e.target.value })}
      >
        <option value="banner_1">بنر ۱</option>
        <option value="banner_2">بنر ۲</option>
        <option value="video_1">ویدئو ۱</option>
      </select> */}
    </NodeViewWrapper>
  )
}

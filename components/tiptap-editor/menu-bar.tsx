import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  PilcrowLeft,
  PilcrowRight,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group'
import { Editor } from '@tiptap/core'

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
  }

  const bold = () => editor.chain().focus().toggleBold().run()
  window.bold = bold
  const italic = () => editor.chain().focus().toggleItalic().run()
  window.italic = italic
  const underline = () => editor.chain().focus().toggleUnderline().run()
  window.underline = underline
  const strike = () => editor.chain().focus().toggleStrike().run()
  window.strike = underline
  const code = () => editor.chain().focus().toggleCode().run()
  window.code = code
  const clearMarks = () => editor.chain().focus().unsetAllMarks().run()
  window.clearMarks = clearMarks
  const clearNodes = () => editor.chain().focus().clearNodes().run()
  window.clearNodes = clearNodes
  const paragraph = () => editor.chain().focus().setParagraph().run()
  window.paragraph = paragraph
  const h1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run()
  window.h1 = h1
  const h2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run()
  window.h2 = h2
  const h3 = () => editor.chain().focus().toggleHeading({ level: 3 }).run()
  window.h3 = h3
  const h4 = () => editor.chain().focus().toggleHeading({ level: 4 }).run()
  window.h4 = h4
  const h5 = () => editor.chain().focus().toggleHeading({ level: 5 }).run()
  window.h5 = h5
  const h6 = () => editor.chain().focus().toggleHeading({ level: 6 }).run()
  window.h6 = h6
  const bulletList = () => editor.chain().focus().toggleBulletList().run()
  window.bulletList = bulletList
  const orderedList = () => editor.chain().focus().toggleOrderedList().run()
  window.orderedList = orderedList
  const codeBlock = () => editor.chain().focus().toggleCodeBlock().run()
  window.codeBlock = codeBlock
  const blockQuote = () => editor.chain().focus().toggleBlockquote().run()
  window.blockQuote = blockQuote
  const horizontalRule = () => editor.chain().focus().setHorizontalRule().run()
  window.horizontalRule = horizontalRule
  const hardBreak = () => editor.chain().focus().setHardBreak().run()
  window.hardBreak = hardBreak
  const undo = () => editor.chain().focus().undo().run()
  window.undo = undo
  const redo = () => editor.chain().focus().redo().run()
  window.redo = redo
  const left = () => editor.chain().focus().setTextAlign('left').run()
  window.left = left
  const center = () => editor.chain().focus().setTextAlign('center').run()
  window.center = center
  const right = () => editor.chain().focus().setTextAlign('right').run()
  window.right = right
  const justify = () => editor.chain().focus().setTextAlign('justify').run()
  window.justify = justify
  const rtl = () => editor?.commands.setDirection('rtl')
  window.rtl = rtl
  const ltr = () => editor?.commands.setDirection('ltr')
  window.ltr = ltr
  const link = () => {
    console.log("editor.isActive('link'):", editor.isActive('link'))
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
      return
    }
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }
  window.link = link

  const activeStates = {
    bold: editor.isActive('bold'),
    italic: editor.isActive('italic'),
    underline: editor.isActive('underline'),
    strike: editor.isActive('strike'),
    quote: editor.isActive('quote'),
    code: editor.isActive('code'),
    paragraph: editor.isActive('paragraph'),
    h1: editor.isActive('heading', { level: 1 }),
    h2: editor.isActive('heading', { level: 2 }),
    h3: editor.isActive('heading', { level: 3 }),
    h4: editor.isActive('heading', { level: 4 }),
    h5: editor.isActive('heading', { level: 5 }),
    h6: editor.isActive('heading', { level: 6 }),
    bulletList: editor.isActive('bulletList'),
    orderedList: editor.isActive('orderedList'),
    codeBlock: editor.isActive('codeBlock'),
    blockQuote: editor.isActive('blockquote'),
    left: editor.isActive({ textAlign: 'left' }),
    center: editor.isActive({ textAlign: 'center' }),
    right: editor.isActive({ textAlign: 'right' }),
    justify: editor.isActive({ textAlign: 'justify' }),
    link: editor.isActive('link'),
    rtl: editor.isActive('direction', { direction: 'rtl' }),
    ltr: editor.isActive('direction', { direction: 'ltr' }),
  }

  const data = {
    html: editor.getHTML(),
    json: editor.getJSON(),
  }

  if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        data,
        activeStates,
      })
    )
  }

  if (window.ReactNativeWebView) return null

  const getTypography = () => {
    if (activeStates.h1) return 'h1'
    if (activeStates.h2) return 'h2'
    if (activeStates.h3) return 'h3'
    if (activeStates.h4) return 'h4'
    if (activeStates.bulletList) return 'bulletList'
    if (activeStates.orderedList) return 'orderedList'
    return ''
  }

  const getAlign = () => {
    if (activeStates.left) return 'left'
    if (activeStates.right) return 'right'
    if (activeStates.center) return 'center'
    if (activeStates.justify) return 'justify'
    return ''
  }
  const getDirection = () => {
    if (activeStates.rtl) return 'rtl'
    if (activeStates.ltr) return 'ltr'
    return ''
  }

  return (
    <div className="flex flex-row gap-1 py-2 rtl items-center max-w-full">
      <ToggleGroup
        type="multiple"
        value={[
          activeStates.bold ? 'bold' : '',
          activeStates.italic ? 'italic' : '',
          activeStates.blockQuote ? 'blockQuote' : '',
          activeStates.underline ? 'underline' : '',
        ]}
        className="rtl"
      >
        <ToggleGroupItem value="bold" onClick={bold}>
          <Bold />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" onClick={italic}>
          <Italic />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" onClick={underline}>
          <UnderlineIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="strikethrough" onClick={strike}>
          <Strikethrough />
        </ToggleGroupItem>
        <ToggleGroupItem value="blockQuote" onClick={blockQuote}>
          <Quote />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="w-px h-6 bg-border block" />
      <ToggleGroup type="single" value={getTypography()} className="rtl">
        <ToggleGroupItem value="h1" onClick={h1}>
          <Heading1 />
        </ToggleGroupItem>
        <ToggleGroupItem value="h2" onClick={h2}>
          <Heading2 />
        </ToggleGroupItem>
        <ToggleGroupItem value="h3" onClick={h3}>
          <Heading3 />
        </ToggleGroupItem>
        <ToggleGroupItem value="h4" onClick={h4}>
          <Heading4 />
        </ToggleGroupItem>
        <ToggleGroupItem value="bulletList" onClick={bulletList}>
          <List />
        </ToggleGroupItem>
        <ToggleGroupItem value="orderedList" onClick={orderedList}>
          <ListOrdered />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="w-px h-6 bg-border block" />
      <ToggleGroup type="single" value={getAlign()} className="rtl">
        <ToggleGroupItem value="left" onClick={left}>
          <AlignLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" onClick={center}>
          <AlignCenter />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" onClick={right}>
          <AlignRight />
        </ToggleGroupItem>
        <ToggleGroupItem value="justify" onClick={justify}>
          <AlignJustify />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="w-px h-6 bg-border block" />
      <ToggleGroup type="single" value={getDirection()} className="rtl">
        <ToggleGroupItem value="rtl" onClick={rtl} title="راست چین">
          <PilcrowLeft />
        </ToggleGroupItem>
        <ToggleGroupItem value="ltr" onClick={ltr} title="چپ چین">
          <PilcrowRight />
        </ToggleGroupItem>
      </ToggleGroup>
      <div className="w-px h-6 bg-border block" />
      <ToggleGroup type="single" value="" className="rtl">
        <ToggleGroupItem value="link" onClick={link}>
          {activeStates.link ? <Link2Off /> : <Link2 />}
        </ToggleGroupItem>
        <ToggleGroupItem value="horizontalRule" onClick={horizontalRule}>
          <Minus />
        </ToggleGroupItem>
        <ToggleGroupItem value="redo" onClick={redo} title="بازیابی تغییر">
          <Redo2 />
        </ToggleGroupItem>
        <ToggleGroupItem value="undo" onClick={undo} title="لغو آخرین تغییر">
          <Undo2 />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}

export default MenuBar

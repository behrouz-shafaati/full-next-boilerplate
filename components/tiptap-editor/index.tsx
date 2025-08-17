'use client'

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Direction from './extensions/extension-direction'
import { CustomTable } from './extensions/CustomTable'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Underline } from '@tiptap/extension-underline'
import { Heading } from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import FileUpload, { FileUploadRef } from '../form-fields/file-upload'
import { FileDetails } from '@/lib/entity/file/interface'
import DeleteImageWithKey from './extensions/image-delete'
import { useRef, useState } from 'react'

import styles from './editor.module.css'
import MenuBar from './menu-bar'
import { CustomImage } from './extensions/CustomImage'

interface TiptapEditor {
  name: string
  defaultContent?: { [key: string]: any }
  onChange?: (content: string) => void
  onChangeFiles?: () => void
}

export default function TiptapEditor({
  name,
  defaultContent = {},
  onChange,
  onChangeFiles,
}: TiptapEditor) {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const [content, SetContent] = useState(JSON.stringify(defaultContent))
  // for table tools like aadd row ...
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null)
  const handleContextMenu = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('table')) {
      e.preventDefault()
      setPos({ x: e.clientX, y: e.clientY })
    } else {
      setPos(null)
    }
  }
  const defaultFiles = defaultContent?.content
    ?.filter((block: any) => block.type === 'image')
    .map((block: any) => block.attrs)
  const editor: any = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // 👈 اینجا heading داخل StarterKit رو خاموش کن
      }),
      Image,
      Link.configure({
        openOnClick: false,
        validate: (href) => /^https?:\/\//.test(href),
      }),
      Direction,
      Underline,
      Heading.configure({
        levels: [1, 2, 3, 4], // میتونی مشخص کنی چه level هایی رو ساپورت کنه
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      DeleteImageWithKey.configure({
        deleteFileHandler: (id: string) => {
          console.log('🗑 حذف از سرور:', id)
          fileUploadRef.current?.removeFileById(id)
        },
      }),
      CustomImage,
      CustomTable.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultContent,
    onUpdate({ editor }) {
      const json = editor?.getJSON()
      const text = JSON.stringify(json)
      SetContent(text)
      onChange?.(text)
    },
  })

  const responseFileUploadHandler = (fileDetails: FileDetails) => {
    const { state, view } = editor
    const pos = state.selection.from
    editor
      ?.chain()
      .focus()
      .insertContentAt(pos, {
        type: 'image',
        attrs: {
          src: fileDetails.src,
          alt: fileDetails.alt,
          title: String(fileDetails.id), // Image Id saved as title
          id: String(fileDetails.id),
        },
      })
      .setTextSelection(pos)
      .focus()
      .run()
    // requestAnimationFrame(() => {
    //   onChangeFiles?.()
    // })
  }
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-10">
        <textarea
          value={content}
          name={name}
          className="w-full ltr"
          read-only="true"
          onChange={() => {}}
        />
        <MenuBar editor={editor} />

        <div
          onContextMenu={handleContextMenu}
          className={`${styles.editor} relative`}
        >
          <EditorContent
            editor={editor}
            autoFocus
            className="prose prose-sm max-w-full outline-none focus:outline-none focus:ring-0 focus:border-transparent 
            focus-within:[&>div]:outline-none focus-within:[&>div]:ring-0 border p-4 rounded-lg bg-white dark:bg-neutral-900
            "
          />
        </div>
      </div>
      <div className="col-span-2">
        <FileUpload
          name={`${name}Files`}
          title="رسانه های مطلب"
          responseHnadler={responseFileUploadHandler}
          ref={fileUploadRef}
          showDeleteButton={false}
          defaultValues={defaultFiles}
          {...(onChangeFiles ? { onChange: onChangeFiles } : {})}
        />
      </div>
    </div>
  )
}

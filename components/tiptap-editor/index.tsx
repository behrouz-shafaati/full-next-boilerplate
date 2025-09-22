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
import { useEffect, useRef, useState } from 'react'
import { AdSlot } from './extensions/adSlot'

import styles from './editor.module.css'
import MenuBar from './menu-bar'
import { CustomImage } from './extensions/CustomImage'
import {
  Accordion,
  AccordionItem,
  AccordionItemContent,
  AccordionItemTitle,
} from './extensions/Accordion'
import { SubmitButton } from '../form-fields/submit-button'
import { getFiles } from '@/lib/entity/file/actions'

interface TiptapEditor {
  name: string
  defaultContent?: { [key: string]: any }
  onChange?: (content: string) => void
  onChangeFiles?: () => void
  showSubmitButton: boolean
  attachedTo: [{ feature: string; id: string }]
}

export default function TiptapEditor({
  name,
  defaultContent = {},
  onChange,
  onChangeFiles,
  showSubmitButton,
  attachedTo,
}: TiptapEditor) {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const [content, SetContent] = useState(JSON.stringify(defaultContent))
  const [defaultFiles, setDefaultFiles] = useState([])
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

  useEffect(() => {
    let active = true
    async function fetchData() {
      const defaultFileIds = defaultContent?.content
        ?.filter((block: any) => block.type === 'image')
        .map((block: any) => block.attrs.id)
      if (!defaultFileIds?.length) return
      try {
        const files = await getFiles(defaultFileIds)
        if (active) {
          console.log('$3495867 defaultFiles:', files)
          setDefaultFiles(files.data)
        }
      } catch (err) {
        console.error('#2349875 Error fetching files:', err)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [defaultContent])

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
      AdSlot,
      Accordion,
      AccordionItem,
      AccordionItemContent,
      AccordionItemTitle,
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
    console.log('#2345 fileDetails:', fileDetails)
    const { state, view } = editor
    const pos = state.selection.from
    editor
      ?.chain()
      .focus()
      .insertContentAt(pos, {
        type: 'image',
        attrs: {
          src: fileDetails.src,
          alt: fileDetails.id,
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
    <div
      className="grid grid-cols-12 gap-4"
      onClick={(e) => {
        const target = e.target as HTMLElement
        // اگر کلیک روی دکمه یا آیکون یا خود EditorContent بود کاری نکن
        if (target.closest('button') || target.closest('[data-no-focus]')) {
          return
        }
        editor?.chain().focus().run()
      }}
    >
      <div className="col-span-12 md:col-span-10">
        <textarea
          value={content}
          name={name}
          className="hidden w-full ltr"
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
      <div className="col-span-12  md:col-span-2">
        <div className="sticky top-0 z-10">
          <FileUpload
            key={defaultFiles?.map((f) => f.id).join(',') || 'empty'} // 👈 تغییر باعث remount میشه
            attachedTo={attachedTo}
            name={`${name}Files`}
            title="رسانه های مطلب"
            responseHnadler={responseFileUploadHandler}
            ref={fileUploadRef}
            showDeleteButton={false}
            defaultValues={defaultFiles}
            {...(onChangeFiles ? { onChange: onChangeFiles } : {})}
          />
          {showSubmitButton ? <SubmitButton className="mt-4" /> : <></>}
        </div>
      </div>
    </div>
  )
}

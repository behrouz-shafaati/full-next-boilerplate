'use client'

import { useEditor, EditorContent, findChildren } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Direction from './extensions/extension-direction'
import TextAlign from '@tiptap/extension-text-align'
import FileUpload, { FileUploadRef } from '../form-fields/file-upload'
import { FileDetails } from '@/lib/entity/file/interface'
import ImageDeletePlugin from './plugins/image-delete'
import DeleteImageWithKey from './extensions/image-delete'
import { NodeSelection } from 'prosemirror-state'
import { useEffect, useRef, useState } from 'react'
import renderIcon from '../icons'
import { Button } from '../custom/button'

export default function TiptapEditor() {
  const fileUploadRef = useRef<FileUploadRef>(null)
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link,
      Direction,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      DeleteImageWithKey.configure({
        deleteFileHandler: (src) => {
          console.log('🗑 حذف از سرور:', src)
          fileUploadRef.current?.removeFile(0)
        },
      }),
    ],
    content: '<p>سلام، این یک متن تست فارسی است!</p>',
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
          src: fileDetails.url,
          alt: fileDetails.alt,
          title: String(fileDetails.id),
        },
      })
      .setTextSelection(pos)
      .focus()
      .run()
  }

  useEffect(() => {
    if (!editor) return

    const updateSelectionInfo = () => {
      const { state, view } = editor
      const selection = state.selection
      const doc = state.doc

      const info = {
        from: selection.from,
        to: selection.to,
        empty: selection.empty,
        isNodeSelection: selection instanceof NodeSelection,
        selectedNodeType:
          selection instanceof NodeSelection
            ? selection.node?.type?.name
            : null,
        selectedNodeContent:
          selection instanceof NodeSelection ? selection.node?.content : null,
        focus: view.hasFocus(),
        docType: doc.type,
      }

      console.log('🟡 Selection Info:', info)
    }

    editor.on('selectionUpdate', updateSelectionInfo)
    editor.on('focus', updateSelectionInfo)
    editor.on('blur', updateSelectionInfo)

    // initial load
    updateSelectionInfo()

    return () => {
      editor.off('selectionUpdate', updateSelectionInfo)
      editor.off('focus', updateSelectionInfo)
      editor.off('blur', updateSelectionInfo)
    }
  }, [editor])

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-10">
        <Button onClick={() => editor?.commands.setDirection('rtl')}>
          <div className="ml-2">{renderIcon('user')}</div>
        </Button>
        <button onClick={() => editor?.commands.setDirection('ltr')}>
          چپ‌چین
        </button>

        <EditorContent
          editor={editor}
          autoFocus
          className="prose prose-sm max-w-full outline-none focus:outline-none focus:ring-0 focus:border-transparent focus-within:[&>div]:outline-none focus-within:[&>div]:ring-0 border p-4 rounded-lg bg-white dark:bg-neutral-900"
        />
        <button
          onClick={() => {
            const html = editor?.getHTML()
            const json = editor?.getJSON()

            // ارسال به سرور
            // fetch('/api/posts', {
            //   method: 'POST',
            //   body: JSON.stringify({
            //     contentHtml: html,
            //     contentJson: json,
            //   }),
            //   headers: {
            //     'Content-Type': 'application/json',
            //   },
            // })

            console.log({
              contentHtml: html,
              contentJson: json,
            })
            console.log(
              JSON.stringify({
                contentHtml: html,
                contentJson: json,
              })
            )
            console.log('✅ داده‌ها ارسال شدند')
          }}
        >
          ذخیره محتوا
        </button>
      </div>
      <div className="col-span-2">
        <FileUpload
          name="tiptapfiles"
          title="رسانه های مطلب"
          responseHnadler={responseFileUploadHandler}
          ref={fileUploadRef}
        />
      </div>
    </div>
  )
}

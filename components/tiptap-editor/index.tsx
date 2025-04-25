'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Direction from './extensions/extension-direction'
import TextAlign from '@tiptap/extension-text-align'
import FileUpload from '../form-fields/file-upload'
import { FileDetails } from '@/lib/entity/file/interface'
import ImageDeletePlugin from './plugins/image-delete'
import DeleteImageWithKey from './extensions/image-delete'

export default function TiptapEditor() {
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
        },
      }),
    ],
    content: '<p>سلام، این یک متن تست فارسی است!</p>',
    onCreate: ({ editor }) => {
      editor.registerPlugin(
        ImageDeletePlugin((src) => {
          console.log('##@209 this image delete:', src)
          // فراخوانی API برای حذف فایل
          // fetch('/api/delete-image', {
          //   method: 'POST',
          //   body: JSON.stringify({ src }),
          // })
        })
      )
    },
  })

  const responseFileUploadHandler = (fileDetails: FileDetails) => {
    // افزودن عکس به ادیتور
    editor
      ?.chain()
      .focus()
      .setImage({
        src: fileDetails.url,
        alt: fileDetails.alt,
        title: String(fileDetails.id),
      })
      .focus()
      .run()
  }

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-10">
        <button onClick={() => editor?.commands.setDirection('rtl')}>
          راست‌چین
        </button>
        <button onClick={() => editor?.commands.setDirection('ltr')}>
          چپ‌چین
        </button>

        <EditorContent
          editor={editor}
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
        />
      </div>
    </div>
  )
}

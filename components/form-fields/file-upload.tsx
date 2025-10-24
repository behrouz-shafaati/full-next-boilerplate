/* Create public/uploads/tmp directory. */

'use client'
import Image from 'next/image'
import {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  Ref,
} from 'react'
import { useDropzone } from 'react-dropzone'
import { X as XMarkIcon, CloudUpload as ArrowUpTrayIcon } from 'lucide-react'
import Modal from '../modal/modal'
import Text from './text'
import { Button } from '../ui/button'
import Checkbox from './checkbox'
import clsx from 'clsx'
import {
  deleteFile,
  updateFileDetails,
  uploadFile,
} from '@/lib/entity/file/actions'
import {
  File as BeFile,
  FileDetails,
  FileDetailsPayload,
  FileTranslationSchema,
} from '@/lib/entity/file/interface'
import { useToast } from '../../hooks/use-toast'
import { getTranslation } from '@/lib/utils'
import Select from './select'
const ObjectId = require('bson-objectid')

// Type تعریف برای رفرنس
export interface FileUploadRef {
  removeFileById: (index: string) => void
  removeFile: (index: number) => void
  removeAll: () => void
  getFiles: () => any[]
  clearFiles: () => void
}

// Type تعریف برای Props
interface FileUploadProps {
  className?: string
  title: string
  name: string
  defaultValues?: BeFile[]
  state?: any
  maxFiles?: number
  allowedFileTypes?: any
  showDeleteButton?: boolean
  responseHnadler?: (FileDetails: FileDetails) => void
  updateFileDetailsHnadler?: (FileDetails: FileDetails[]) => void
  deleteFileHnadler?: (fileId: string) => void
  onChange?: () => void
  attachedTo?: [{ feature: string; id: string }]
}

// Context from Function app/ui/components/dropzone.tsx:Dropzone
const FileUpload = forwardRef(function FileUpload(
  {
    className,
    title,
    name,
    defaultValues = [],
    state,
    maxFiles,
    allowedFileTypes,
    showDeleteButton = true,
    responseHnadler,
    updateFileDetailsHnadler,
    deleteFileHnadler,
    onChange,
    attachedTo,
  }: FileUploadProps,
  ref: Ref<FileUploadRef>
) {
  const locale = 'fa'
  defaultValues = defaultValues == null ? [] : defaultValues
  const { toast } = useToast()
  if (!Array.isArray(defaultValues)) {
    defaultValues = [defaultValues]
  }
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [files, setFiles] = useState<any[]>(defaultValues)
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0)

  const acceptedFiles = allowedFileTypes ? { accept: allowedFileTypes } : {}
  const onCloseModal = () => {
    setIsModalOpen(false)
  }

  const onDrop = (acceptedFiles: any[]) => {
    if (maxFiles) {
      if ((files?.length ?? 0) + (acceptedFiles?.length ?? 0) > maxFiles) {
        toast({
          variant: 'destructive',
          title: '',
          description: `حداکثر ${maxFiles} فایل قابل آپلود است.`,
        })
        return
      }
    }
    let firstImage = true
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          id: ObjectId().toString(),
          preview: URL.createObjectURL(file),
          main: (() => {
            if (files.length === 0 && firstImage) {
              firstImage = false
              return true
            }
            return false
          })(),
          lang: 'fa',
          title: file.name.split('.')[0],
          alt: '',
          href: '',
          description: '',
          attachedTo,
          locale,
        })
      )

      setFiles((previousFiles) => [...previousFiles, ...newFiles])
      console.log('#230 onDrop:', newFiles)
      for (const file of newFiles) {
        submitFile(file)
      }
    }
  }

  const submitFile = async (file: any) => {
    const formData = new FormData()

    formData.append('file', file)
    formData.append('id', file?.id)
    formData.append('title', file?.title)
    formData.append('alt', file?.alt)
    formData.append('href', file?.href)
    formData.append('target', file?.target)
    formData.append('description', file?.description)
    formData.append('main', file?.main)
    formData.append('lang', file?.lang)
    formData.append('attachedTo', file?.attachedTo)
    formData.append('locale', locale)

    const FileDetails: FileDetails = await uploadFile(formData)
    if (responseHnadler) responseHnadler(FileDetails)
    requestAnimationFrame(() => {
      onChange?.()
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    ...acceptedFiles,
    multiple: true,
    maxSize: 6 * 1024 * 1000, // 6 MB
    onDrop,
  })
  useEffect(() => {
    const handelUpdateFileDetails = async (filesDetails: any) => {
      const updatedFilesArray = await updateFileDetails(filesDetails)

      if (updateFileDetailsHnadler) updateFileDetailsHnadler(updatedFilesArray)
    }
    // Revoke the data uris to avoid memory leaks
    // return () => files.forEach((file) => URL.revokeObjectURL(file.preview));

    // Context from Function app/lib/entity/file/actions.ts:updateFileDetails
    // save file details
    const filesDetails: FileDetailsPayload[] = files
      .filter((file) => file?.id)
      .map((file) => {
        const translation = getTranslation({
          translations: file?.translations,
          locale,
        })
        const newFile = {
          id: file.id,
          title: translation.title,
          alt: translation.alt,
          href: file.href,
          target: file.target,
          description: translation.description,
          main: file.main,
          lang: locale,
          attachedTo,
          locale,
        }
        console.log('#3333333333333 newFile:', newFile)
        return newFile
      })
    handelUpdateFileDetails(filesDetails)
  }, [files, attachedTo])

  const removeFileById = (id: string) => {
    const items = [...files]
    for (let index = 0; index < items.length; index++) {
      if (String(items[index].id) === id) {
        removeFile(index)
        return
      }
    }
    return
  }

  const removeFile = (index: number) => {
    const items = [...files]
    const [deletedItem] = items.splice(index, 1)
    if (deletedItem.main && items.length) {
      items[0].main = true
    }
    setFiles(items)
    deleteFile(deletedItem.id)
    requestAnimationFrame(() => {
      onChange?.()
      deleteFileHnadler?.(deletedItem.id)
    })
  }

  const removeAll = () => {
    setFiles([])
    requestAnimationFrame(() => {
      onChange?.()
    })
  }

  const unCheckMainAllFiles = () => {
    setFiles((previousFiles) => {
      const newFiles = [...previousFiles]
      newFiles.forEach((file) => {
        file.main = false
      })
      return newFiles
    })
  }

  const handleCheckMainFile = (e: any, index: number) => {
    if (e.target.checked) {
      unCheckMainAllFiles()
      setFiles((previousFiles) => {
        const newFiles = [...previousFiles]
        newFiles[index].main = true
        return newFiles
      })
    }
  }
  const onSaveFileDetails = (newFile: any, index: number) => {
    setIsModalOpen(false)
    if (newFile.main) {
      unCheckMainAllFiles()
    } else {
      if (files.length === 1) {
        newFile.main = true
      }
    }

    setFiles((previousFiles) => {
      const newFiles = [...previousFiles]
      newFiles[index] = newFile
      return newFiles
    })
  }

  useImperativeHandle(ref, () => ({
    removeFileById,
    removeFile,
    removeAll,
    getFiles: () => files,
    clearFiles: () => setFiles([]),
  }))

  const makeIdsClean = () => {
    if (maxFiles == 1) return files.length == 1 ? files[0]?.id : ''
    return JSON.stringify(files.filter((file) => file).map((file) => file.id))
  }

  return (
    <>
      <div>
        {/* title */}
        <p className="mb-2 text-md">{title}</p>
        {/* {files.length > 0 && ( */}
        <textarea name={name} value={makeIdsClean()} readOnly hidden />
        {/* )} */}
        {/* Dropzone */}
        <div
          {...getRootProps({
            className: `${className} border-2 border-dashed border-secondary-400 p-4 text-center rounded-md text-gry-400`,
          })}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
            <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
            {isDragActive ? (
              <p>فایل ها را اینجا رها کنید...</p>
            ) : (
              <p>
                فایل‌ها را اینجا بکشید و رها کنید یا برای انتخاب فایل‌ها کلیک
                کنید. <br /> Max Size = 6 Mb
              </p>
            )}
          </div>
        </div>
        {/* Preview */}
        <section className="">
          {/* Accepted files */}
          <ul className="grid grid-cols-3 gap-2 mt-4 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => {
              return (
                <li
                  key={index}
                  className="relative rounded-md max-h-20 h-22 group min-h-12"
                >
                  {(file?.srcSmall || file?.preview) && (
                    <Image
                      src={file?.preview || file?.srcSmall}
                      alt={file?.title || file?.alt}
                      width={100}
                      height={100}
                      className={clsx(
                        'h-full w-full cursor-pointer rounded-md object-contain shadow-sm',
                        { 'border-2 border-blue-500': file?.main }
                      )}
                      onClick={() => {
                        setSelectedFileIndex(index)
                        setIsModalOpen(true)
                      }}
                    />
                  )}
                  {showDeleteButton && (
                    <button
                      type="button"
                      className="absolute flex items-center justify-center w-5 h-5 text-white transition-colors bg-gray-400 border rounded-full border-secondary-400 bg-secondary-400 -right-1 -top-1 hover:bg-red-500 hover:text-white"
                      onClick={() => removeFile(index)}
                    >
                      <XMarkIcon className="w-5 h-5 transition-colors hover:fill-secondary-400" />
                    </button>
                  )}
                  <label className="absolute bottom-0 hidden w-full p-1 text-xs bg-white cursor-pointer group-hover:block">
                    <input
                      name="main"
                      type="checkBox"
                      className="mr-1"
                      checked={file?.main}
                      onChange={(e) => handleCheckMainFile(e, index)}
                    />
                    <span className="mr-2">اصلی</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </section>
        {hasError && (
          <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
            {errorMessages.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            ))}
          </div>
        )}
      </div>
      <Modal
        isOpen={isModalOpen}
        content={
          <ModalContent
            file={files[selectedFileIndex]}
            index={selectedFileIndex}
            onCloseModal={onCloseModal}
            onSave={onSaveFileDetails}
          />
        }
        title="جزییات رسانه"
        onCloseModal={onCloseModal}
      />
    </>
  )
})

const ModalContent = ({
  file,
  index,
  onCloseModal,
  onSave,
}: {
  file: any
  index: number
  onCloseModal: any
  onSave: (newFile: any, index: number) => void
}) => {
  const locale = 'fa' //  from formData
  const translation = getTranslation({
    translations: file?.translations,
    locale,
  })
  const [newFile, setNewFile] = useState({
    ...file,
    lang: locale,
  })
  const handleUpdate = (key: string, value: any) => {
    setNewFile((s: any) => {
      return {
        ...s,
        //[{ lang: locale }] => تا یک بار حلقه اجرا بشه و اطلاعات ثبت بشن
        //[] => اطلاعات از دست میره اینجوری
        translations: (s.translations ?? [{ lang: locale }]).map((t: any) =>
          t.lang === locale ? { ...t, [key]: value } : t
        ),
      }
    })
  }
  return (
    <div className="mt-4">
      <div>
        <div className="relative h-24 ">
          <Image
            src={file?.preview || file?.srcSmall}
            alt={file?.name || 'uploaded image'}
            width={100}
            height={100}
            className="object-contain w-full h-full rounded-md"
          />
        </div>
      </div>
      <div className="mt-4">
        <input type="text" name="lang" className="hidden" value="fa" readOnly />
        <Text
          title="نام رسانه"
          name="title"
          defaultValue={translation?.title}
          onChange={(e) => handleUpdate('title', e.target.value)}
        />
        <Text
          title="متن جایگزین"
          name="alt"
          defaultValue={translation?.alt}
          onChange={(e) => handleUpdate('alt', e.target.value)}
        />
        <Text
          title="توضیحات رسانه"
          name="description"
          defaultValue={translation?.description}
          onChange={(e) => handleUpdate('description', e.target.value)}
        />

        <Text
          title="لینک"
          name="href"
          defaultValue={newFile.href}
          onChange={(e) =>
            setNewFile((s: any) => ({ ...s, href: e.target.value }))
          }
        />
        <Select
          title="باز شدن در"
          placeholder="انتخاب کنید..."
          name="target"
          options={[
            { value: '_self', label: 'پنجره فعلی' },
            { value: '_blank', label: 'پنجره جدید' },
          ]}
          defaultValue={newFile?.target}
          onChange={(value) =>
            setNewFile((s: any) => ({ ...s, target: value }))
          }
        />
        <Checkbox
          name="main"
          disabled={file.main}
          title="رسانه اصلی"
          checked={newFile.main}
          onChange={(e: any) =>
            setNewFile((s: any) => ({ ...s, main: e.target?.checked || false }))
          }
        />
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <Button
          onClick={onCloseModal}
          className="flex items-center h-10 px-4 text-sm font-medium text-gray-600 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          لفو
        </Button>
        <Button type="button" onClick={() => onSave(newFile, index)}>
          ذخیره
        </Button>
      </div>
    </div>
  )
}

export default FileUpload

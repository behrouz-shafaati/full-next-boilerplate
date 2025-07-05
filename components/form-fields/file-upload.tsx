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
} from '@/lib/entity/file/interface'
import { useToast } from '../ui/use-toast'
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
  onChange?: () => void
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
    onChange,
  }: FileUploadProps,
  ref: Ref<FileUploadRef>
) {
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
      if (files.length + acceptedFiles.length > maxFiles) {
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
          title: file.name.split('.')[0],
          alt: '',
          description: '',
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
    formData.append('description', file?.description)
    formData.append('main', file?.main)

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
    // Revoke the data uris to avoid memory leaks
    // return () => files.forEach((file) => URL.revokeObjectURL(file.preview));

    // Context from Function app/lib/entity/file/actions.ts:updateFileDetails
    // save file details
    const filesDetails: FileDetailsPayload[] = files
      .filter((file) => file?.id)
      .map((file) => {
        return {
          id: file.id,
          title: file.title,
          alt: file.alt,
          description: file.description,
          main: file.main,
        }
      })

    updateFileDetails(filesDetails)
  }, [files])

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
    return JSON.stringify(files.map((file) => file.id))
  }

  return (
    <>
      <div>
        {/* title */}
        <p className="text-md mb-2">{title}</p>
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
            <ArrowUpTrayIcon className="h-5 w-5 fill-current" />
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
          <ul className=" mt-4 grid grid-cols-3 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => (
              <li
                key={index}
                className="max-h-20 h-22 group relative rounded-md min-h-12"
              >
                {(file?.src || file?.preview) && (
                  <Image
                    src={file?.preview || file?.src}
                    alt={file?.name || file?.alt}
                    width={100}
                    height={100}
                    //   onLoad={() => {
                    //     URL.revokeObjectURL(file.preview);
                    //   }}
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
                    className="border-secondary-400 bg-secondary-400 absolute -right-1 -top-1  flex  h-5 w-5 items-center justify-center rounded-full border bg-gray-400 text-white transition-colors hover:bg-red-500 hover:text-white"
                    onClick={() => removeFile(index)}
                  >
                    <XMarkIcon className="hover:fill-secondary-400 h-5 w-5 transition-colors" />
                  </button>
                )}
                <label className="absolute bottom-0 hidden w-full cursor-pointer bg-white p-1 text-xs group-hover:block">
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
            ))}
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
  const [newFile, setNewFile] = useState({
    ...file,
  })
  console.log('#0092 file: ', file)
  return (
    <div className="mt-4">
      <div>
        <div className="relative h-24 ">
          <Image
            src={file?.preview || file?.src}
            alt={file.name}
            width={100}
            height={100}
            className="h-full w-full rounded-md object-contain "
          />
        </div>
      </div>
      <div className="mt-4">
        <Text
          title="نام رسانه"
          name="title"
          value={newFile.title}
          onChange={(e) =>
            setNewFile((s: any) => ({ ...s, title: e.target.value }))
          }
        />
        <Text
          title="متن جایگزین"
          name="alt"
          value={newFile.alt}
          onChange={(e) =>
            setNewFile((s: any) => ({ ...s, alt: e.target.value }))
          }
        />
        <Text
          title="توضیحات رسانه"
          name="description"
          value={newFile.description}
          onChange={(e) =>
            setNewFile((s: any) => ({ ...s, description: e.target.value }))
          }
        />
        <Checkbox
          name="main"
          disabled={file.main}
          title="رسانه اصلی"
          checked={newFile.main}
          onChange={(e: any) =>
            setNewFile((s: any) => ({ ...s, main: e.target.checked }))
          }
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button
          onClick={onCloseModal}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
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

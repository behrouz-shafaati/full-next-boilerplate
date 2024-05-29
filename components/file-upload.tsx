'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Icon } from '@iconify/react';
import Modal from './modal';
import Text from './text';
import { Button } from './button';
import Checkbox from './checkbox';
import clsx from 'clsx';
import {
  deleteFile,
  updateFileDetails,
  uploadFile,
} from '@/app/lib/entity/file/actions';
import {
  File as BeFile,
  FileDetailsPayload,
} from '@/app/lib/entity/file/interface';
import { Label } from './ui/label';
import { Input } from './ui/input';
const ObjectId = require('bson-objectid');

// Context from Function app/ui/components/dropzone.tsx:Dropzone
export default function Dropzone({
  className,
  title,
  name,
  defaultValues = [],
  state,
}: {
  className?: string;
  title: string;
  name: string;
  defaultValues?: BeFile[];
  state?: any;
}) {
  const errorMessages = state?.errors?.[name] ?? [];
  const hasError = state?.errors?.[name]?.length > 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState<File[]>(defaultValues);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  const onCloseModal = () => {
    setIsModalOpen(false);
  };

  const onDrop = (acceptedFiles: File[]) => {
    let firstImage = true;
    if (acceptedFiles?.length) {
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          id: ObjectId().toString(),
          preview: URL.createObjectURL(file),
          main: (() => {
            if (files.length === 0 && firstImage) {
              firstImage = false;
              return true;
            }
            return false;
          })(),
          title: file.name.split('.')[0],
          alt: '',
          description: '',
        }),
      );

      setFiles((previousFiles) => [...previousFiles, ...newFiles]);

      for (const file of newFiles) {
        submitFile(file);
      }
    }
  };

  const submitFile = async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('id', file.id);
    formData.append('title', file.title);
    formData.append('alt', file.alt);
    formData.append('description', file.description);
    formData.append('main', file.main);

    const data = await uploadFile(formData);

    console.log(data);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 6 * 1024 * 1000, // 6 MB
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    // return () => files.forEach((file) => URL.revokeObjectURL(file.preview));

    // Context from Function app/lib/entity/file/actions.ts:updateFileDetails
    // save file details
    const filesDetails: FileDetailsPayload[] = files.map((file) => {
      return {
        id: file.id,
        title: file.title,
        alt: file.alt,
        description: file.description,
        main: file.main,
      };
    });

    updateFileDetails(filesDetails);
  }, [files]);

  const removeFile = (index: number) => {
    const items = [...files];
    const [deletedItem] = items.splice(index, 1);
    if (deletedItem.main && items.length) {
      items[0].main = true;
    }
    setFiles(items);
    deleteFile(deletedItem.id);
  };

  const removeAll = () => {
    setFiles([]);
  };

  const unCheckMainAllFiles = () => {
    setFiles((previousFiles) => {
      const newFiles = [...previousFiles];
      newFiles.forEach((file) => {
        file.main = false;
      });
      return newFiles;
    });
  };

  const handleCheckMainFile = (e: any, index: number) => {
    if (e.target.checked) {
      unCheckMainAllFiles();
      setFiles((previousFiles) => {
        const newFiles = [...previousFiles];
        newFiles[index].main = true;
        return newFiles;
      });
    }
  };
  const onSaveFileDetails = (newFile: File, index: number) => {
    setIsModalOpen(false);
    if (newFile.main) {
      unCheckMainAllFiles();
    } else {
      if (files.length === 1) {
        newFile.main = true;
      }
    }

    setFiles((previousFiles) => {
      const newFiles = [...previousFiles];
      newFiles[index] = newFile;
      return newFiles;
    });
  };

  return (
    <>
      <div>
        {/* title */}
        <p className="text-md mb-2">{title}</p>
        <textarea
          name={name}
          className="hidden"
          value={JSON.stringify(files.map((file) => file.id))}
          readOnly
        />
        {/* Dropzone */}
        <div
          {...getRootProps({
            className: `${className} border-2 border-dashed border-secondary-400 p-4 text-center rounded-md text-gry-400`,
          })}
        >
          <div className="flex flex-col items-center justify-center gap-2 text-xs text-gray-400">
            <Icon icon="line-md:cloud-up-twotone" className="h-5 w-5 fill-current" />
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
          <ul className="mt-0 mt-4 grid grid-cols-3 gap-2 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {files.map((file, index) => (
              <li key={index} className="h-22 group relative rounded-md">
                <Image
                  src={file?.preview || file?.url}
                  alt={file?.name || file?.alt}
                  width={100}
                  height={100}
                  //   onLoad={() => {
                  //     URL.revokeObjectURL(file.preview);
                  //   }}
                  className={clsx(
                    'h-full w-full cursor-pointer rounded-md object-contain shadow-sm',
                    { 'border border-2 border-blue-500': file.main },
                  )}
                  onClick={() => {
                    setSelectedFileIndex(index);
                    setIsModalOpen(true);
                  }}
                />
                <button
                  type="button"
                  className="border-secondary-400 bg-secondary-400 absolute -right-1 -top-1  flex  h-5 w-5 items-center justify-center rounded-full border bg-gray-400 text-white transition-colors hover:bg-red-500 hover:text-white"
                  onClick={() => removeFile(index)}
                >
                  <Icon icon="clarity:remove-solid" className="hover:fill-secondary-400 h-5 w-5 transition-colors" />
                </button>
                <label className="absolute bottom-0 hidden w-full cursor-pointer bg-white p-1 text-xs group-hover:block">
                  <input
                    name="main"
                    type="checkBox"
                    className="mr-1"
                    checked={file.main}
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
  );
}

const ModalContent = ({
  file,
  index,
  onCloseModal,
  onSave,
}: {
  file: any;
  index: number;
  onCloseModal: any;
  onSave: (newFile: any, index: number) => void;
}) => {
  const [newFile, setNewFile] = useState({
    ...file,
  });
  console.log('#0092 file: ', file);
  return (
    <div className="mt-4">
      <div>
        <div className="relative h-24 ">
          <Image
            src={file?.preview || file?.url}
            alt={file.name}
            width={100}
            height={100}
            className="h-full w-full rounded-md object-contain "
          />
        </div>
      </div>
      <div className="mt-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">نام رسانه</Label>
      <Input type="text" id="title" placeholder="نام رسانه" />
    </div>
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
        <button
          onClick={onCloseModal}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          لفو
        </button>
        <Button type="button" onClick={() => onSave(newFile, index)}>
          ذخیره
        </Button>
      </div>
    </div>
  );
};

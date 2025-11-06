import c_controller from '@/lib/entity/core/controller'
// import { File } from './interface';

import fileSchema from './schema'
import fileService from './service'
import {
  FileDetails,
  FileDetailsPayload,
  FileTranslationSchema,
} from './interface'
import { getSession } from '@/lib/auth'
import { Session } from '@/types'
import postCtrl from '@/features/post/controller'
// import imgurClient from "./imgur";
// const multer = require('multer');
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// const extractFrames = require('ffmpeg-extract-frames');

class controller extends c_controller {
  /**
   * constructor function for controller.
   *
   * @remarks
   * This method is part of the fileController class extended of the main parent class baseController.
   *
   * @param service - fileService
   *
   * @beta
   */
  constructor(service: any) {
    super(service)
  }

  async generateDirectory(
    fileType: string
  ): Promise<{ src: string; patch: string }> {
    const yearNumber = new Date().getFullYear()
    const monthNumber = new Date().getMonth()
    const dayNumber = new Date().getDate()
    const src = `/${fileType}/${yearNumber}/${monthNumber}/${dayNumber}`
    const patch = `./uploads/${fileType}/${yearNumber}/${monthNumber}/${dayNumber}`
    await createDir(patch)
    return { src, patch }
  }

  async saveFileInDirectory(buffer: Uint8Array, patch: string) {
    return new Promise<void>((resolve) => {
      // Write the Uint8Array data to the file
      fs.writeFile(patch, buffer, (err: any) => {
        if (err) {
          console.error('#87655 Error writing file:', err)
          return
        }
        resolve()
      })

      // fs.createWriteStream(patch)
      //   .write(buffer)
      //   .on('finish', () => {
      //     resolve();
      //   });
      // result.on('finish', () => {
      //   resolve();
      // });
    })
  }

  async saveFile(formData: FormData): Promise<FileDetails> {
    const file = formData.get('file') as File

    const _id: string = formData.get('id') as string
    let title: string = formData.get('title') as string
    let alt: string = formData.get('alt') as string
    let description: string = formData.get('description') as string
    let href: string = formData.get('href') as string
    let target: string = formData.get('target') as string
    let main: string = formData.get('main') as string
    let targetFormat: string = formData.get('targetFormat') as string
    let lang: string | null = (formData.get('lang') as string) || 'fa'

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    let previewPath: string = ''
    let src: string = ''
    let fullSrc: string = ''
    let patch: string = ''
    let tmpPath: string = `./uploads/tmp`
    let width, height

    const { name: defualtFileName, type: mimeType, size: fileSize } = file
    const fileName = createFileName(
      title,
      defualtFileName.split('.').pop() as string
    )
    // for images
    if (mimeType.startsWith('image/')) {
      const directory = await this.generateDirectory('images')
      patch = directory.patch
      src = directory.src
    }
    // for svg
    else if (mimeType == 'image/svg+xml') {
      const { src: src, patch: patch } = await this.generateDirectory('images')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)
    }

    // for movies
    else if (mimeType == 'video/mp4') {
      const { src: src, patch: patch } = await this.generateDirectory('movies')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)
    }

    // for audios
    else if (
      mimeType == 'audio/mpeg' ||
      mimeType == 'audio/mp4' ||
      mimeType == 'audio/webm'
    ) {
      const { src: src, patch: patch } = await this.generateDirectory('audios')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)
    }

    await this.saveFileInDirectory(buffer, `${tmpPath}/${fileName}`)

    const urls: Record<string, string> = {}
    const patches: Record<string, string> = {}
    const extension =
      targetFormat == '' || targetFormat == null ? 'webp' : targetFormat
    try {
      if (mimeType.startsWith('image/')) {
        const tmpFilePath = path.resolve(tmpPath, fileName)
        // گرفتن ابعاد
        const image = await sharp(tmpFilePath).metadata()
        width = image.width
        height = image.height

        // اسم فایل پایه (بدون پسوند)
        const baseName = fileName.substring(0, fileName.lastIndexOf('.'))

        // مسیر و نام فایل بهینه‌شده (small)
        // تغییر نام به webp
        const webpFileName = `${baseName}.${extension}`
        title = webpFileName
        const sizes = [
          { name: 'Small', width: 640, quality: 70 },
          { name: 'Medium', width: 768, quality: 80 },
          { name: 'Large', width: 1280, quality: 90 },
        ]
        if (mimeType == 'image/gif') {
          const destinationFilePath = path.join(patch, `${baseName}.gif`)

          // فقط فایل را کپی کن (بدون پردازش توسط sharp)
          await fs.promises.copyFile(tmpFilePath, destinationFilePath)

          for (const size of sizes) {
            urls[`src${size.name}`] = `/api/file${src}/${baseName}.gif`
            patches[`patch${size.name}`] = `${patch}/${baseName}.gif`
          }

          // حالا فایل موقت رو پاک کن
          safeUnlink(tmpFilePath)
        } else {
          for (const size of sizes) {
            const destinationFilePath = path.join(
              patch,
              `${baseName}-${size.name}.${extension}`
            )
            await sharp(buffer)
              .resize({ width: size.width, withoutEnlargement: true })
              .webp({ quality: size.quality })
              .toFile(destinationFilePath)
            urls[
              `src${size.name}`
            ] = `/api/file${src}/${baseName}-${size.name}.${extension}`
            patches[
              `patch${size.name}`
            ] = `${patch}/${baseName}-${size.name}.${extension}`
          }

          // پاک کردن فایل موقت بعد از اتمام پردازش
          safeUnlink(tmpFilePath)
        }
      }
    } catch (e: any) {
      console.log('#903 Error in upload file:', e)
    }

    const params = {
      _id,
      title,
      ...urls,
      ...patches,
      patch,
      mimeType: `{image/${extension}}`,
      fileSize,
      alt,
      description,
      href,
      target,
      previewPath,
      main,
      lang,
      width,
      height,
    }

    const cleanParams = await this.sanitizePostData(params, _id)
    let fileInfo: FileDetails = await this.create({
      params: cleanParams,
    })
    this.handleAfterUpdateFile({ file: { ...fileInfo, locale: lang } })
    return fileInfo
  }

  /**
   * Updates the details of files based on the provided FileDetailsPayload array.
   *
   * @param filesDetails Array of FileDetailsPayload objects containing the new details for each file.
   */
  async updateFileDetails(filesDetails: FileDetailsPayload[]) {
    const newFiles = []
    for (const fileDetails of filesDetails) {
      // Find the file by id
      const file = await this.findById({ id: fileDetails.id })
      // Check if the file is not found, null, or already deleted
      if (!file || file == null || file?.deleted) return
      // Update the file details in the database
      const params = {
        title: fileDetails.title,
        alt: fileDetails.alt,
        description: fileDetails.description,
        href: fileDetails.href,
        target: fileDetails.target,
        main: fileDetails.main,
        lang: fileDetails.lang,
        attachedTo: fileDetails.attachedTo,
        locale: fileDetails.locale,
      }

      const cleanParams = await this.sanitizePostData(
        params,
        String(fileDetails.id)
      )

      const newFile = await this.findOneAndUpdate({
        filters: fileDetails.id,
        params: cleanParams,
      })
      this.handleAfterUpdateFile({
        file: { ...newFile, locale: fileDetails.locale },
      })
      newFiles.push(newFile)
    }
    return newFiles
  }

  async handleAfterUpdateFile({ file }: { file: FileDetails }) {
    if (!!file || file === undefined || file == null) return
    if (file?.attachedTo.length == 0) return
    switch (file.attachedTo[0].feature) {
      case 'post':
        postCtrl.updateContentJsonFileDetails({ fileDetails: file })
        break
    }
  }

  async deleteFile(id: string) {
    const file = await this.findById({ id })
    fs.unlinkSync(file.patchSmall)
    fs.unlinkSync(file.patchLarge)
    fs.unlinkSync(file.patchMedium)
    return this.delete({ filters: [id] })
  }

  async sanitizePostData(params: any, id?: string | undefined) {
    let prevState = { translations: [] }
    if (id) {
      const prevFile = await this.findById({ id })
      if (prevFile) prevState = prevFile
    }
    const session = (await getSession()) as Session
    const user = session.user.id
    const translations =
      params.lang != null
        ? [
            {
              lang: params.lang,
              title: params.title,
              alt: params.alt,
              description: params.description,
            },
            ...prevState?.translations.filter(
              (t: FileTranslationSchema) => t.lang != params.lang
            ),
          ]
        : [
            ...prevState?.translations.filter(
              (t: FileTranslationSchema) => t.lang != params.lang
            ),
          ]
    const cleanParams = {
      ...params,
      translations,
      user,
    }

    return cleanParams
  }
}
const fileCtrl = new controller(new fileService(fileSchema))
export default fileCtrl

export async function createDir(pathname: string) {
  const __dirname = path.resolve()
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, '') // Remove leading directory markers, and remove ending /file-name.extension
  await fs.mkdirSync(path.resolve(__dirname, pathname), { recursive: true })
}

function createFileName(title: string, fileExtension: string) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
  // const fileExtension = mimeType.split('/')[1];
  // if (title && title !== '') {
  //   // const fileExtension = title.split('.').pop();
  //   title = title.replace(/\s+/g, '-').toLowerCase();
  //   return `${uniqueSuffix}-${title}.${fileExtension}`;
  // }
  // generate random file name if title is empty
  return `${uniqueSuffix}.${fileExtension}`
}

function safeUnlink(filePath: string, retries = 10, delay = 500) {
  let attempt = 0

  function tryUnlink() {
    try {
      fs.unlinkSync(filePath)
      // موفق شد
      // console.log("tmp file deleted:", filePath);
    } catch (err: any) {
      if (err.code === 'EBUSY' && attempt < retries) {
        attempt++
        setTimeout(tryUnlink, delay)
      } else if (err.code !== 'ENOENT') {
        console.warn('cannot delete tmp file:', err)
      }
    }
  }

  tryUnlink()
}

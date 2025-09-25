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
    let main: string = formData.get('main') as string
    let lang: string | null = (formData.get('lang') as string) || 'fa'

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    let previewPath: string = ''
    let src: string = ''
    let patch: string = ''
    let tmpPath: string = `./uploads/tmp`

    const { name: defualtFileName, type: mimeType, size: fileSize } = file
    const fileName = createFileName(
      title,
      defualtFileName.split('.').pop() as string
    )

    // for images
    if (
      mimeType == 'image/jpeg' ||
      mimeType == 'image/png' ||
      mimeType == 'image/webp'
    ) {
      const directory = await this.generateDirectory('images')
      patch = directory.patch
      src = directory.src

      // await sharp(req.files["file"][0].path)
      //   .resize(750, 750, {
      //     fit: sharp.fit.inside,
      //     withoutEnlargement: true,
      //   })
      //   .jpeg({ quality: 90 })
      //   .toFile(filePath);

      // if (process.env.ACTIVE_IMGUR) {
      //   const response = await imgurClient.upload({
      //     image: createReadStream(filePath),
      //     type: "stream",
      //   });
      //   // console.log(response.data);
      //   src = response.data.link;
      //   fs.unlinkSync(filePath);
      // }
      // fs.unlinkSync(req.files["file"][0].path);
    }
    // for svg
    else if (mimeType == 'image/svg+xml') {
      const { src: src, patch: patch } = await this.generateDirectory('images')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)
      //     filePath = path.resolve(directory, file);
      //   let oldPath = req.files['file'][0].path;
      //   fs.rename(oldPath, filePath, function (err: any) {
      //     if (err) throw err;
      //   });
    }

    // for movies
    else if (mimeType == 'video/mp4') {
      const { src: src, patch: patch } = await this.generateDirectory('movies')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)

      //   filePath = path.resolve(directory, file);
      //   let oldPath = req.files['file'][0].path;
      //   await fs.rename(oldPath, filePath, function (err: any) {
      //     if (err) throw err;
      //   });

      //   // to snap shot from frame 1

      //   const preview = 'pre_' + req.files['file'][0].filename + '.jpg';
      //   previewPath = `${directory}/${preview}`;
      //   await extractFrames({
      //     input: filePath,
      //     output: previewPath,
      //     offsets: [0],
      //   });
    }

    // for audios
    else if (
      mimeType == 'audio/mpeg' ||
      mimeType == 'audio/mp4' ||
      mimeType == 'audio/webm'
    ) {
      const { src: src, patch: patch } = await this.generateDirectory('audios')
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer)

      //   filePath = path.resolve(directory, file);
      //   let oldPath = req.files['file'][0].path;
      //   fs.rename(oldPath, filePath, function (err: any) {
      //     if (err) throw err;
      //   });
    }

    await this.saveFileInDirectory(buffer, `${tmpPath}/${fileName}`)
    // await fs.writeFile(`${tmpPath}/${fileName}`, buffer);
    const extension = mimeType == 'image/webp' ? 'webp' : 'png'
    try {
      if (
        mimeType == 'image/jpeg' ||
        mimeType == 'image/png' ||
        mimeType == 'image/webp'
      ) {
        const tmpFilePath = path.resolve(tmpPath, fileName)
        // change extension to .jpeg
        const jpegFileName =
          fileName.substr(0, fileName.lastIndexOf('.')) + '.' + extension
        title = jpegFileName
        const goalFilePath = path.resolve(patch, jpegFileName)
        src = `/api/file${src}/${jpegFileName}`
        patch = `${patch}/${jpegFileName}`
        // reduce size
        if (extension == 'webp') {
          //تبدیل به فرمت webp
          await sharp(tmpFilePath).toFormat('webp').toFile(goalFilePath)
          fs.unlinkSync(tmpFilePath)
        } else
          await sharp(tmpFilePath)
            .flatten({ background: { r: 255, g: 255, b: 255 } })
            .resize(850, 850, {
              fit: sharp.fit.inside,
              withoutEnlargement: true,
            })
            // .jpeg({ quality: 90 })
            .png({ quality: 90 })
            .toFile(goalFilePath)
        fs.unlinkSync(tmpFilePath)
      }
    } catch (e: any) {
      console.log('#903 Error in upload file:', e)
    }

    const params = {
      _id,
      title,
      src,
      patch,
      mimeType: `{image/${extension}}`,
      fileSize,
      alt,
      description,
      href,
      previewPath,
      main,
      lang,
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
    if (file?.attachedTo.length == 0) return
    switch (file.attachedTo[0].feature) {
      case 'post':
        postCtrl.updateContentJsonFileDetails({ fileDetails: file })
        break
    }
  }

  async deleteFile(id: string) {
    const file = await this.findById({ id })
    fs.unlinkSync(file.patch)
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

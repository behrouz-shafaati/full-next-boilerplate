import c_controller from '@/lib/entity/core/controller';
// import { File } from './interface';

import fileSchema from './schema';
import fileService from './service';
import { createReadStream } from 'fs';
import { FileDetailsPayload } from './interface';
// import imgurClient from "./imgur";
// const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

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
    super(service);
  }
  //   async handleUpload() {
  //     const maxSize = 25 * 1024 * 1024; // max size = 25 mg
  //     const storage = multer.diskStorage({
  //       destination: (req: any, file: any, cb: any) => {
  //         cb(null, './src/uploads/temp');
  //       },
  //       filename: (req: any, file: any, cb: any) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueSuffix + '.' + file.originalname.split('.').pop());
  //       },
  //     });
  //     const upload = multer({ storage: storage, limits: { fileSize: maxSize } });

  //     const uploadFile = upload.fields([{ name: 'file', maxCount: 1 }]);
  //     return uploadFile;
  //   }

  async generateDirectory(
    fileType: string
  ): Promise<{ url: string; patch: string }> {
    const yearNumber = new Date().getFullYear();
    const monthNumber = new Date().getMonth();
    const dayNumber = new Date().getDate();
    const url = `/uploads/${fileType}/${yearNumber}/${monthNumber}/${dayNumber}`;
    const patch = `./public/uploads/${fileType}/${yearNumber}/${monthNumber}/${dayNumber}`;
    await createDir(patch);
    return { url, patch };
  }

  async saveFileInDirectory(buffer: Uint8Array, patch: string) {
    return new Promise<void>((resolve) => {
      // Write the Uint8Array data to the file
      fs.writeFile(patch, buffer, (err: any) => {
        if (err) {
          console.error('#87655 Error writing file:', err);
          return;
        }
        resolve();
      });

      // fs.createWriteStream(patch)
      //   .write(buffer)
      //   .on('finish', () => {
      //     resolve();
      //   });
      // result.on('finish', () => {
      //   resolve();
      // });
    });
  }

  async saveFile(formData: FormData) {
    const file = formData.get('file') as File;

    const _id: string = formData.get('id') as string;
    let title: string = formData.get('title') as string;
    let alt: string = formData.get('alt') as string;
    let description: string = formData.get('description') as string;
    let main: string = formData.get('main') as string;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    let previewPath: string = '';
    let url: string = '';
    let patch: string = '';
    let tmpPath: string = `./public/uploads/tmp`;

    const { name: defualtFileName, type: mimeType, size: fileSize } = file;

    const fileName = createFileName(
      title,
      defualtFileName.split('.').pop() as string
    );

    // for images
    if (mimeType == 'image/jpeg' || mimeType == 'image/png') {
      const directory = await this.generateDirectory('images');
      patch = directory.patch;
      url = directory.url;

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
      //   url = response.data.link;
      //   fs.unlinkSync(filePath);
      // }
      // fs.unlinkSync(req.files["file"][0].path);
    }
    // for svg
    else if (mimeType == 'image/svg+xml') {
      const { url: url, patch: patch } = await this.generateDirectory('images');
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer);
      //     filePath = path.resolve(directory, file);
      //   let oldPath = req.files['file'][0].path;
      //   fs.rename(oldPath, filePath, function (err: any) {
      //     if (err) throw err;
      //   });
    }

    // for movies
    else if (mimeType == 'video/mp4') {
      const { url: url, patch: patch } = await this.generateDirectory('movies');
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer);

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
      const { url: url, patch: patch } = await this.generateDirectory('audios');
      fs.createWriteStream(`${patch}/${fileName}`).write(buffer);

      //   filePath = path.resolve(directory, file);
      //   let oldPath = req.files['file'][0].path;
      //   fs.rename(oldPath, filePath, function (err: any) {
      //     if (err) throw err;
      //   });
    }

    await this.saveFileInDirectory(buffer, `${tmpPath}/${fileName}`);
    // await fs.writeFile(`${tmpPath}/${fileName}`, buffer);

    if (mimeType == 'image/jpeg' || mimeType == 'image/png') {
      const tmpFilePath = path.resolve(tmpPath, fileName);

      // change extension to .jpeg
      const jpegFileName =
        fileName.substr(0, fileName.lastIndexOf('.')) + '.png';
      const goalFilePath = path.resolve(patch, jpegFileName);
      (url = `${url}/${jpegFileName}`),
        // reduce size
        await sharp(tmpFilePath)
          .flatten({ background: { r: 255, g: 255, b: 255 } })
          .resize(850, 850, {
            fit: sharp.fit.inside,
            withoutEnlargement: true,
          })
          // .jpeg({ quality: 90 })
          .png({ quality: 90 })
          .toFile(goalFilePath);
      fs.unlinkSync(tmpFilePath);
    }

    let fileInfo: File = await this.create({
      params: {
        _id,
        title,
        url,
        patch,
        mimeType: 'image/png',
        fileSize,
        alt,
        description,
        previewPath,
        main,
      },
    });
    return fileInfo;
  }

  /**
   * Updates the details of files based on the provided FileDetailsPayload array.
   *
   * @param filesDetails Array of FileDetailsPayload objects containing the new details for each file.
   */
  async updateFileDetails(filesDetails: FileDetailsPayload[]) {
    for (const fileDetails of filesDetails) {
      // Find the file by id
      const file = await this.findById({ id: fileDetails.id });
      // Check if the file is not found, null, or already deleted
      if (!file || file == null || file?.deleted) return;
      // Generate the current and new file names
      const currentFileName = `${file.title}.${file.extension}`;
      const newFileName = createFileName(fileDetails.title, file.extension);
      // Get the file's patch and URL
      const patch = file.patch;
      const url = file.url.substr(0, file.url.lastIndexOf('/'));
      const newUrl = `${url}/${newFileName}`;
      // Rename the file
      fs.rename(
        `${patch}/${currentFileName}`,
        `${patch}/${newFileName}`,
        function (err: any) {
          if (err) console.log('#9536 ERROR: ' + err);
        }
      );
      // Update the file details in the database
      await this.findOneAndUpdate({
        filters: fileDetails.id,
        params: {
          patch: patch,
          url: newUrl,
          title: fileDetails.title,
          alt: fileDetails.alt,
          description: fileDetails.description,
          main: fileDetails.main,
        },
      });
    }
  }

  async deleteFile(id: string) {
    const file = await this.findById({ id });
    fs.unlinkSync(file.patch);
    return this.delete({ filters: [id] });
  }
}

export default new controller(new fileService(fileSchema));

export async function createDir(pathname: string) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ''); // Remove leading directory markers, and remove ending /file-name.extension
  await fs.mkdirSync(path.resolve(__dirname, pathname), { recursive: true });
}

function createFileName(title: string, fileExtension: string) {
  // const fileExtension = mimeType.split('/')[1];
  if (title && title !== '') {
    // const fileExtension = title.split('.').pop();
    title = title.replace(/\s+/g, '-').toLowerCase();
    return `${title}.${fileExtension}`;
  }
  // generate random file name if title is empty
  return `${
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  }.${fileExtension}`;
}

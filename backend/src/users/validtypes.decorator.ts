import { fileTypeFromFile } from "file-type";
import { diskStorage } from "multer";
import { from, Observable, of, switchMap } from "rxjs";
import { v4 as uuidv4 } from 'uuid';
// const fileTypeFromFile = require('file-type');

type validFileExtension = 'png' | 'jpg' | 'gif';
type validMimeType = 'image/png' | 'image/jpeg' | 'image/gif';

const validFileExtensions: validFileExtension[] = ['png', 'jpg', 'gif'];
const validMimeTypes: validMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/gif'
];

export const saveImageStore = {
    limits: {
      fileSize: 240000,
  },
  fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
      } else {
          cb(null, false);
      }
  },
  storage: diskStorage({
    destination: './file/image',
      filename: (req: any, file: any, cb: any) => {
          cb(null, `${uuidv4()}_${file.originalname}`);
      },
  })
}

export const isFileExtensionSafe = (fullFilePath: string): Observable<boolean> => {
  return from(fileTypeFromFile(fullFilePath)).pipe(
    switchMap((fileExtensionAndMimeType: { ext: validFileExtension, mime: validMimeType }) => {
      // if (!fileExtensionAndMimeType) return of(false);
      return of(false)
    })
  )
}
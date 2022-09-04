import { diskStorage } from "multer";
import { v4 as uuidv4 } from 'uuid';

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

// export const isFileExtensionSafe = (
//   fullFilePath: string,
// ): Observable<boolean> => {
//   return from(fileTypeFromFile(fullFilePath)).pipe(
//     switchMap(
//       (fileExtensionAndMimeType: {
//         ext: validFileExtension;
//         mime: validMimeType;
//       }) => {
//         if (!fileExtensionAndMimeType) return of(false);

//         const isFileTypeLegit = validFileExtensions.includes(
//           fileExtensionAndMimeType.ext,
//         );
//         const isMimeTypeLegit = validMimeTypes.includes(
//           fileExtensionAndMimeType.mime,
//         );
//         const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
//         return of(isFileLegit);
//       },
//     ),
//   );
// };

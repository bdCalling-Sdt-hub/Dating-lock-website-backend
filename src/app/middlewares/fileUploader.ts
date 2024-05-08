/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import path from 'path';

export const uploadFile = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, path.join('uploads'));
      } else {
        //@ts-ignore
        cb(new Error('Invalid file type'));
      }
    },
    filename: function (req, file, cb) {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
    },
  });

  const fileFilter = (req: Request, file: any, cb: any) => {
    const allowedFieldnames = ['image', 'profile_image', 'cover_image'];

    if (file.fieldname === undefined) {
      // Allow requests without any files
      cb(null, true);
    } else if (allowedFieldnames.includes(file.fieldname)) {
      if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'video/mp4'
      ) {
        cb(null, true);
      } else {
        cb(new Error('Invalid file type'));
      }
    } else {
      cb(new Error('Invalid fieldname'));
    }
  };

  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
    { name: 'profile_image', maxCount: 1 },
  ]);

  return upload;
};

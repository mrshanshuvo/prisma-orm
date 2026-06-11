import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BadRequestError } from "../../utils/errors";
import { uploadToCloudinary } from "../../config/cloudinary";
import fs from "fs";

const uploadSingle = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new BadRequestError("No file uploaded");
  }
  try {
    const cloudinaryUrl = await uploadToCloudinary(req.file.path);
    // Remove local file after successful upload
    fs.unlinkSync(req.file.path);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "File uploaded successfully to Cloudinary",
      data: {
        url: cloudinaryUrl,
      },
    });
  } catch (error: any) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
});

const uploadMultiple = catchAsync(async (req: Request, res: Response) => {
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
    throw new BadRequestError("No files uploaded");
  }
  const files = req.files as Express.Multer.File[];
  const urls: string[] = [];
  try {
    for (const file of files) {
      const cloudinaryUrl = await uploadToCloudinary(file.path);
      urls.push(cloudinaryUrl);
      fs.unlinkSync(file.path);
    }
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Files uploaded successfully to Cloudinary",
      data: {
        urls,
      },
    });
  } catch (error: any) {
    for (const file of files) {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
    throw error;
  }
});

export const uploadController = {
  uploadSingle,
  uploadMultiple,
};

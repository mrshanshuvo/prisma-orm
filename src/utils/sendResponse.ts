import { Response } from "express";

type ApiResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
};

export const sendResponse = <T>(res: Response, data: ApiResponse<T>) => {
  const responsePayload: any = {
    success: data.success,
    message: data.message,
  };

  if (data.data !== undefined) {
    responsePayload.data = data.data;
  }

  if (data.error !== undefined) {
    responsePayload.error = data.error;
  }

  res.status(data.statusCode).json(responsePayload);
};

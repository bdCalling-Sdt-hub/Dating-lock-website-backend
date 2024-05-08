import { Request, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import { AuthService } from './auth.service';
import config from '../../../config';
import { ILoginUserResponse } from './auth.interface';
import catchAsync from '../../../shared/catchasync';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthService.loginUser(loginData);
  const { refreshToken, ...others } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);
  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User loggedin successfully !',
    data: others,
  });
});

const forgotPass = catchAsync(async (req: Request, res: Response) => {
  await AuthService.forgotPass(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Check your email!',
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization || '';
  await AuthService.resetPassword(req.body, token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Account recovered!',
  });
});

export const AuthController = {
  loginUser,
  forgotPass,
  resetPassword,
};

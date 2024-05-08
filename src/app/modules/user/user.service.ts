/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiError from '../../../errors/ApiError';
import { IRegistration, IUser } from './user.interface';
import User from './user.model';
import { JwtPayload, Secret } from 'jsonwebtoken';
import config from '../../../config';
import { Request } from 'express';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { updateImageUrl } from '../../../utils/url-modifier';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IGenericResponse } from '../../../interfaces/paginations';
import httpStatus from 'http-status';
import sendEmail from '../../../utils/sendEmail';
import { registrationSuccessEmailBody } from '../../../mails/user.register';

const registrationUser = async (payload: IRegistration) => {
  const { name, email, password } = payload;

  const user = {
    name,
    email,
    password,
  };
  const isEmailExist = await User.findOne({ email }).lean();
  if (isEmailExist) {
    throw new ApiError(400, 'Email already exist');
  }
  const newUser = await User.create(user);
  const data = { user: { name: user.name } };
  try {
    await sendEmail({
      email: user.email,
      subject: 'Congratulations to register successfully',
      html: registrationSuccessEmailBody(data),
    });
  } catch (error: any) {
    throw new ApiError(500, `${error.message}`);
  }
  const { password: omit, ...userWithoutPassword } = newUser.toObject();

  return userWithoutPassword;
};
const createUser = async (userData: IUser): Promise<IUser | null> => {
  const newUser = await User.create(userData);

  return newUser;
};
//!
const getAllUsers = async (
  query: Record<string, unknown>,
): Promise<IGenericResponse<IUser[]>> => {
  const userQuery = new QueryBuilder(User.find(), query)
    .search(['name', 'email'])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await userQuery.modelQuery;
  const meta = await userQuery.countTotal();

  return {
    meta,
    data: result,
  };
};
//!
const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const updatedResult = {
    ...result.toObject(),
    profile_image: updateImageUrl(result.profile_image).replace(/\\/g, '/'),
  };
  return updatedResult;
};

//!
const updateProfile = async (
  id: string,
  req: Request,
): Promise<IUser | null> => {
  //@ts-ignore
  const { files } = req;

  //@ts-ignore
  if (files?.profile_image?.length) {
    const result = await User.findOneAndUpdate(
      { _id: id },
      //@ts-ignore
      { profile_image: files.profile_image[0].path },
      {
        new: true,
        runValidators: true,
      },
    );

    return result;
  }
  //@ts-ignore
  else if (files?.cover_image?.length) {
    const result = await User.findOneAndUpdate(
      { _id: id },
      //@ts-ignore
      { cover_image: files.cover_image[0].path },
      {
        new: true,
        runValidators: true,
      },
    );

    return result;
  } else {
    //@ts-ignore
    const data = req.body.data;
    if (!data) {
      throw new Error('Data is missing in the request body!');
    }

    const parsedData = JSON.parse(data);

    const isExist = await User.findOne({ _id: id });

    if (!isExist) {
      throw new ApiError(404, 'User not found !');
    }

    const { ...UserData } = parsedData;

    const updatedUserData: Partial<IUser> = { ...UserData };

    const result = await User.findOneAndUpdate({ _id: id }, updatedUserData, {
      new: true,
    });
    return result;
  }
};
//!
const deleteUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findByIdAndDelete(id);

  return result;
};
//!
const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await User.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }

  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(402, 'Password is incorrect');
  }

  //create access token & refresh token

  const { _id: userId, role } = isUserExist;
  const accessToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );
  //Create refresh token
  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (err) {
    throw new ApiError(402, 'Invalid Refresh Token');
  }

  const { userId } = verifiedToken;

  // checking deleted user's refresh token
  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new ApiError(403, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist._id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const changePassword = async (
  user: JwtPayload | null,
  payload: IChangePassword,
): Promise<void> => {
  const { userId } = user as any;
  //@ts-ignore
  const { oldPassword, newPassword } = payload;
  const isUserExist = await User.findOne({ _id: userId }).select('+password');
  if (!isUserExist) {
    throw new ApiError(404, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await User.isPasswordMatched(oldPassword, isUserExist.password))
  ) {
    throw new ApiError(402, 'Old password is incorrect');
  }
  isUserExist.password = newPassword;
  isUserExist.save();
};

export const UserService = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  registrationUser,
  loginUser,
  refreshToken,
  changePassword,
  updateProfile,
};
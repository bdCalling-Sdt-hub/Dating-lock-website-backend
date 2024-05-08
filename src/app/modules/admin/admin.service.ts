/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../../config';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  IChangePassword,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';
import { IActivationToken, IRegistration, IUser } from '../user/user.interface';
import User from '../user/user.model';
import Admin from './admin.model';
import httpStatus from 'http-status';
import QueryBuilder from '../../../builder/QueryBuilder';
import { IGenericResponse } from '../../../interfaces/paginations';
import { updateImageUrl } from '../../../utils/url-modifier';
import { IAdmin } from './admin.interface';
import { hashedPassword } from '../../../helpers/hashPasswordHelper';
import { sendEmail } from '../auth/sendResetMails';
import { ENUM_USER_ROLE } from '../../../enums/user';

//!
const registrationUser = async (payload: IRegistration) => {
  const { name, email, password } = payload;

  const user = {
    name,
    email,
    password,
  };
  const isEmailExist = await Admin.findOne({ email });
  if (isEmailExist) {
    throw new ApiError(400, 'Email already exist');
  }
  const newUser = await Admin.create(user);

  const { password: omit, ...userWithoutPassword } = newUser.toObject();

  return userWithoutPassword;
};
//!
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
    image: updateImageUrl(result.image).replace(/\\/g, '/'),
  };
  return updatedResult;
};
const getAllAdmin = async () => {
  const results = await Admin.find({}).lean();
  const updatedResults = results.map(result => {
    if (result) {
      const updatedResult = {
        ...result,
        image: updateImageUrl(result.image).replace(/\\/g, '/'),
      };
      return updatedResult;
    }
    return result;
  });
  return updatedResults;
};
//!
const updateAdmin = async (
  id: string,
  req: Request,
): Promise<IAdmin | null> => {
  //@ts-ignore
  const { files } = req;
  if (files?.image?.length) {
    const result = await Admin.findOneAndUpdate(
      { _id: id },
      //@ts-ignore
      { image: files.image[0].path },
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

    const parsedData = JSON.parse(data); // Parse the data if it exists

    const isExist = await Admin.findOne({ _id: id });

    if (!isExist) {
      throw new ApiError(404, 'Admin not found !');
    }

    const { ...AdminData } = parsedData;

    const updatedAdminData: Partial<IAdmin> = { ...AdminData };

    const result = await Admin.findOneAndUpdate({ _id: id }, updatedAdminData, {
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
const login = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await Admin.isAdminExist(email);
  const admin = await Admin.findOne({ email }).lean();
  //@ts-ignore
  const { password: omit, ...othersData } = admin;
  if (!isUserExist) {
    throw new ApiError(404, 'Admin does not exist');
  }

  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist.password))
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
    //@ts-ignore
    adminInfo: othersData,
  };
};
//!
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

  const isUserExist = await Admin.isAdminExist(userId);
  if (!isUserExist) {
    throw new ApiError(403, 'Admin does not exist');
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
//!
const changePassword = async (
  id: string | null,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isAdminExist = await Admin.findOne({ _id: id }).select('+password');

  if (!isAdminExist) {
    throw new ApiError(404, 'Admin does not exist');
  }
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(oldPassword, isAdminExist.password))
  ) {
    throw new ApiError(402, 'Old password is incorrect');
  }
  isAdminExist.password = newPassword;
  isAdminExist.save();
};
//!
const forgotPass = async (payload: { email: string }) => {
  const user = await Admin.findOne(
    { email: payload.email },
    { _id: 1, role: 1 },
  );

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Admin does not exist!');
  }

  let profile = null;
  if (user.role === ENUM_USER_ROLE.ADMIN) {
    profile = await Admin.findOne({ _id: user.id });
  } else if (user.role === ENUM_USER_ROLE.SUPER_ADMIN) {
    profile = await Admin.findOne({ _id: user.id });
  }

  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Pofile not found!');
  }

  if (!profile.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found!');
  }

  // const passResetToken = await jwtHelpers.createResetToken(
  //   { _id: user.id },
  //   config.jwt.secret as string,
  //   '50m',
  // );
  const activationToken = createActivationToken(user);
  const activationCode = activationToken.activationCode;

  // const resetLink: string = config.resetlink + `token=${passResetToken}`;
  const resetLink: string = `${config.resetlink}token=${activationToken.token}&email=${profile.email}`;
  await sendEmail(
    profile.email,
    `
      <div>
        <p>Hi, ${profile.name}</p>
        <p>Reset Code, ${activationCode}</p>
        <p>Your password reset link: <a href=${resetLink}>Click Here</a></p>
        <p>Thank you</p>
      </div>
  `,
  );
  return {
    resetToken: activationToken.token,
    user,
  };
};
//!
const createActivationToken = (user: IRegistration): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    config.activation_secret as Secret,
    {
      expiresIn: '5m',
    },
  );
  return { token, activationCode };
};
//!
const resetPassword = async (
  payload: {
    email: string;
    newPassword: string;
    activation_code: string;
    activation_token: string;
  },
  token: string,
) => {
  const { email, newPassword, activation_code, activation_token } = payload;
  const user = await Admin.findOne({ email }, { _id: 1 });

  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found!');
  }

  // await jwtHelpers.verifyToken(token, config.jwt.secret as string);
  const newUser: { user: IUser; activationCode: string } = jwt.verify(
    activation_token,
    config.activation_secret as string,
  ) as { user: IUser; activationCode: string };
  if (newUser.activationCode !== activation_code) {
    throw new ApiError(400, 'Activation code is not valid');
  }
  // const { name, email, password } = newUser.user;
  const existUser = await Admin.findOne({ email });
  if (existUser) {
    throw new ApiError(400, 'Email is already exist');
  }

  const password = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  await Admin.updateOne({ email }, { password });
};
//!
const myProfile = async (id: string) => {
  const result = await Admin.findById(id);
  if (!result) {
    throw new ApiError(404, 'Profile not found');
  }
  return result;
};

export const AdminService = {
  createUser,
  getAllUsers,
  getSingleUser,
  deleteUser,
  registrationUser,
  login,
  changePassword,
  refreshToken,
  updateAdmin,
  getAllAdmin,
  myProfile,
  forgotPass,
  resetPassword,
};

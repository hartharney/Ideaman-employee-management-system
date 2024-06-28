import bcryptjs, { genSalt } from "bcryptjs";
import Joi from "joi";
import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { DEPARTMENT, EMPLOYMENT_STATUS, JOB_TITLE, ROLE, WORK_TYPE } from "../API/User/model";
dotenv.config();


// generate access token
export const generateToken = async (input: Record<string, string>) => {
  return Jwt.sign(input, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

// verify token
export const verify = async (token: string) => {
  try {
    const verify = Jwt.verify(token, process.env.JWT_SECRET as string);
    return verify;
  } catch (error) {
    return "token expired";
  }
};

// hashing
export const bcryptEncoded = async (value: { value: string }) => {
  return bcryptjs.hash(value.value, await genSalt());
};

export const bcryptDecode = (password: string, comparePassword: string) => {
  return bcryptjs.compare(password, comparePassword);
};

export const generatePasswordResetToken = (): number => {
  return Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
};

export const hashPassword = (password: string): Promise<string> => {
  return bcryptjs.hash(password, bcryptjs.genSaltSync());
};

export const comparePasswords = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcryptjs.compare(password, hashedPassword);
};

// joi validators

export const option = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

// validate HR / Director registration


const locationSchema = Joi.object({
    address: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().integer(),
});

const scheduleSchema = Joi.object({
    startTime: Joi.string(),
    endTime: Joi.string(),
    workDays: Joi.array().items(Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    workSchedule: Joi.string(),
    workType: Joi.string().valid(...Object.values(WORK_TYPE)),
    workLocation: Joi.string(),
});

const emergencyContactSchema = Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required(),
});

const compensationDetailsSchema = Joi.object({
    bankName: Joi.string().required(),
    accountNumber: Joi.string().required(),
    accountName: Joi.string().required(),
    salary: Joi.string().required(),
});

const employmentSchema = Joi.object({
    department: Joi.string().valid(...Object.values(DEPARTMENT)),
    jobTitle: Joi.string().valid(...Object.values(JOB_TITLE)),
    status: Joi.string().valid(...Object.values(EMPLOYMENT_STATUS)),
    employeeId: Joi.string(),
    preferredName: Joi.string().allow(null, ''),
    dateOfEmployment: Joi.date(),
    dateOfBirth: Joi.date(),
    schedule: scheduleSchema,
    compensationDetails: compensationDetailsSchema,
    location: locationSchema,
    emergencyContacts: Joi.object({
        contact: Joi.array().items(emergencyContactSchema).min(1).required(),
    }),
});

export const loginSchema = Joi.object({
    email: Joi.string().trim().lowercase().email().required(),
    password: Joi.string().trim().regex(/^[a-zA-Z0-9]{3,18}$/).required(),
});

export const registerAdminSchema = Joi.object().keys({
    email: Joi.string().trim().lowercase().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLE)).required(),
    password: Joi.string()
        .trim()
        .regex(/^[a-zA-Z0-9]{3,18}$/)
        .required(),
    confirm_password: Joi.any()
        .equal(Joi.ref("password"))
        .required()
        .label("Confirm password")
        .messages({ "any.only": "{{#label}} does not match" }),
    phone: Joi.string().required(),
    employment : employmentSchema,
});

export const registerEmployeeSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    role: Joi.string().valid(...Object.values(ROLE)).required(),
    employment: employmentSchema.required(),
    default_email: Joi.string().email().required(),
});

import {Response, Request} from 'express';
import UserRequest from '../../types/UserRequest';
import { hashPassword, option, registerEmployeeSchema, registerAdminSchema, loginSchema, bcryptDecode, generateToken } from '../../utils/validators';
import { DEPARTMENT, EMPLOYMENT_STATUS, JOB_TITLE, ROLE, UserModel } from './model';
import { v4 as uuidv4 } from "uuid";
import { EmployeePassword, generateEmployeeId } from '../../lib/helpers/services';
import { sendEmployeeEmail } from '../../lib/emails/employeeRegistration';


// auth and register controller
export const RegisterAdmin = async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName, phone, role, password, confirm_password, employment } =
      req.body;

    const validateResult = registerAdminSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }
    const exist = await UserModel.findOne({ where: { email } });
    if (exist) {
      return res.status(400).json({ error: "email already in use" });
    }

    if(role !== ROLE.HR && role !== ROLE.DIRECTOR){
        console.log("HR", ROLE.HR, "Director", ROLE.DIRECTOR, role)
        return res.status(400).json({ error: "Invalid Role" });
    }

    const id = uuidv4();
    const user = await UserModel.create({
      ...validateResult.value,
      id,
      role: role,
      firstName,
      lastName,
      phone,
      employment : {
        department: "management",
        jobTitle: "director",
        status: EMPLOYMENT_STATUS.FULLTIME,
        employmentId:  generateEmployeeId(role || ROLE.HR),
      },
      password: await hashPassword(password),
    });
    return res.status(201).json({ msg: "Admin created successfully", user });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};
export const RegisterEmployee = async (req: Request, res: Response) => {
  try {
    const {
        email,
        firstName,
        lastName,
        phone,
        role,
        employment,
        default_email
    } = req.body;

    const validateResult = registerEmployeeSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }
    const userPass = EmployeePassword();

    const user = await UserModel.findOne({
      where: { email: email },
    });
    if (user) {
      return res.status(400).json({ error: "Email already exist" });
    }

    const id = uuidv4();
    const employeeId = generateEmployeeId(role || ROLE.EMPLOYEE);

    const newUser = await UserModel.create({
      ...validateResult.value,
        id,
        firstName,
        lastName,
        phone,
        employment : {...employment,
            department: DEPARTMENT.ONBOARDING,
            jobTitle: JOB_TITLE.ONBOARDING,
            status: EMPLOYMENT_STATUS.ONBOARDING,
            employmentId: employeeId,
        },
        role: role ?? ROLE.EMPLOYEE,
        password: await hashPassword(userPass),
    });

    if (!newUser) {
      return res.status(400).json({ error: "Email already exist" });
    }
    sendEmployeeEmail(email, userPass, employeeId, default_email);

    return res.status(201).json({
      msg: "Employee Login has been sent to default email",
      newUser,
    });
  } catch (error) {
    return res.status(500).json({
      error,
    });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const validateResult = loginSchema.validate(req.body, option);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ error: validateResult.error.details[0].message });
    }

    const User = (await UserModel.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };

    if (!User) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    const { id } = User;

     // Parse login data if it's a string
    let loginData = typeof User.login === 'string' ? JSON.parse(User.login) : User.login;

    // Ensure loginData has the correct structure
    loginData = {
      loginCount: loginData?.loginCount || 0,
      loginRetrieval: loginData?.loginRetrieval || 0,
      resetPasswordExpiration: loginData?.resetPasswordExpiration || null,
      resetPasswordStatus: loginData?.resetPasswordStatus || false,
      resetPasswordCode: loginData?.resetPasswordCode || null,
    };

    // Check if the user has exceeded login attempts
    if (loginData.loginCount >= 3) {
      return res.status(403).json({ error: "Account locked due to too many failed login attempts." });
    }

    const validUser = await bcryptDecode(password, User.password);

    if (!validUser) {
        // Increment login count on failed login
        loginData.loginCount += 1;
        await UserModel.update({ login: loginData }, { where: { email } });

        return res.status(400).json({ error: `Invalid credentials, you have ${3 - loginData.loginCount} login attempts left`});
    }


    // Reset login count on successful login
    loginData.loginCount = 0;

    const token = generateToken({ id: User.id });

    await UserModel.update({ login: loginData }, { where: { email } });

    res.cookie("token", "token", {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "SUCCESS",
      User,
      token,
    });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// query controller

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const employees = await UserModel.findAll();

    return res.status(200).json({
        msg: "Users fetched successfully",
        employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw new Error("Error fetching employees");
  }
};
import { Request } from "express";
import { Document } from "mongoose";
import IUser from '../Database/Schema/User';

interface UserRequest extends Request {
   user?: Document<IUser>;
}

export default UserRequest;
import express, { Response, Request } from 'express';
import { UserRouter} from '../API';

const router = express.Router();

router.use("/api", UserRouter);

export default router
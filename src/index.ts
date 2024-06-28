import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import router from './routes'

// Load environment variables
dotenv.config();

// Create Express server
const app = express()

// Express configuration
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cors());
app.use(helmet());
app.use(logger('dev'));
app.use(cookieParser());

app.use(router);

export default app;
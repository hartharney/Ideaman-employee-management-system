import express from 'express'

import { getAllUsers, Login, RegisterAdmin, RegisterEmployee } from './controller'

const router = express.Router()

router.get('/get_all_users', getAllUsers)

router.post('/login', Login)
router.post('/register_admin', RegisterAdmin)
router.post('/register_employee', RegisterEmployee)

export default router
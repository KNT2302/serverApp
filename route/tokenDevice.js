import express from 'express'
import { saveToken } from '../controller/tokenDevice.js'

const router = express.Router()

router.post("/", saveToken)

export default router

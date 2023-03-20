import express from 'express'
import { login, get, makeFriend, getFriend } from '../controller/user.js'


const router = express.Router()

router.post("/", login)
router.get("/", get)
router.post("/makefriend", makeFriend)
router.get("/friend", getFriend)


export default router

import express from 'express'
import { addPostToUser, getUserPost } from '../controller/post.js'

const router = express.Router()

router.post("/", addPostToUser)
router.get("/", getUserPost)

export default router

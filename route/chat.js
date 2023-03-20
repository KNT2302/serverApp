import express from "express"
import { createMessenger, getChat, getRoom, searchRoom } from "../controller/chat.js"

const route = express.Router()
route.get("/", getChat)
route.post("/", createMessenger)
route.get("/room", getRoom)
route.get('/search', searchRoom)

export default route

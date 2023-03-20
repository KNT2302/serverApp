import express from "express"
import { create, get } from "../controller/comment.js"

const route = express.Router()

route.post("/",create)
route.get("/", get)

export default route

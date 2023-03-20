import express from "express"
import { getMission, getUserMission } from "../controller/mission.js"

const route = express.Router()

route.get("/", getUserMission)

export default route

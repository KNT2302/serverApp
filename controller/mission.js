import { async } from "@firebase/util"
import { getAll, getAllFromArrayField } from "../ulti/common.js"

export const getMission = async (req, res, next) => {
  const allMission = await getAll(res, "mission")
  res.status(200).json({ success: true, data: allMission })
}

export const getUserMission = async (req, res, next) => {

  try {

    const { userId } = req.query
    const allMission = await getAll(res, "mission")

    const missionTrack = {
      mission: {
        task: null
      }
    }

    const task = []

    allMission.forEach((item, i) => {
      const objectMission = item.object
      switch (objectMission) {
        case "task":
          task.push({ mission: item.mission, total: item.total })
          break
        default:
          console.log("is not object")
      }
    })

    missionTrack.mission.task = task

    const userMissionTrack = await getAllFromArrayField(req, res, 'missionTrack', 'missionTrack')
    console.log(userMissionTrack)
    missionTrack["totalTask"] = userMissionTrack[0].task
    console.log(missionTrack)


    res.status(200).json({ success: true, data: missionTrack })

  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}

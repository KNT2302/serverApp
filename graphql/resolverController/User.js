import { async } from "@firebase/util"
import { getAuth } from "firebase/auth"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../../index.js"

export const getUsers = async (parent, args) => {

  try {

    const data = []

    const querySnapshot = await getDocs(collection(db, "devices"))
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      data.push(doc.data())
    })

    return data
  } catch (error) {
    return []
  }


}
 





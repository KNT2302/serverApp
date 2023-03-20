import { addDoc, collection, doc, getDocs, updateDoc, getDoc } from "firebase/firestore"
import { db } from "../index.js"

export const getAllUsers = async (res) => {

  const devices = []
  try {
    const querySnapshot = await getDocs(collection(db, "users"))

    querySnapshot.forEach((doc) => {
      devices.push(doc.data())
    })

    return devices

  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}


export const getUser = async (res, userId) => {
  try {
    const allUser = await getAllUsers(res)


    const user = allUser.filter((user) => user.userId === userId)
    return user
  } catch {
    res.status(200).json({ success: false, message: 'Failed!' })
  }
}


export const getOne = async (res, path, id, fieldName) => {
  try {
    const all = await getAll(res, path)


    const user = all.filter((item) => item[fieldName] === id)
    return user
  } catch {
    res.status(200).json({ success: false, message: 'Failed!' })
  }
}


export const getAll = async (res, path) => {
  const arr = []
  try {
    const querySnapshot = await getDocs(collection(db, path))

    querySnapshot.forEach((doc) => {
      arr.push(doc.data())
    })

    return arr

  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}

export const createOne = async (collectionName, data, res) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data)


    const oneRef = doc(db, collectionName, docRef.id)

    await updateDoc(oneRef, {
      id: docRef.id
    })

    return docRef.id

  } catch (error) {
    res.status(200).json(`failed ${error}`)
  }
}

export const getAllFromArrayField = async (req, res, path, fieldName) => {
  let result = null
  const user = await getUser(res, req.query.userId)
  if (user[0][fieldName]) {

    let arrayFiled = null


    if (path === "users") {

      const arrayIdDoc = Promise.all(user[0][fieldName].map(async (id) => {
        const response = await getUser(res, id)
        return response[0].docId
      }))
      arrayFiled = await arrayIdDoc
    } else {

      arrayFiled = user[0][fieldName]
    }

    console.log(arrayFiled)


    const getItemOfField = Promise.all(arrayFiled.map(async item => {
      const response = await getDoc(doc(db, path, item))
      return response.data()
    }))
    result = await getItemOfField
  } else {
    result = []
  }
  return result
}

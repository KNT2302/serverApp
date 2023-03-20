import { collection, addDoc } from "firebase/firestore";
import { db } from "../index.js"

export const saveToken =  async (req,res,next) => {
  try {
    const docRef = await addDoc(collection(db, "devices"), {
      currentToken: req.body.currentToken,
      userId: req.body.userId,
      lastCreate: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);
    res.status(200).json({success:true,message:`Document written`})
  } catch (e) {
    res.status(200).json({success:'false',err:e})
  }
} 

import express from "express";
import { addTextArea,getTextArea } from "../controllers/textController.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/add-text", verifyToken, addTextArea); 
router.get("/get-text", verifyToken, getTextArea);
// router.get("/get-text/:id", verifyToken, getSingleTextArea);
// router.put("/edit-text/:id", verifyToken,updateTextArea);    
// router.delete("/delete-text",verifyToken, deleteTextArea);

export default router;


import express from "express";
import { addTextArea,getTextArea,getTextAreaInd,EditedTextArea,ShareWithUser, GetSharedTextArea, deleteTextArea, deleteSharedText, deleteUserText, RemoveAccess  } from "../controllers/textController.js";
import { verifyToken } from "../utils/verifyToken.js";
const router = express.Router();

router.post("/add-text", verifyToken, addTextArea);  
router.get("/get-text", verifyToken, getTextArea);
router.get("/edittext/:id", verifyToken, getTextAreaInd).put("/edittext/:id", verifyToken, EditedTextArea);
router.get("/get-shared-text", verifyToken, GetSharedTextArea);
router.put("/share-text/:id", verifyToken, ShareWithUser);
// router.get("/get-text/:id", verifyToken, getSingleTextArea);
// router.put("/edit-text/:id", verifyToken,updateTextArea);   
router.delete("/delete-text",verifyToken, deleteTextArea);
router.put("/delete-shared-text",verifyToken, deleteSharedText);
router.delete("/delete-user-text",verifyToken, deleteUserText);
router.put("/remove-access",verifyToken, RemoveAccess);

export default router;


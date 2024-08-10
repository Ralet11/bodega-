import { Router } from "express";
import { addSubscription, addUserBalance, getUserById, updateUser, removeUserBalance, deleteUser, getUserForWeb} from "../controller/users.controller.js";
import { methods } from "../middleware.js";


const router = Router()

router.get('/get/:id', methods.auth, getUserById)
router.put('/updateUser', methods.auth, updateUser )
router.put('/addSubscription', methods.auth, addSubscription)
router.put('/addUserBalance', methods.auth, addUserBalance)
router.put('/removeUserBalance',methods.auth, removeUserBalance)
router.delete('/deleteUser', methods.auth, deleteUser)
router.get('/getForWeb/:id', methods.auth, getUserForWeb)

export default router
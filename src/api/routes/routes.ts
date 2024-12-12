import { Router } from "express";
import {taskDetails, retrievedTask, retrieve_task_status, taskUpdated, taskToDelete} from "../controllers/taskController";


const router = Router();

router.post("/addtask", taskDetails);
router.get("/tasks", retrievedTask);
router.get("/tasks/status", retrieve_task_status); 
router.put("/updatetask", taskUpdated);
router.delete("/deletetask/:task_id", taskToDelete);

export default router;
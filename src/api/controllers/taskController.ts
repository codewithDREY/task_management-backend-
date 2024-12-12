import { Request, Response } from "express";
import taskModels, { Status, taskValue } from "../models/taskModels";

// Add task controller
export const taskDetails = async (req: Request, res: Response): Promise<void> => {
    const { task_description, status, priority, notes, due_date, assigned_to }: taskValue = req.body;

    try {
        if (!task_description || !status || !priority) {
            res.status(400).json({ success: "Missing required fields" });
        };

        const exist = await taskModels.existTask(task_description);
        if (exist) {
            console.log("Task already exists", exist);
            res.status(409).json({ success: "Task already exists", task: exist });
        };

        const result = await taskModels.taskDetails({ task_description, status, priority, notes, due_date, assigned_to });
        console.log("Task added successfully", result);
        res.status(201).json({ success: "Task added successfully", data: result })
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An unexpected error occurred." })
    };
};


// Retrieve task controller
export const retrievedTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await taskModels.retrievedTask();

        if (result.length === 0) {
            res.status(404).json({ success: "Error! Task not found", error: "No tasks available" });
        };

        console.log("Task retrieved successfully!", result);
        res.status(200).json({ success: "Task retrieved successfully", data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};


// retrieve task by status
export const retrieve_task_status = async (req: Request, res: Response): Promise<void> => {
    const status = req.query.status as string;

    // Validate if status is in the Status enum and is not undefined or empty
    if (!status || !Object.values(Status).includes(status as Status)) {
        res.status(400).json({ error: "Invalid status value" });
    }

    try {
        const result = await taskModels.retrieve_task_status(status as Status);
        if (result.length === 0) {
            res.status(404).json({ error: "No tasks found for the given status" });
        }

        console.log("Task retrieved successfully!", result);
        res.status(200).json({ success: "Task retrieved successfully", data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};


// Task update controller
export const taskUpdated = async (req: Request, res: Response): Promise<void> => {
    const { status, task_id }: { status: string, task_id: number } = req.body;

    try {
        const result = await taskModels.taskUpdated({ status, task_id });
        console.log("Task updated successfully", result);
        res.status(201).json({ success: "Task updated successfully", data: result });
    } catch (error) {
        console.error("unsuccessfully", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};


// Task delete controller
export const taskToDelete = async (req: Request, res: Response): Promise<void> => {
    const task_id: number = parseInt(req.params.task_id, 10);

    if (isNaN(task_id)) {
        res.status(400).json({ error: " Invalid ID" })
    };

    try {
        const result = await taskModels.taskToDelete(task_id);
        console.log("Task deleted successfully", result);
        res.status(201).json({ success: "Task deleted successfully", data: result });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

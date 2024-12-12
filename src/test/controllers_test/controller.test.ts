import { Request, Response } from 'express';
import { taskDetails, taskUpdated,retrieve_task_status,  taskToDelete, retrievedTask } from '@controllers/taskController';  // Correct import path
import taskModels from '@models/taskModels'

jest.mock("@models/taskModels");

describe("Task Controller", () => {

    describe("taskDetails", () => {
        it("should return 400 if required fields are missing", async () => {
            const mockReq = {
                body: { task_description: "", status: "", priority: "" }
            } as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await taskDetails(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Missing required fields" });
        });

        it("should return 409 if task already exists", async () => {
            const mockReq = {
                body: { task_description: "Test Task", status: "New", priority: "High" }
            } as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.existTask as jest.Mock).mockResolvedValue({ task_description: "Test Task" });

            await taskDetails(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(409);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task already exists", task: { task_description: "Test Task" } });
        });

        it("should return 201 when task is added successfully", async () => {
            const mockReq = {
                body: { task_description: "Test Task", status: "New", priority: "High" }
            } as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.existTask as jest.Mock).mockResolvedValue(null);
            (taskModels.taskDetails as jest.Mock).mockResolvedValue({ id: 1, task_description: "Test Task", status: "New" });

            await taskDetails(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task added successfully", data: { id: 1, task_description: "Test Task", status: "New" } });
        });
    });

    describe("retrievedTask", () => {
        it("should return 404 if no tasks are found", async () => {
            const mockReq = {} as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.retrievedTask as jest.Mock).mockResolvedValue([]);

            await retrievedTask(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Error! Task not found", error: "No tasks available" });
        });

        it("should return 200 with tasks when found", async () => {
            const mockReq = {} as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const mockTasks = [{ id: 1, task_description: "Test Task", status: "New" }];
            (taskModels.retrievedTask as jest.Mock).mockResolvedValue(mockTasks);

            await retrievedTask(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task retrieved successfully", data: mockTasks });
        });
    });

    describe("retrieve_task_status", () => {
        it("should return 400 for invalid status", async () => {
            const mockReq = { query: { status: "InvalidStatus" } } as unknown as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await retrieve_task_status(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Invalid status value" });
        });

        it("should return 404 if no tasks found for valid status", async () => {
            const mockReq = { query: { status: "New" } } as unknown as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.retrieve_task_status as jest.Mock).mockResolvedValue([]);

            await retrieve_task_status(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "No tasks found for the given status" });
        });

        it("should return 200 with tasks for valid status", async () => {
            const mockReq = { query: { status: "New" } } as unknown as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            const mockTasks = [{ id: 1, task_description: "Test Task", status: "New" }];
            (taskModels.retrieve_task_status as jest.Mock).mockResolvedValue(mockTasks);

            await retrieve_task_status(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task retrieved successfully", data: mockTasks });
        });
    });

    describe("taskUpdated", () => {
        it("should return 201 when task is updated successfully", async () => {
            const mockReq = { body: { status: "Completed", task_id: 1 } } as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.taskUpdated as jest.Mock).mockResolvedValue({ id: 1, status: "Completed" });

            await taskUpdated(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task updated successfully", data: { id: 1, status: "Completed" } });
        });
    });

    describe("taskToDelete", () => {
        it("should return 400 if task ID is invalid", async () => {
            const mockReq = { params: { task_id: "invalid" } } as unknown as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            await taskToDelete(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ error: " Invalid ID" });
        });

        it("should return 201 when task is deleted successfully", async () => {
            const mockReq = { params: { task_id: "1" } } as unknown as Request;
            const mockRes = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            } as unknown as Response;

            (taskModels.taskToDelete as jest.Mock).mockResolvedValue({ id: 1, task_description: "Test Task" });

            await taskToDelete(mockReq, mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ success: "Task deleted successfully", data: { id: 1, task_description: "Test Task" } });
        });
    });

});
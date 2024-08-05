import type { NextApiRequest, NextApiResponse } from "next";
import { getActiveTasks, getAllTasks, getCompletedTasks, createTask, updateTask, deleteTask } from "@/modules/taskManager";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      if (req.query.type === "active") {
        const activeTasks = getActiveTasks();
        res.status(200).json(activeTasks);
      } else if (req.query.type === "completed") {
        const completedTasks = getCompletedTasks();
        res.status(200).json(completedTasks);
      } else {
        const allTasks = getAllTasks();
        res.status(200).json(allTasks);
      }
      break;

    case "POST":
      const { title, description, persona, group, section } = req.body;
      if (!title || !description || !persona || group === undefined || section === undefined) {
        res.status(400).json({ error: "Missing required fields" });
      } else {
        createTask(title, description, persona, group, section); // Added section parameter
        res.status(201).json({ message: "Task created successfully" });
      }
      break;

    case "PUT":
      const { id, ...updatedTask } = req.body;
      if (!id) {
        res.status(400).json({ error: "Task ID is required" });
      } else {
        updateTask(id, updatedTask);
        res.status(200).json({ message: "Task updated successfully" });
      }
      break;

    case "DELETE":
      const taskId = req.body.id;
      if (!taskId) {
        res.status(400).json({ error: "Task ID is required" });
      } else {
        deleteTask(taskId);
        res.status(200).json({ message: "Task deleted successfully" });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

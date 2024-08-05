import type { NextApiRequest, NextApiResponse } from 'next';
import { getActiveTasks, getAllTasks, getCompletedTasks, createTask, updateTask, deleteTask } from '@/modules/taskManager';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      handleGetRequest(req, res);
      break;
    case 'POST':
      handlePostRequest(req, res);
      break;
    case 'PUT':
      handlePutRequest(req, res);
      break;
    case 'DELETE':
      handleDeleteRequest(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query;

  if (type === 'active') {
    const activeTasks = getActiveTasks();
    res.status(200).json(activeTasks);
  } else if (type === 'completed') {
    const completedTasks = getCompletedTasks();
    res.status(200).json(completedTasks);
  } else {
    const allTasks = getAllTasks();
    res.status(200).json(allTasks);
  }
}

function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const { title, description, persona, group, section } = req.body;

  if (!title || !description || !persona || group === undefined || section === undefined) {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  createTask(title, description, persona, group, section); // Passing the section parameter
  res.status(201).json({ message: 'Task created successfully' });
}

function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, ...updatedTask } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Task ID is required' });
    return;
  }

  updateTask(id, updatedTask);
  res.status(200).json({ message: 'Task updated successfully' });
}

function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.body;

  if (!id) {
    res.status(400).json({ error: 'Task ID is required' });
    return;
  }

  deleteTask(id);
  res.status(200).json({ message: 'Task deleted successfully' });
}

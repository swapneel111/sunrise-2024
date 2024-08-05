import Task from "@/model/Task";
import { initialTasks } from "@/utils/TaskList";

let tasks: Task[] = [...initialTasks];

export function initializeTasks() {
  tasks = [...initialTasks];
  if (tasks.length === 0) {
    createTask('First Task', 'This is the first task.', 'User', 1, 1);
  }
}

export function getActiveTasks(): Task[] {
  return tasks.filter(task => !task.completed); // Changed to completed
}

export function getCompletedTasks(): Task[] {
  return tasks.filter(task => task.completed); // Changed to completed
}

export function getAllTasks(): Task[] {
  return tasks;
}

export function completeTask(taskTitle: string): void {
  const task = tasks.find(task => task.title === taskTitle);
  
  if (task) {
    task.completed = true; // Changed to completed
  }
  
  const activeGroup = task?.group || 0;
  
  // Check if all tasks in the current group are completed
  const allTasksCompleted = tasks
    .filter(t => t.group === activeGroup)
    .every(t => t.completed); // Changed to completed
  
  // If all tasks are completed, generate tasks for the next group
  if (allTasksCompleted) {
    const nextGroup = activeGroup + 1;
    generateTasksForGroup(nextGroup);
  }
}

function generateTasksForGroup(group: number) {
  for (let section = 1; section <= 1; section++) {
    createTask(`Task ${group}-${section}`, `Task in group ${group}, section ${section}.`, 'User', group, section);
  }
}

export function createTask(title: string, description: string, persona: string, group: number, section: number): void {
  const newTask: Task = {
    id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
    title,
    description,
    persona,
    group,
    section,
    completed: false, // Changed to completed
  };

  tasks.push(newTask);
}

export function updateTask(taskId: number, updatedTask: Partial<Omit<Task, 'id'>>): void {
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
  }
}

export function deleteTask(taskId: number): void {
  tasks = tasks.filter(task => task.id !== taskId);
}

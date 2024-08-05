// tests/taskManager.test.ts

import { initializeTasks, getActiveTasks, completeTask, getCompletedTasks, getAllTasks, createTask, updateTask, deleteTask } from "@/modules/taskManager";



describe('Task Manager', () => {
  beforeEach(() => {
    initializeTasks();
  });

  test('should create initial task on initialization', () => {
    const activeTasks = getActiveTasks();
    expect(activeTasks).toContainEqual(
      expect.objectContaining({ title: 'Initial Setup' })
    );
  });

  test('should not have Group 2 tasks before completing Group 1', () => {
    // Mark all Group 1 tasks as incomplete
    completeTask('Initial Setup');
    const activeTasks = getActiveTasks();
    expect(activeTasks).not.toContainEqual(
      expect.objectContaining({ title: 'Basic Git' })
    );
  });
  
  test('should mark task as completed', () => {
    completeTask('Basic Introduction');
    const completedTasks = getCompletedTasks();
    expect(completedTasks).toContainEqual(
      expect.objectContaining({ title: 'Basic Introduction' })
    );
  });

  test('should fetch active tasks', () => {
    // Assuming we complete the initial tasks and only expect tasks from the next groups
    completeTask('Initial Setup'); // Complete an initial task if needed
    
    const activeTasks = getActiveTasks();
    expect(activeTasks).toEqual([
      {
        id: 3,
        title: "Basic Git",
        description: "Learn basic Git commands.",
        group: 2,
        completed: false,
        persona: "Intern",
        section: 1,
      },
      {
        id: 4,
        title: "Git Collaboration",
        description: "Collaborate on a Git repository.",
        group: 2,
        completed: false,
        persona: "Intern",
        section: 1,
      },
    ]);
  });
  
  

  test('should fetch all tasks', () => {
    const allTasks = getAllTasks();
    expect(allTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Initial Setup' }),
        expect.objectContaining({ title: 'Basic Introduction' }),
        expect.objectContaining({ title: 'Basic Git' }),
        expect.objectContaining({ title: 'Git Collaboration' }),
        expect.objectContaining({ title: 'JavaScript Basics' }),
        expect.objectContaining({ title: 'JavaScript Project' }),
        expect.objectContaining({ title: 'API Introduction' }),
        expect.objectContaining({ title: 'API Consumption' }),
        expect.objectContaining({ title: 'Final Project' }),
        expect.objectContaining({ title: 'Project Presentation' })

      ])
    );
  });

  test('should fetch completed tasks', () => {
    completeTask('Basic Introduction');
    const completedTasks = getCompletedTasks();
    expect(completedTasks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Basic Introduction' })
      ])
    );
  });

  test('should create a new task', () => {
    createTask('New Task', 'New task description', 'Intern', 1);
    const activeTasks = getActiveTasks();
    expect(activeTasks).toContainEqual(
      expect.objectContaining({ title: 'New Task' })
    );
  });

  test('should update a task', () => {
    const taskToUpdate = getActiveTasks()[0];
    updateTask(taskToUpdate.id, { title: 'Updated Task Title' });
    const updatedTask = getAllTasks().find(task => task.id === taskToUpdate.id);
    expect(updatedTask?.title).toBe('Updated Task Title');
  });

  test('should delete a task', () => {
    const taskToDelete = getActiveTasks()[0];
    deleteTask(taskToDelete.id);
    const activeTasks = getActiveTasks();
    expect(activeTasks).not.toContainEqual(
      expect.objectContaining({ id: taskToDelete.id })
    );
  });

  test('should enforce task completion order', () => {
    completeTask('Initial Setup');
    completeTask('Basic Introduction');
    const activeTasks = getActiveTasks();
    expect(activeTasks).toContainEqual(
      expect.objectContaining({ title: 'Basic Git' })
    );
  });
});

import React, { useState, useEffect } from 'react';
import { Container, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { initializeTasks, getAllTasks, completeTask, createTask, deleteTask } from '../modules/taskManager';
import { styled } from '@mui/system';
import Task from '../model/Task'; // Ensure this import is correct

const Card = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 250px;
  height: 250px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  margin-bottom: 16px;
`;

const Column = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 8px;
`;

const Row = styled('div')`
  display: flex;
  justify-content: space-between;
`;

const Counter = styled('div')`
  margin-top: 10px;
  font-size: 1rem;
  font-weight: bold;
  color: #007bff; /* Primary color */
  background-color: #f1f1f1; /* Light background for contrast */
  padding: 8px 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CreateButton = styled(Button)`
  && {
    font-size: 0.875rem;
    padding: 6px 16px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s, box-shadow 0.3s;
    &:hover {
      background-color: #f3f4f6;
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

const Navbar = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

function App() {
  const [tasks, setTasks] = useState<Task[]>(getAllTasks());
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]); // Explicitly typed as Task[]
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]); // Explicitly typed as Task[]
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState<{ title: string; description: string; persona: string; group: number; section: number }>({
    title: '',
    description: '',
    persona: '',
    group: 0,
    section: 1, // Add a default value for section
  });
  const [inProgressTracker, setInProgressTracker] = useState<Set<string>>(new Set()); // Explicitly typed as Set<string>

  useEffect(() => {
    initializeTasks();
    setTasks(getAllTasks());
  }, []);

  const handleComplete = (title: string) => {
    if (inProgressTracker.has(title)) {
      return;
    }

    setInProgressTracker(new Set([...inProgressTracker, title]));
    completeTask(title);
    setTasks(getAllTasks());

    const updatedCompletedTasks = inProgressTasks.filter(task => task.title === title);
    setCompletedTasks([...completedTasks, ...updatedCompletedTasks]);

    setTimeout(() => {
      setInProgressTracker(prev => {
        const newSet = new Set(prev);
        newSet.delete(title);
        return newSet;
      });
    }, 6000);

    setInProgressTasks(prev => prev.filter(task => task.title !== title));
  };

  const handleMoveToInProgress = (task: Task) => { // Typing as Task
    setInProgressTasks([...inProgressTasks, task]);
    setTasks(tasks.filter(t => t.title !== task.title));
  };

  const handleCreate = () => {
    createTask(newTask.title, newTask.description, newTask.persona, newTask.group, newTask.section);
    setTasks(getAllTasks());
    setOpen(false);
  };

  return (
    <>
      <Navbar>
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <CreateButton 
          variant="outlined" 
          onClick={() => setOpen(true)}
        >
          Create Task
        </CreateButton>
      </Navbar>

      <Container className="p-4 max-w-4xl mx-auto mt-4">
        <Row>
          <Column>
            <Counter>To-Do: {tasks.filter(task => !inProgressTasks.includes(task) && !completedTasks.includes(task)).length}</Counter>
            <h2 className="text-xl font-bold mb-2">To-Do</h2>
            {tasks
              .filter(task => !inProgressTasks.includes(task) && !completedTasks.includes(task))
              .sort((a, b) => a.group - b.group || a.section - b.section)
              .map(task => (
                <Card key={task.id} className="flex flex-col items-center">
                  <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
                  <p className="text-gray-600 mb-4">{task.description}</p>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => handleMoveToInProgress(task)}
                  >
                    Start
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => {
                      deleteTask(task.id);
                      setTasks(getAllTasks());
                    }}
                  >
                    Delete
                  </Button>
                </Card>
              ))}
          </Column>

          <Column>
            <Counter>In Progress: {inProgressTasks.length}</Counter>
            <h2 className="text-xl font-bold mb-2">In Progress</h2>
            {inProgressTasks.map(task => (
              <Card key={task.id} className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-600 mb-4">{task.description}</p>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => handleComplete(task.title)}
                >
                  Done
                </Button>
              </Card>
            ))}
          </Column>

          <Column>
            <Counter>Completed: {completedTasks.length}</Counter>
            <h2 className="text-xl font-bold mb-2">Completed Tasks</h2>
            {completedTasks.map(task => (
              <Card key={task.id} className="flex flex-col items-center">
                <h2 className="text-lg font-semibold mb-2">{task.title}</h2>
                <p className="text-gray-600 mb-4">{task.description}</p>
              </Card>
            ))}
          </Column>
        </Row>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Create Task</DialogTitle>
          <DialogContent>
            <TextField 
              label="Title" 
              fullWidth 
              className="mb-4"
              onChange={e => setNewTask({ ...newTask, title: e.target.value })} 
            />
            <TextField 
              label="Description" 
              fullWidth 
              className="mb-4"
              onChange={e => setNewTask({ ...newTask, description: e.target.value })} 
            />
            <TextField 
              label="Persona" 
              fullWidth 
              className="mb-4"
              onChange={e => setNewTask({ ...newTask, persona: e.target.value })} 
            />
            <TextField 
              label="Group" 
              fullWidth 
              type="number" 
              className="mb-4"
              onChange={e => setNewTask({ ...newTask, group: parseInt(e.target.value, 10) })} 
            />
            <TextField 
              label="Section" 
              fullWidth 
              type="number" 
              className="mb-4"
              value={newTask.section}
              onChange={e => setNewTask({ ...newTask, section: parseInt(e.target.value, 10) })} 
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate}>Create</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default App;

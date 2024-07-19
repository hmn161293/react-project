import React, { useEffect } from 'react';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store'; // Import the AppDispatch type
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import CreateTask from '../components/drawerpop';
import TaskPopDemo from '../components/popover';
import { fetchTasks } from '../redux/taskSlice'; // Adjust the import path as needed

type StatusOption = {
  id: number;
  name: string;
  label: string;
};

type UserOption = {
  id: number;
  username: string;
};

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Type dispatch
  const tasks = useSelector((state: RootState) => state.tasks.data) || [];
  const statuses = useSelector((state: RootState) => state.status.data) as StatusOption[] || [];
  const error = useSelector((state: RootState) => state.tasks.error);
  const redux = useSelector((state: RootState) => state);
  console.log(redux)
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const renderTasks = (statusName: string) => {
    if (!tasks.length) {
      return <p>No tasks found.</p>;
    }

    
    // Ensure tasks are valid and have a status field
    const filteredTasks = tasks.filter((task) => task.status && task.status.name === statusName);
    return filteredTasks.length ? (
      filteredTasks.map((task) => (
        <TaskPopDemo key={task.id} task={task} onTaskUpdate={() => dispatch(fetchTasks())} />
      ))
    ) : (
      <p>No tasks found for this status.</p>
    );
  };

  const handleCreateTask = async (): Promise<void> => {
    try {
      await dispatch(fetchTasks());
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>ToDoList</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <h1 className="text-3xl font-normal mt-6 mb-4 text-gray-400">To Do List</h1>
      </div>

      {error && <p className="col-span-3 text-red-500">{error}</p>}
      
      {statuses.length ? (
        statuses.map((status) => (
          <div key={status.id} className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold">{status.label}</h2>
              </div>
              <CreateTask onCreateTask={handleCreateTask} />
            </div>
            <div className="space-y-4">
              {renderTasks(status.name)}
            </div>
          </div>
        ))
      ) : (
        <p className="col-span-3 text-gray-500">No statuses available.</p>
      )}
    </div>
  );
};

export default Dashboard;

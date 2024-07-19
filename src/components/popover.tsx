import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { updateTask } from '../redux/taskSlice'; // Import the updateTask thunk
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import avatar from '../ui/avatar';
import { Clock } from 'lucide-react';
import { Icons } from './icons'; 

const { Avatar } = avatar;

interface StatusOption {
  id: number;
  name: string;
  label: string;
}

interface UserOption {
  id: number;
  username: string;
}

interface TaskPopDemoProps {
  task: Task;
  onTaskUpdate: () => void; // Prop to trigger task update in Dashboard
}

interface Task {
  id: number;
  Name: string;
  label: string;
  slug: string;
  description?: string;
  status: StatusOption;
  assignee: UserOption | null; // Updated to allow null
  updatedAt?: string; // Include updatedAt field
}

const TaskPopDemo: React.FC<TaskPopDemoProps> = ({ task, onTaskUpdate }) => {
  const statusOptions = useSelector((state: RootState) => state.status.data as StatusOption[]);
  const userOptions = useSelector((state: RootState) => state.users.data as UserOption[]);
  
  const dispatch = useDispatch();
 
  const [description, setDescription] = useState(task.description || '');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState(task.Name);
  const [status, setStatus] = useState<StatusOption | null>(task.status);
  const [assignedPerson, setAssignedPerson] = useState<UserOption | null>(task.assignee);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  
  const formatUpdatedAt = (updatedAt?: string): string => {
    if (!updatedAt) {
      return 'No date available';
    }
    const date = new Date(updatedAt);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handleNameChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setName(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    const selectedOption = statusOptions.find(option => option.label === value);
    if (selectedOption) {
      setStatus(selectedOption);
    }
  };

  const handleAssignedPersonChange = (value: string) => {
    const selectedOption = userOptions.find(option => option.username === value);
    if (selectedOption) {
      setAssignedPerson(selectedOption);
    } else {
      // Handle case where no selection is made
      setAssignedPerson(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
  
    if (!name.trim()) {
      setError('Name field cannot be empty.');
      setLoading(false);
      return;
    } else if (!status) {
      setError('Status field cannot be empty.');
      setLoading(false);
      return;
    } else {
      setError('');
    }
    
    const taskData = {
      id: task.id,
      Name: name,
      label: name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description: description,
      status: status,
      assignee: assignedPerson, // Can be null
      updatedAt: task.updatedAt || '', // Handle undefined value here
    };
  
    try {
      await dispatch(updateTask({ id: task.id, updatedData: taskData }) as any);
      onTaskUpdate();
      setTimeout(() => {
        setShowSpinner(true);
        setLoading(false);
      }, 500); // Added a timeout delay for spinner effect
    } catch (err) {
      console.error('Error updating task:', err);
      setLoading(false);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div key={task.id} className="border border-gray-300 p-4 mb-4 rounded cursor-pointer">
          <div className="flex flex-col">
            <div className="mb-2" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
              <p className="text-sm text-gray-700 line-clamp-3">{task.description}</p>
            </div>
            <div className="flex items-center mt-2">
              <div className="mr-2 h-8 w-8 flex items-center">
                <Avatar name={assignedPerson ? assignedPerson.username : 'None'} className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm text-gray-600">{assignedPerson ? assignedPerson.username : 'Click to assign Task'}</p>
              </div>
              <div className="ml-auto flex items-end">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="ml-1 text-xs text-gray-500">{formatUpdatedAt(task.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-90">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Edit task</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="name">Name</Label>
              <textarea
                id="name"
                value={name}
                onChange={handleNameChange}
                className="col-span-2 h-8 border border-gray-300 px-2 rounded"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                className="col-span-2 h-20 min-h-8 max-h-30 border border-gray-300 px-2 rounded resize-y overflow-auto"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value={status ? status.label : ''} onValueChange={handleStatusChange}>
                <SelectTrigger className="col-span-2 h-8 border border-gray-300 px-2 rounded">
                  <SelectValue placeholder="Please select status of this task" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.id} value={option.label}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="assignedPerson">Assign task to</Label>
              <Select value={assignedPerson ? assignedPerson.username : ''} onValueChange={handleAssignedPersonChange}>
                <SelectTrigger className="col-span-2 h-8 border border-gray-300 px-2 rounded">
                  <SelectValue placeholder="Please select a person to assign this task" />
                </SelectTrigger>
                <SelectContent>
                  {userOptions.map(option => (
                    <SelectItem key={option.id} value={option.username}>
                      {option.username}
                    </SelectItem>
                  ))}
                 
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="col-span-2 h-8 border border-gray-300 px-2 rounded"
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={handleSubmit} disabled={loading}>
                {loading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TaskPopDemo;

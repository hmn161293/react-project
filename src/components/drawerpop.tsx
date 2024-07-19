import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../redux/taskSlice';
import { RootState } from '../redux/store';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import FileUpload from '../api/filesubmit';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type StatusOption = {
  id: number;
  name: string;
  label: string;
};

type UserOption = {
  id: number;
  username: string;
};

interface CreateTaskProps {
  onCreateTask: () => Promise<void>;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onCreateTask }) => {
  const statusOptions = useSelector((state: RootState) => state.status.data as StatusOption[]);
  const userOptions = useSelector((state: RootState) => state.users.data as UserOption[]);
  const token = useSelector((state: RootState) => state.auth.token); // Get the token from state
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState<StatusOption | null>(null);
  const [assignedPerson, setAssignedPerson] = useState<UserOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);

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
    } else if (!assignedPerson) {
      setError('Assignee field cannot be empty.');
      setLoading(false);
      return;
    } else if (!token) {
      setError('Token is missing.');
      setLoading(false);
      return;
    } else {
      setError('');
    }

    try {
      const fileResponse = file ? await FileUpload({ file }) : null;

      const newTask = {
        Name: name,
        label: name,
        slug: name.toLowerCase().replace(/\s+/g, '-'),
        description: description,
        status: status,
        assignee: assignedPerson,
        files: fileResponse
      };

      // Dispatch createTask with newTask and token
      await dispatch(createTask( newTask) as any);

      setName('');
      setDescription('');
      setStatus(null);
      setAssignedPerson(null);
      setFile(null);
      setDialogOpen(false);
      setLoading(false);

      await onCreateTask();
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task.');
      setLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>Create Task</Button> {/* Ensure this button is visible */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new task</DialogTitle>
            <DialogDescription>
              Fill in the details and submit to create a new task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-2">
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
                className="col-span-2 h-20 min-h-8 border border-gray-300 px-2 rounded resize-y"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select value={status ? status.label : 'Please select status of this task'} onValueChange={handleStatusChange}>
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
              <Select value={assignedPerson ? assignedPerson.username : 'Please select a person to assign this task'} onValueChange={handleAssignedPersonChange}>
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
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
            {error && <p>{error}</p>}
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTask;

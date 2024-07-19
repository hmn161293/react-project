// src/components/StatusEdit.tsx

import * as React from "react";
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store'; // Import AppDispatch from your store
import { updateStatus, deleteStatus, createStatus } from '../redux/statusSlice'; // Adjust the import path as necessary
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface StatusEditProps {
  status?: StatusOption; // status is now optional
}

type StatusOption = {
  id: number;
  name: string;
  label: string;
};

export function StatusEdit({ status }: StatusEditProps) {
  const [name, setName] = React.useState(status?.name || '');
  const [newName, setNewName] = React.useState('');
  const dispatch = useDispatch<AppDispatch>(); // Type the dispatch function with AppDispatch

  // Convert name to uppercase with underscores
  const formattedName = name.replace(/\s+/g, '_').toUpperCase();
  const label = name; // Use the original name as the label

  const handleUpdate = async () => {
    if (status) { // Check if status is defined
      try {
        await dispatch(updateStatus({ id: status.id, updatedData: { name: formattedName, label } })).unwrap();
        alert('Status updated successfully');
      } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status');
      }
    }
  };

  const handleRemove = async () => {
    if (status) { // Check if status is defined
      try {
        await dispatch(deleteStatus(status.id)).unwrap();
        alert('Status removed successfully');
      } catch (error) {
        console.error('Error removing status:', error);
        alert('Failed to remove status');
      }
    }
  };

  const handleCreate = async () => {
    if (newName) {
      const newStatus = {
        name: newName.replace(/\s+/g, '_').toUpperCase(),
        label: newName
      };
      try {
        await dispatch(createStatus(newStatus)).unwrap();
        setNewName(''); // Clear the input field
        alert('Status created successfully');
      } catch (error) {
        console.error('Error creating status:', error);
        alert('Failed to create status');
      }
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Status</h1>
      <p className="mb-4">Make changes to the status here. Click save when you're done.</p>
      <ProfileForm 
        name={name}
        setName={setName}
        handleUpdate={handleUpdate}
        handleRemove={handleRemove}
        newName={newName}
        setNewName={setNewName}
        handleCreate={handleCreate}
      />
    </div>
  );
}

interface ProfileFormProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  handleUpdate: () => void;
  handleRemove: () => void;
  newName: string;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  handleCreate: () => void;
}

function ProfileForm({ name, setName, handleUpdate, handleRemove, newName, setNewName, handleCreate }: ProfileFormProps) {
  return (
    <form className="grid items-start gap-4">
      <div className="grid gap-2">
        <Label htmlFor="status-name">Status Name</Label>
        <Input 
          type="text" 
          id="status-name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new-status-name">New Status Name</Label>
        <Input 
          type="text" 
          id="new-status-name" 
          value={newName} 
          onChange={(e) => setNewName(e.target.value)}
        />
      </div>
      <div className="flex gap-4">
        <Button type="button" onClick={handleRemove} className="bg-red-500 text-white hover:bg-red-700">
          Remove status
        </Button>
        <Button type="button" onClick={handleUpdate}>
          Save changes
        </Button>
        <Button type="button" onClick={handleCreate} className="bg-green-500 text-white hover:bg-green-700">
          Create new status
        </Button>
      </div>
    </form>
  );
}

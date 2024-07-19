export interface StatusOption {
  id: number;
  name: string;
}

export interface UserOption {
  id: number;
  username: string;
}

export interface Task {
  id: number;
  Name: string;
  label: string;
  slug: string;
  description?: string;
  status: StatusOption; // Status as an object with id and name
  assignee: UserOption;
}

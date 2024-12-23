export interface UserFormData {
  email: string;
  full_name: string;
  is_admin: boolean;
  status: 'active' | 'inactive';
}

export interface UseUserFormProps {
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    status: 'active' | 'inactive';
  };
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}
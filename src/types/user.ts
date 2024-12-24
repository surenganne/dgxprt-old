export interface UserFormData {
  id?: string;
  email: string;
  full_name: string;
  is_admin: boolean;
  is_owner?: boolean;
  is_compliance_officer?: boolean;
  notify_on_upload?: boolean;
  notify_on_review?: boolean;
  status: 'active' | 'inactive';
  assigned_locations?: string[];
}

export interface UseUserFormProps {
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
    is_owner?: boolean | null;
    is_compliance_officer?: boolean | null;
    status: 'active' | 'inactive';
  };
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}
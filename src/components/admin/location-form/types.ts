export interface LocationFormData {
  name: string;
  type: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  parent_id?: string | null;
}

export interface LocationData extends LocationFormData {
  id: string;
}
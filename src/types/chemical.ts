import type { Database } from "@/integrations/supabase/types";

type ChemicalHazardClass = Database["public"]["Enums"]["chemical_hazard_class"];

export type Chemical = {
  id: string;
  name: string;
  cas_number: string | null;
  hazard_class: ChemicalHazardClass;
  description: string | null;
  storage_conditions: string | null;
  handling_precautions: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type ChemicalsResponse = {
  chemicals: Chemical[];
  totalCount: number;
};
export type Chemical = {
  id: string;
  name: string;
  cas_number: string | null;
  hazard_class: string;
  description: string | null;
};

export type ChemicalsResponse = {
  chemicals: Chemical[];
  totalCount: number;
};
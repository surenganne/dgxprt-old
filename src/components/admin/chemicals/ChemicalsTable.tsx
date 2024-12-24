import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Chemical } from "@/types/chemical";

interface ChemicalsTableProps {
  chemicals: Chemical[];
}

export const ChemicalsTable = ({ chemicals }: ChemicalsTableProps) => {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>CAS Number</TableHead>
            <TableHead>Hazard Class</TableHead>
            <TableHead>Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {chemicals.map((chemical) => (
            <TableRow key={chemical.id}>
              <TableCell>{chemical.name}</TableCell>
              <TableCell>{chemical.cas_number || "-"}</TableCell>
              <TableCell className="capitalize">
                {chemical.hazard_class.replace("_", " ")}
              </TableCell>
              <TableCell>{chemical.description || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
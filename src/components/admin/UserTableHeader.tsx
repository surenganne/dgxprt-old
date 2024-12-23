import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const UserTableHeader = () => {
  return (
    <TableHeader>
      <TableRow className="bg-gray-50">
        <TableHead className="text-primary-blue">Name</TableHead>
        <TableHead className="text-primary-blue">Email</TableHead>
        <TableHead className="text-primary-blue">Role</TableHead>
        <TableHead className="text-primary-blue">Status</TableHead>
        <TableHead className="text-primary-blue">Created At</TableHead>
        <TableHead className="text-right text-primary-blue">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
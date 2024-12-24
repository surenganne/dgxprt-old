import { Table, TableBody } from "@/components/ui/table";
import { UserTableHeader } from "./UserTableHeader";
import { UserTableRow } from "./UserTableRow";

interface UserTableProps {
  users: any[];
  isLoading: boolean;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onSendPassword: (email: string) => void;
}

export const UserTable = ({
  users,
  isLoading,
  onEdit,
  onDelete,
  onSendPassword,
}: UserTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <Table>
        <UserTableHeader />
        <TableBody>
          {users?.map((user) => (
            <UserTableRow
              key={user.id}
              user={user}
              isLoading={isLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              onSendPassword={onSendPassword}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
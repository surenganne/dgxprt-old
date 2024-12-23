import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserActions } from "./UserActions";

interface UserTableRowProps {
  user: any;
  isLoading: boolean;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onSendPassword: (email: string) => void;
}

export const UserTableRow = ({
  user,
  isLoading,
  onEdit,
  onDelete,
  onSendPassword,
}: UserTableRowProps) => {
  return (
    <TableRow key={user.id} className="hover:bg-gray-50">
      <TableCell className="font-medium">{user.full_name || "N/A"}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.is_admin ? "Admin" : "User"}</TableCell>
      <TableCell>
        <Badge
          variant={user.status === "active" ? "default" : "secondary"}
          className={
            user.status === "active"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {user.status === "active" ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600">
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <UserActions
          user={user}
          isLoading={isLoading}
          onEdit={() => onEdit(user)}
          onDelete={() => onDelete(user)}
          onSendPassword={() => onSendPassword(user.email)}
        />
      </TableCell>
    </TableRow>
  );
};
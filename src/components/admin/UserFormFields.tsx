import { UserFormData } from "@/types/user";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BasicUserFields } from "./user-form/BasicUserFields";
import { UserRoleFields } from "./user-form/UserRoleFields";
import { NotificationPreferences } from "./user-form/NotificationPreferences";
import { LocationAssignments } from "./user-form/LocationAssignments";

interface UserFormFieldsProps {
  formData: UserFormData;
  setFormData: (data: UserFormData) => void;
  loading: boolean;
  isEdit: boolean;
}

export const UserFormFields = ({
  formData,
  setFormData,
  loading,
  isEdit,
}: UserFormFieldsProps) => {
  const session = useSession();

  const { data: currentUserProfile } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("is_owner, is_admin")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  return (
    <>
      <BasicUserFields
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        isEdit={isEdit}
      />
      
      {(currentUserProfile?.is_owner || currentUserProfile?.is_admin) && (
        <>
          <UserRoleFields
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
          
          <NotificationPreferences
            formData={formData}
            setFormData={setFormData}
            loading={loading}
          />
        </>
      )}
      
      <LocationAssignments
        formData={formData}
        setFormData={setFormData}
        loading={loading}
      />
    </>
  );
};
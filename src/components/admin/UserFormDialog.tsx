import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: {
    id: string;
    email: string;
    full_name: string | null;
    is_admin: boolean | null;
  };
  onSuccess: () => void;
}

export const UserFormDialog = ({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || "",
    full_name: user?.full_name || "",
    is_admin: user?.is_admin || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update existing user
        const { error } = await supabase
          .from("profiles")
          .update({
            email: formData.email,
            full_name: formData.full_name,
            is_admin: formData.is_admin,
          })
          .eq("id", user.id);

        if (error) throw error;

        toast({
          title: "User updated successfully",
          description: "The user's information has been updated.",
        });
      } else {
        // First check if user exists in profiles table
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", formData.email)
          .single();

        if (existingProfile) {
          // Update existing profile
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              full_name: formData.full_name,
              is_admin: formData.is_admin,
            })
            .eq("id", existingProfile.id);

          if (updateError) throw updateError;

          toast({
            title: "User updated successfully",
            description: "The existing user's information has been updated.",
          });
        } else {
          // Create new user
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: formData.email,
            password: Math.random().toString(36).slice(-8), // Generate random password
            options: {
              data: {
                full_name: formData.full_name,
              },
            },
          });

          if (authError) {
            if (authError.message === "User already registered") {
              // If user exists in auth but not in profiles, create a new profile
              const { data: signInData } = await supabase.auth.signInWithOtp({
                email: formData.email,
              });

              if (signInData) {
                toast({
                  title: "Magic link sent",
                  description: "A login link has been sent to the user's email.",
                });
              }
            } else {
              throw authError;
            }
          } else if (authData?.user) {
            const { error: profileError } = await supabase
              .from("profiles")
              .update({
                is_admin: formData.is_admin,
              })
              .eq("id", authData.user.id);

            if (profileError) throw profileError;

            toast({
              title: "User created successfully",
              description: "An email has been sent to the user with login instructions.",
            });
          }
        }
      }

      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: user ? "Error updating user" : "Error creating user",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{user ? "Edit User" : "Add New User"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              disabled={loading || !!user}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, full_name: e.target.value }))
              }
              required
              disabled={loading}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="is_admin"
              checked={formData.is_admin}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_admin: checked }))
              }
              disabled={loading}
            />
            <Label htmlFor="is_admin">Admin User</Label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : user ? "Update User" : "Create User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
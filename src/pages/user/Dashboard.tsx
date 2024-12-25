import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { toast } from "sonner";
import { UserLayout } from "@/components/user/UserLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Beaker, FileText, AlertTriangle } from "lucide-react";

const UserDashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("status")
          .eq("id", session.user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("Error checking access");
          navigate("/auth");
          return;
        }

        if (profile?.status !== "active") {
          toast.error("Your account is not active");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error in access check:", error);
        toast.error("Error checking access");
        navigate("/auth");
      }
    };

    checkAccess();
  }, [session, navigate, supabase]);

  if (!session) {
    return null;
  }

  return (
    <UserLayout>
      <h2 className="text-2xl font-semibold mb-6">Welcome to DGXPRT</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Beaker className="h-5 w-5 text-primary-purple" />
              Chemical Register
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              View and manage your chemical inventory
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
              onClick={() => navigate("/user/chemicals")}
            >
              View Register
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-purple" />
              SDS Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access safety data sheets for your chemicals
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
              onClick={() => navigate("/user/sds")}
            >
              View Documents
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary-purple" />
              Risk Assessments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Manage and review chemical risk assessments
            </p>
            <Button 
              className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
              onClick={() => navigate("/user/risk-assessments")}
            >
              View Assessments
            </Button>
          </CardContent>
        </Card>
      </div>
    </UserLayout>
  );
}

export default UserDashboard;
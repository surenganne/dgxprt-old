import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { UserDashboardLayout } from "@/components/user/UserDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!session?.user) {
          navigate("/auth");
          return;
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin, has_reset_password")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          return;
        }

        if (!profile?.has_reset_password) {
          navigate("/reset-password", { replace: true });
          return;
        }

        if (profile?.is_admin) {
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        toast.error("Error checking authentication");
      }
    };

    checkAuth();
  }, [session, navigate, supabase]);

  return (
    <UserDashboardLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to DGXPRT</h1>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Chemical Register Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Chemical Register</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                View and manage your chemical inventory
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
                onClick={() => navigate("/chemicals")}
              >
                View Register
              </Button>
            </CardContent>
          </Card>

          {/* SDS Documents Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>SDS Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access safety data sheets for your chemicals
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
                onClick={() => navigate("/sds")}
              >
                View Documents
              </Button>
            </CardContent>
          </Card>

          {/* Risk Assessments Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Risk Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage and review chemical risk assessments
              </p>
              <Button 
                className="w-full bg-gradient-to-r from-primary-purple to-primary-blue text-white"
                onClick={() => navigate("/risk-assessments")}
              >
                View Assessments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </UserDashboardLayout>
  );
};

export default Dashboard;
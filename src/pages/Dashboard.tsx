import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Dashboard = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          navigate('/auth');
          return;
        }
        
        if (!session) {
          console.log("No session found, redirecting to auth");
          navigate('/auth');
          return;
        }

        // Check if user exists in profiles and their status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('is_admin, status')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profile) {
          console.error("Error fetching profile:", profileError);
          toast.error("Error verifying user access");
          navigate('/auth');
          return;
        }

        // Redirect admin users to admin dashboard
        if (profile.is_admin) {
          navigate('/admin/dashboard');
          return;
        }

        // Check if user is active
        if (profile.status !== 'active') {
          toast.error("Your account is not active");
          await supabase.auth.signOut();
          navigate('/auth');
          return;
        }
      } catch (error) {
        console.error("Error in auth check:", error);
        navigate('/auth');
      }
    };

    checkAuth();
  }, [navigate, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/auth");
      toast.success("Signed out successfully");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  // Show loading state while checking auth
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">DGXPRT Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {session?.user?.email}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
        {/* User dashboard content will go here */}
      </main>
    </div>
  );
};

export default Dashboard;
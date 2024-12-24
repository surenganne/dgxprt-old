import { useEffect, useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingSolutions } from "@/components/landing/LandingSolutions";
import { LandingCompliance } from "@/components/landing/LandingCompliance";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";
import { toast } from "sonner";

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        // If user is authenticated, redirect based on role
        if (session?.user) {
          console.log("[Index] User authenticated, fetching profile");
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileError) {
            console.error("[Index] Error fetching profile:", profileError);
            toast.error("Error checking user access");
            return;
          }

          console.log("[Index] Profile fetched:", profile);
          if (profile?.is_admin) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("[Index] Error in auth change handler:", error);
        toast.error("Error checking authentication status");
        setIsLoading(false);
      }
    };

    handleAuthChange();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleAuthChange();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, supabase.auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-purple mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If not authenticated, show landing page
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <LandingHero />
        <LandingFeatures />
        <LandingSolutions />
        <LandingCompliance />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
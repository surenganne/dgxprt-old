import { useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingSolutions } from "@/components/landing/LandingSolutions";
import { LandingCompliance } from "@/components/landing/LandingCompliance";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

const Index = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthChange = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // If user is authenticated, redirect based on role
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();

        if (profile?.is_admin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    };

    // Check auth state on mount
    handleAuthChange();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        handleAuthChange();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

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
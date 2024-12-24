import { supabase } from "@/integrations/supabase/client";

export const generateMagicLink = async (email: string) => {
  console.log("[userMagicLinkService] Generating magic link for:", email);
  
  try {
    const { data, error } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (error) throw error;

    // Construct a simplified magic link URL that works with our auth flow
    const magicLink = `${window.location.origin}/auth?email=${encodeURIComponent(email)}&temp=true`;
    return magicLink;
  } catch (error) {
    console.error("[userMagicLinkService] Error:", error);
    throw error;
  }
};
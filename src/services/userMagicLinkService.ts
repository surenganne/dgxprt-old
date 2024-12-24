import { supabase } from "@/integrations/supabase/client";

export const generateMagicLink = async (email: string) => {
  console.log("[userMagicLinkService] Generating magic link for:", email);
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-magic-link', {
      body: { email }
    });

    if (error) throw error;

    return data.magicLink;
  } catch (error) {
    console.error("[userMagicLinkService] Error:", error);
    throw error;
  }
};
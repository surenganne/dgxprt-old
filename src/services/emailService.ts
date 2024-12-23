import { supabase } from "@/integrations/supabase/client";

export const sendWelcomeEmail = async (email: string, password: string) => {
  const loginLink = `${window.location.origin}/auth`;

  try {
    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        to: email,
        password,
        loginLink,
      },
    });

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
import { supabase } from "@/integrations/supabase/client";

export const sendWelcomeEmail = async (email: string, password: string) => {
  console.log('Attempting to send welcome email to:', email);
  const loginLink = `${window.location.origin}/auth`;

  try {
    const { error } = await supabase.functions.invoke('send-welcome-email', {
      body: {
        to: email,
        password,
        loginLink,
      },
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
    console.log('Welcome email sent successfully');
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    throw error;
  }
};
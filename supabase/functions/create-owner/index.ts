import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Create the owner user
    const { data: userData, error: createUserError } = await supabaseClient.auth.admin.createUser({
      email: 'owner@dgxprt.ai',
      password: 'DGxprt2024!@#',
      email_confirm: true,
      user_metadata: {
        full_name: 'System Owner'
      }
    })

    if (createUserError) {
      throw createUserError
    }

    // Update the user's profile to be owner and admin
    if (userData.user) {
      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({
          is_owner: true,
          is_admin: true,
          status: 'active',
          has_reset_password: true
        })
        .eq('id', userData.user.id)

      if (updateError) {
        throw updateError
      }
    }

    return new Response(
      JSON.stringify({ message: 'Owner user created successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
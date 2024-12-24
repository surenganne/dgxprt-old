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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()
    console.log("[delete-user] Attempting to delete user:", userId);

    // First verify that the requesting user is an admin
    const {
      data: { user: requestingUser },
      error: authError,
    } = await supabase.auth.getUser(req.headers.get('Authorization')?.split(' ')[1] ?? '')
    
    if (authError) {
      console.error("[delete-user] Auth error:", authError);
      throw authError;
    }

    // Get the requesting user's profile
    const { data: requestingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin, is_owner')
      .eq('id', requestingUser?.id)
      .single()

    if (profileError) {
      console.error("[delete-user] Error fetching requesting user profile:", profileError);
      throw profileError;
    }

    if (!requestingProfile?.is_admin && !requestingProfile?.is_owner) {
      console.error("[delete-user] Unauthorized: User is not an admin or owner");
      throw new Error('Unauthorized: Only admins can delete users')
    }

    // Get the profile of the user to be deleted
    const { data: targetProfile, error: targetProfileError } = await supabase
      .from('profiles')
      .select('is_admin, is_owner, email')
      .eq('id', userId)
      .single()

    if (targetProfileError) {
      console.error("[delete-user] Error fetching target user profile:", targetProfileError);
      throw new Error('User profile not found')
    }

    // Check if trying to delete an owner
    if (targetProfile.is_owner) {
      console.error("[delete-user] Cannot delete owner account");
      throw new Error('Cannot delete owner account')
    }

    // Check if non-owner admin trying to delete another admin
    if (targetProfile.is_admin && !requestingProfile.is_owner) {
      console.error("[delete-user] Non-owner admin attempting to delete admin account");
      throw new Error('Only owners can delete admin accounts')
    }

    // Check if user exists in auth.users and delete if they do
    const { data: authUser, error: authUserError } = await supabase.auth.admin.getUserById(userId)
    if (!authUserError && authUser?.user) {
      console.log("[delete-user] User found in auth.users, deleting...");
      const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId)
      if (deleteAuthError) {
        console.error("[delete-user] Error deleting from auth.users:", deleteAuthError);
        // Continue with profile deletion even if auth deletion fails
        console.warn("[delete-user] Continuing with profile deletion despite auth.users deletion failure");
      }
    } else {
      console.log("[delete-user] User not found in auth.users, skipping auth deletion");
    }

    // Delete the profile (this will cascade to user_locations due to FK)
    console.log("[delete-user] Deleting profile for user:", userId);
    const { error: deleteProfileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (deleteProfileError) {
      console.error("[delete-user] Error deleting profile:", deleteProfileError);
      throw deleteProfileError;
    }

    console.log("[delete-user] User deleted successfully");
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error("[delete-user] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
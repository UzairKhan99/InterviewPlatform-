import supabase from "@/config/supabaseClient";

// ✅ Sign up a new user and create their profile
export async function signup({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Step 1: Create user account in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    // Handle auth errors
    if (authError) {
      console.error("Auth signup error:", authError);
      return { success: false, error: authError.message };
    }

    // Check if user was created successfully
    if (!authData.user) {
      return { success: false, error: "User already exists" };
    }

    // Step 2: Create user profile in the users table
    // This stores additional user data like name, preferences, etc.
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id, // Link to auth user
        name: name,
        email: email,
        password: password,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    // Handle profile creation errors
    if (profileError) {
      console.error("Profile creation error:", profileError);
      // If profile creation fails, we should clean up the auth user
      // Note: This requires admin privileges, so you might need to handle this differently
      return { success: false, error: profileError.message };
    }

    return { success: true, data: profileData };
  } catch (error: any) {
    console.error("Unexpected signup error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ✅ Sign in existing user
export async function signin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    // Sign in user with email and password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error:", error);
      // Only show invalid credentials or generic error
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }
      return { success: false, error: error.message };
    }

    // Get user profile data
    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
        // User is still signed in, just couldn't fetch profile
        return {
          success: true,
          data: data.user,
          warning: "Signed in but couldn't load profile",
        };
      }

      return { success: true, data: { ...data.user, profile: profileData } };
    }

    return { success: false, error: "Sign in failed" };
  } catch (error: any) {
    console.error("Unexpected signin error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

// ✅ Get current user session
export async function getCurrentUser() {
  try {
    // Get the current user from Supabase auth (based on cookie/session)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("Get user error:", error);
      return { success: false, error: error.message };
    }

    if (!user) {
      return { success: false, error: "No authenticated user found" };
    }

    // Fetch user's extended profile from 'users' table
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id) // assumes 'id' in 'users' matches auth user id
      .single();

    if (profileError) {
      console.warn("User found, but profile fetch failed:", profileError);
      return {
        success: true,
        data: user,
        warning: "User authenticated but profile not found",
      };
    }

    return {
      success: true,
      data: {
        ...user,
        profile: profileData,
      },
    };
  } catch (err: any) {
    console.error("Unexpected getCurrentUser error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}

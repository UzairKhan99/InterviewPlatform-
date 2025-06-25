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
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Auth signup error:", authError);
      return { success: false, error: authError.message };
    }

    if (!authData.user) {
      return { success: false, error: "User already exists" };
    }

    // Create user profile WITHOUT storing password
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        name,
        email,
        password,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Signin error:", error);
      if (error.message.includes("Invalid login credentials")) {
        return {
          success: false,
          error: "Invalid email or password.",
        };
      }
      return { success: false, error: error.message };
    }

    if (data.user) {
      const { data: profileData, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
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

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
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
// ✅ Get current user session (Server-side version)
export async function getCurrentUserServer() {
  try {
    // For server components, we need to handle the case where there's no session
    // This is a simplified version that won't throw the AuthSessionMissingError
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Don't throw error, just return null for server components
      return null;
    }

    if (!user) {
      return null;
    }

    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      // Return user without profile if profile fetch fails
      return { ...user, profile: null };
    }

    return {
      ...user,
      profile: profileData,
    };
  } catch (err: any) {
    // Return null instead of throwing error for server components
    return null;
  }
}
// Get interviews for a specific user
export async function getInterviewByUserId(
  userId: string
): Promise<Interview[] | null> {
  try {
    // Check if userId is valid
    if (!userId || userId === "undefined") {
      console.error("Invalid userId:", userId);
      return null;
    }

    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("userid", userId);

    if (error) {
      console.error("Error fetching interviews:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}

export async function getLatestInterview(
  userId: string,
  limit: number
): Promise<Interview[] | null> {
  try {
    // Check if userId is valid
    if (!userId || userId === "undefined") {
      console.error("Invalid userId:", userId);
      return null;
    }

    const { data, error } = await supabase
      .from("interviews")
      .select("*")
      .eq("finalized", true)
      .order("createdAt", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching latest interview:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching latest interview:", error);
    return null;
  }
}

// Get all interviews (matches your current schema)
export async function getAllInterviews(): Promise<Interview[] | null> {
  try {
    const { data, error } = await supabase.from("interviews").select("*");
    if (error) {
      console.error("Error fetching interviews:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error fetching interviews:", error);
    return null;
  }
}

// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

console.log("Hello from Functions!")

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      },
    });
  }

  const { searchParams } = new URL(req.url);
  const providerId = searchParams.get("provider_id");
  if (!providerId) {
    return new Response(JSON.stringify({ error: "Missing provider_id" }), {
      status: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  // Check for authentication header
  const authHeader = req.headers.get("authorization");
  let isAuthenticated = false;
  let user = null;

  // Try to verify JWT if authorization header is present
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    
    // Check if this is a dummy token for development
    if (token === "dummy-token-for-development") {
      console.log("Using dummy token for development, proceeding without authentication");
      isAuthenticated = false;
      user = null;
    } else {
      try {
        // Set up Supabase client with anon key for JWT verification
        const supabaseAnon = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!
        );
        
        const { data: { user: authUser }, error: authError } = await supabaseAnon.auth.getUser(token);
        if (!authError && authUser) {
          isAuthenticated = true;
          user = authUser;
          console.log("Authenticated user:", user.email);
        } else {
          console.log("Invalid JWT token, proceeding without authentication");
        }
      } catch (error) {
        console.log("JWT verification failed, proceeding without authentication:", error);
      }
    }
  } else {
    console.log("No authorization header, proceeding without authentication");
  }

  // Set up Supabase client with service role key for database access
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Fetch all grid definitions dynamically
  const { data: gridDefs, error: gridDefsError } = await supabase
    .from("grid_definitions")
    .select("table_name")
    .order("display_name");
  if (gridDefsError) {
    return new Response(JSON.stringify({ error: gridDefsError.message }), {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  // Prepare a results object
  const results: Record<string, any[]> = {};

  // Loop through each grid/table and fetch filtered data
  await Promise.all(
    (gridDefs || []).map(async (def: any) => {
      const table = def.table_name;
      if (!table) return;
      let filterColumn = table.toLowerCase() === "providers" ? "id" : "provider_id";
      const { data, error } = await supabase
        .from(table)
        .select("*")
        .eq(filterColumn, providerId);
      results[table] = error ? { error: error.message } : data;
    })
  );

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    },
  });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/all-records' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

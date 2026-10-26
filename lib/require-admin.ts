import { createClient } from "@supabase/supabase-js";
import { createAdminSupabase } from "@/lib/supabase-admin";

export async function requireAdmin(request: Request) {
  const authorization=request.headers.get("authorization") || "";
  const token=authorization.startsWith("Bearer ")?authorization.slice(7):"";
  if(!token) return {error:"Sign in with an organizer account.",status:401 as const};
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!anon) return {error:"Authentication is not configured.",status:503 as const};
  const authClient=createClient(url,anon,{auth:{persistSession:false,autoRefreshToken:false}});
  const {data,error}=await authClient.auth.getUser(token);
  if(error||!data.user) return {error:"Your session is invalid or expired.",status:401 as const};
  const admin=createAdminSupabase();
  const {data:row,error:adminError}=await admin.from("admin_users").select("user_id").eq("user_id",data.user.id).maybeSingle();
  if(adminError||!row) return {error:"This account is not authorized as an organizer.",status:403 as const};
  return {admin,userId:data.user.id};
}

import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { insertUserProfile } from "@/utils/supabase/supabaseutils";

export default async function AuthButton() {
  // const cookieStore = cookies();
  const supabase = await createClient();

  const {
    data,
    data: { user },
  } = await supabase.auth.getUser();
  //profiles表 插入用户信息
  await insertUserProfile(data, supabase);
  // console.log("1111 in AuthButton   user:", user);
  const signOut = async () => {
    "use server";

    // const cookieStore = cookies();
    const supabase = await createClient();
    await supabase.auth.signOut();

    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center gap-4">
      Hey, {user.email}!
      {/* <div className="vip-icon bg-yellow-400 text-white p-2 rounded-full shadow-lg animate-pulse">
        VIP
      </div> */}
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors shadow-sm font-medium">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-4 flex rounded-md no-underline bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm font-medium"
    >
      Login
    </Link>
  );
}

"use server";

import { getServerClient } from "@/lib/wix";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction() {
  try {
    const client = await getServerClient();

    if (!client.auth) {
      throw new Error("Authentication client is undefined.");
    }

    const oauthData = await client.auth.generateOAuthData(
      `${process.env.NEXT_PUBLIC_URL}/login-callback`,
      process.env.NEXT_PUBLIC_URL!
    );

    const cookieStore = await cookies();
    cookieStore.set("oauthRedirectData", JSON.stringify(oauthData));

    const { authUrl } = await client.auth.getAuthUrl(oauthData);

    console.log("Auth URL:", authUrl);

    revalidatePath("/");
    redirect(authUrl);
  } catch (error) {
    console.error("Login action error:", error);
    throw error;
  }
}

export async function logoutAction() {
  try {
    const client = await getServerClient();
    const cookieStore = await cookies();

    // 🔹 Delete session cookie before calling logout
    cookieStore.delete("session");

    try {
      const { logoutUrl } = await client.auth.logout(process.env.NEXT_PUBLIC_URL!);
      revalidatePath("/");
      redirect(logoutUrl);
    } catch (error) {
      console.warn("Session expired or invalid, redirecting to home:", error);
      revalidatePath("/");
      redirect("/");
    }
  } catch (error) {
    console.error("Logout action error:", error);
    throw error;
  }
}

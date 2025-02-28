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

// Update a review with new data
export async function updateReviewAction(reviewId: string, updatedData: { 
  rating: number;
  review: string;
  name: string;
}) {
  try {
    const client = await getServerClient();
    
    // First, get the existing review to preserve other fields
    const existingReview = await client.items.getDataItem(reviewId, {
      dataCollectionId: "Reviews"
    }).then(res => res.data);

    // Update the review with new data while preserving other fields
    await client.items.updateDataItem(reviewId, {
      dataCollectionId: "Reviews",
      dataItem: {
        data: { // Wrap merged data inside 'data' property
          ...existingReview, // Preserve existing fields
          ...updatedData // Merge new data
        }
      }
    });
    
    revalidatePath("/reviews");
  } catch (error) {
    console.error("Update review error:", error);
    throw error;
  }
}

"use server"

import { getServerClient } from "@/lib/wix"
import { cookies } from "next/headers"

export async function loginCallbackAction(url: string, redirectUri: string) {
  try {
    const client = await getServerClient()

    const returnedOAuthData = await client.auth.parseFromUrl(url)

    if (returnedOAuthData.error) {
      throw new Error(returnedOAuthData.errorDescription || "Unknown OAuth error")
    }

    const cookieStore = await cookies()
    const oauthDataStr = cookieStore.get("oauthRedirectData")?.value
    await cookieStore.delete("oauthRedirectData")

    if (!oauthDataStr) {
      throw new Error("No oauth data found")
    }

    const oauthData = JSON.parse(oauthDataStr)

    const memberTokens = await client.auth.getMemberTokens(returnedOAuthData.code, returnedOAuthData.state, oauthData)

    const serializableTokens = {
      accessToken: memberTokens.accessToken,
      refreshToken: memberTokens.refreshToken,
    }

    // Setting session cookie with expiration and security options
    await cookieStore.set("session", JSON.stringify(serializableTokens), {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return { success: true }
  } catch (error) {
    console.error("Login callback error:", error)
    throw error
  }
}

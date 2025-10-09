import { createClient, OAuthStrategy } from "@wix/sdk"
import { items } from "@wix/data"
import Cookies from "js-cookie"

// Session duration in days
const SESSION_DURATION = 360

export function getClient() {
  return createClient({
    modules: { items },
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID!,
      tokens: JSON.parse(Cookies.get("session") || "null"),
    }),
  })
}

export function setSessionCookie(tokens: any) {
  Cookies.set("session", JSON.stringify(tokens), {
    expires: SESSION_DURATION,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    domain: window.location.hostname, // Ensure cookies are accessible across subdomains
  })
}

export function clearSessionCookie() {
  Cookies.remove("session", { path: "/", domain: window.location.hostname })
}

export function getSessionTokens() {
  try {
    const session = Cookies.get("session")
    return session ? JSON.parse(session) : null
  } catch (error) {
    console.error("Failed to parse session:", error)
    return null
  }
}

export function convertWixImageToUrl(wixImageUrl: string) {
  return `https://static.wixstatic.com/media/${wixImageUrl.split("/")[3]}`
}

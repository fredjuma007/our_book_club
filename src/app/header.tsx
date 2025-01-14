import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { loginAction, logoutAction } from "./actions";
import { getMember, getServerClient } from "@/lib/wix";
import { ModeToggle } from "@/components/ModeToggle";

export async function Header() {
  const member = await getMember();
  const isLoggedIn = await getServerClient().auth.loggedIn();

  return (
    <div className="bg-gray-100 border-b py-3">
      <div className="container mx-auto flex justify-between items-center">
        <Button variant="link" asChild>
            <Link
            href="/"
            className="text-3xl flex items-center gap-2 font-[family-name:var(--font-dancing-script)] text-black"
            >
            <Image src="/logo.jpeg" width={60} height={60} alt="TheBookClub" />
            READING CIRCLE
            </Link>
        </Button>

        <ModeToggle />

        <div>
          <Button asChild variant="link">
            <Link className="text-black" href="/books">Browse Books</Link>
          </Button>

          {isLoggedIn && (
            <Button asChild variant="link">
              <Link href="/reviews">Reviews</Link>
            </Button>
          )}
        </div>

        <div>
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <p className="text-sm">Hello, {member?.nickname}</p>
              <form action={logoutAction}>
                <Button variant="outline">Logout</Button>
              </form>
            </div>
          ) : (
            <form action={loginAction}>
              <Button variant="outline">Login</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
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
    <div className="bg-gray-100 dark:bg-gray-900 border-b py-3">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8">
        {/* Logo and Title */}
        <Button variant="link" asChild>
          <Link
            href="/"
            className="text-3xl flex items-center gap-2 font-[family-name:var(--font-dancing-script)] text-gray-900 dark:text-gray-100"
          >
            <Image src="/logo.jpeg" width={60} height={60} alt="TheBookClub" />
            <span className="hidden md:inline text-3xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-teal-500 to-green-600 tracking-wider transform transition-all duration-300 ease-in-out hover:scale-105 md:hover:scale-110 hover:shadow-lg md:hover:shadow-xl">
  READING CIRCLE
</span>

          </Link>
        </Button>

        {/* Mode Toggle */}
        <ModeToggle />

        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Button asChild variant="link">
              <Link className=" text-green-600 dark:text-green-500" href="/books">
                Browse Books
              </Link>
            </Button>

            {isLoggedIn && (
              <Button asChild variant="link">
                <Link className=" text-green-600 dark:text-green-500" href="/reviews">
                  Reviews
                </Link>
              </Button>
            )}
          </div>

          {/* Authentication Button */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <p className="text-sm text-green-600 dark:text-green-500">
                  Hello, {member?.nickname}
                </p>
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
    </div>
  );
}

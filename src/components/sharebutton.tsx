'use client'
import { Share2, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const sharePage = async () => {
    const url = window.location.href;
    const title = document.title || "Check out this book!";

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback: Copy link to clipboard
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      onClick={sharePage}
      variant="outline"
      className="border-green-700 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-gray-700 font-serif group relative overflow-hidden"
    >
      <Share2 className="w-4 h-4 mr-2" />
      {copied ? "Link Copied!" : "Share"}
    </Button>
  );
}

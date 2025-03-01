"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { getClient } from "@/lib/wix-client";

const initialReview = {
  name: "",
  rating: 3.5,
  review: "",
};

export function PostReviewForm({ bookId, userName }: { bookId: string; userName: string }) {
  const [newReview, setNewReview] = useState({ ...initialReview, name: userName });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsLoading(true);

        getClient()
          .items.insertDataItem({
            dataCollectionId: "Reviews",
            dataItem: {
              data: {
                ...newReview,
                bookId: bookId,
              },
            },
          })
          .then(() => {
            setNewReview({ ...initialReview, name: userName });
            toast({
              title: "Your review has been posted",
              description: "Thank you for your feedback!",
            });
            window.location.reload();
          })
          .catch(() => {
            toast({
              title: "Error",
              description: "Something went wrong",
              variant: "destructive",
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      }}
      className="mt-6 space-y-4"
    >
      <Input
        placeholder="Your name"
        value={newReview.name}
        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
        required
      />
      <div className="flex items-center space-x-2">
        <label
          htmlFor="rating"
          className="text-sm font-medium text-green-600 dark:text-green-500"
        >
          Rating:
        </label>
        <Input
          id="rating"
          type="number"
          step="0.1" // Allow decimals
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({
              ...newReview,
              rating: e.target.value === "" ? 0 : parseFloat(e.target.value), // Ensure decimal support
            })
          }
          className="w-20"
          required
        />
      </div>
      <Textarea
        placeholder="Write your review here..."
        value={newReview.review}
        onChange={(e) => setNewReview({ ...newReview, review: e.target.value })}
      />
      <Button
        disabled={isLoading}
        type="submit"
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-500 dark:hover:bg-green-600"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Post Review
      </Button>
    </form>
  );
}

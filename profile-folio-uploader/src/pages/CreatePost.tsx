import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

const CreatePost = () => {
  const [postText, setPostText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, userName } = location.state || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!postText.trim()) {
      toast.error("Please enter some text for your post");
      return;
    }

    if (!userId) {
      toast.error(
        "User information is missing. Please create a profile first."
      );
      navigate("/");
      return;
    }

    setIsSubmitting(true);
    setPostId(null);

    try {
      const response = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: postText,
          userId: userId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPostId(data.post.id);
        toast.success("Post created successfully!");
        // Reset form
        setPostText("");
        // Back to home or stay on page
        toast("You can create another post or go back to the profile page");
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(
          errorData?.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to connect to the server. Is it running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-background relative overflow-hidden">
      {/* Multiple USA Flags Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="flags-container absolute inset-0">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className={`flag flag-${index + 1} animate-fly-across`}
              style={{
                animationDelay: `${index * 2}s`,
                top: `${10 + index * 10}%`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content with a semi-transparent background */}
      <div className="w-full max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-10 animate-slide-up backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg">
          <div className="inline-block px-3 py-1 mb-3 text-xs font-medium text-primary bg-primary/10 rounded-full">
            Create Post
          </div>
          <h1 className="text-4xl font-medium tracking-tight mb-2">
            What's on your mind?
          </h1>
          {userName && (
            <p className="text-muted-foreground max-w-md mx-auto">
              Posting as{" "}
              <span className="font-semibold text-primary">{userName}</span>
            </p>
          )}
        </header>

        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md mx-auto animate-fade-in"
          >
            <Card className="shadow-sm border-border/50 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-medium">
                  Create a Post
                </CardTitle>
                <CardDescription>
                  Share your thoughts with the world
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="post-text" className="text-sm font-medium">
                    Your Post
                  </Label>
                  <Textarea
                    id="post-text"
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                    className="min-h-32 resize-none"
                    placeholder="What's happening?"
                  />
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button
                  type="submit"
                  className="w-full sm:w-auto font-medium transition-all bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Post..." : "Create Post"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto font-medium"
                  onClick={() => navigate("/")}
                >
                  Back to Profile
                </Button>
              </CardFooter>
            </Card>
          </form>

          {postId && (
            <div className="mt-4 text-center p-4 bg-primary/10 rounded-lg animate-fade-in">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-primary font-medium">
                  Post ID: {postId}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    navigator.clipboard.writeText(postId || "");
                    toast.success("Post ID copied to clipboard!");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      ry="2"
                    ></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </Button>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-muted-foreground animate-fade-in backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-3 rounded-lg shadow-sm">
          <p>Your post will be sent to localhost:3000/post</p>
        </footer>
      </div>
    </div>
  );
};

export default CreatePost;

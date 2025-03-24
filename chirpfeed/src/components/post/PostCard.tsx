import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, MessageSquare, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PostCardProps {
  post: {
    id: string;
    text: string;
    imageUrl?: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string;
      username: string;
      profilePicture?: string | null;
      mimeType?: string | null;
    };
    _count?: {
      comments: number;
      likes: number;
    };
  };
  isComment?: boolean;
}

export function PostCard({ post, isComment = false }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count?.likes || 0);

  const handleLike = () => {
    // In a real app, this would call an API
    if (liked) {
      setLikesCount((prev) => prev - 1);
    } else {
      setLikesCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  return (
    <article
      className={cn(
        "border-b border-border p-4 hover:bg-muted/20 twitter-transition animate-fade-in",
        isComment && "pl-12 border-l"
      )}
    >
      <div className="flex space-x-3">
        <Link to={`/profile/${post.user.username}`} className="flex-shrink-0">
          {post.user.profilePicture ? (
            <img
              src={`data:${post.user.mimeType};base64,${post.user.profilePicture}`}
              alt={post.user.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <Link
              to={`/profile/${post.user.username}`}
              className="font-semibold hover:underline truncate"
            >
              {post.user.name}
            </Link>
            <Link
              to={`/profile/${post.user.username}`}
              className="text-muted-foreground hover:underline truncate"
            >
              @{post.user.username}
            </Link>
            <span className="text-muted-foreground text-sm">·</span>
            <span className="text-muted-foreground text-sm">
              {formattedDate}
            </span>
          </div>

          <div className="mt-1 text-foreground whitespace-pre-wrap break-words">
            {post.text}
          </div>

          {post.imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden border border-border">
              <img
                src={post.imageUrl}
                alt="Post"
                className="max-h-96 w-full object-contain bg-black"
                loading="lazy"
              />
            </div>
          )}

          {!isComment && (
            <div className="flex items-center mt-3 -ml-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full"
                asChild
              >
                <Link to={`/post/${post.id}`}>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>{post._count?.comments || 0}</span>
                </Link>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-full",
                  liked && "text-red-500"
                )}
                onClick={handleLike}
              >
                <Heart
                  className={cn("h-4 w-4 mr-1", liked && "fill-red-500")}
                />
                <span>{likesCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-twitter-blue hover:bg-twitter-blue/10 rounded-full"
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

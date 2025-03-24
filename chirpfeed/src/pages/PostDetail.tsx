import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PostCard } from "@/components/post/PostCard";
import { CommentForm } from "@/components/post/CommentForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPost } from "@/lib/api";

const PostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["post", postId, refreshKey],
    queryFn: () => {
      if (!postId) return Promise.reject(new Error("Post ID is required"));
      return getPost(postId);
    },
  });

  const handleCommentCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const post = data?.data?.post;
  const comments = post?.comments || [];

  return (
    <MainLayout>
      <div className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 border-b border-border">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="font-bold text-xl">Post</h1>
      </div>

      {isLoading ? (
        <div className="animate-pulse p-4 space-y-4">
          <div className="flex space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-64 w-full rounded-md" />
            </div>
          </div>
          <Skeleton className="h-12 w-full" />
          <div className="space-y-4 pt-4 border-t">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/5" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">Failed to load post</p>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="text-twitter-blue hover:underline"
          >
            Try again
          </button>
        </div>
      ) : post ? (
        <>
          <div className="border-b border-border">
            <PostCard post={post} />
            <CommentForm
              postId={post.id}
              onCommentCreated={handleCommentCreated}
            />
          </div>

          <div className="divide-y divide-border">
            {comments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No comments yet. Be the first to comment!
                </p>
              </div>
            ) : (
              comments.map((comment: any) => (
                <PostCard key={comment.id} post={comment} isComment />
              ))
            )}
          </div>
        </>
      ) : (
        <div className="p-8 text-center">
          <p className="text-xl font-medium mb-2">Post not found</p>
          <p className="text-muted-foreground">
            The post you're looking for might have been deleted.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default PostDetail;

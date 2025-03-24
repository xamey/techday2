
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { CreatePostForm } from "@/components/post/CreatePostForm";
import { PostCard } from "@/components/post/PostCard";
import { getHomeFeed } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

const Home = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['homeFeed', refreshKey],
    queryFn: getHomeFeed,
  });
  
  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  return (
    <MainLayout>
      <div className="border-b border-border">
        <h1 className="text-xl font-bold p-4">Home</h1>
      </div>
      
      <CreatePostForm onPostCreated={handlePostCreated} />
      
      {isLoading ? (
        <div className="animate-pulse space-y-6 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-24 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="p-8 text-center">
          <p className="text-destructive mb-4">Failed to load tweets</p>
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="text-twitter-blue hover:underline"
          >
            Try again
          </button>
        </div>
      ) : data?.data?.posts?.length === 0 ? (
        <div className="p-8 text-center border-b border-border">
          <p className="text-xl font-medium mb-2">Welcome to your timeline!</p>
          <p className="text-muted-foreground">
            This is where you'll see posts from people you follow.
            Start by following some users or creating your first post!
          </p>
        </div>
      ) : (
        <div>
          {data?.data?.posts?.map((post: any) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default Home;

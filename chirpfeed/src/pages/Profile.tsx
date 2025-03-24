
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostCard } from "@/components/post/PostCard";
import { getUserProfile, getUserPosts } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Mock the current user - would come from auth context in real app
  const currentUser = { username: "johndoe" };
  const isOwnProfile = username === currentUser.username;
  
  const { 
    data: profileData, 
    isLoading: profileLoading 
  } = useQuery({
    queryKey: ['profile', username, refreshKey],
    queryFn: () => getUserProfile(username || ''),
    enabled: !!username,
  });
  
  const { 
    data: postsData, 
    isLoading: postsLoading 
  } = useQuery({
    queryKey: ['userPosts', username, refreshKey],
    queryFn: () => getUserPosts(username || ''),
    enabled: !!username,
  });
  
  const profile = profileData?.data?.user;
  const posts = postsData?.data?.posts;
  
  return (
    <MainLayout>
      {profileLoading ? (
        <div className="animate-pulse">
          <div className="h-32 bg-muted w-full"></div>
          <div className="p-4">
            <div className="flex justify-between">
              <Skeleton className="h-32 w-32 rounded-full -mt-16 border-4 border-background" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-16 w-full" />
              <div className="flex space-x-4 mt-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </div>
      ) : profile ? (
        <>
          <ProfileHeader user={profile} isOwnProfile={isOwnProfile} />
          
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-transparent border-b rounded-none h-auto">
              <TabsTrigger 
                value="posts" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-twitter-blue rounded-none py-4 data-[state=active]:shadow-none"
              >
                Posts
              </TabsTrigger>
              <TabsTrigger 
                value="replies" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-twitter-blue rounded-none py-4 data-[state=active]:shadow-none"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger 
                value="media" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-twitter-blue rounded-none py-4 data-[state=active]:shadow-none"
              >
                Media
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-0">
              {postsLoading ? (
                <div className="animate-pulse space-y-6 p-4">
                  {[...Array(3)].map((_, i) => (
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
              ) : posts?.length === 0 ? (
                <div className="p-8 text-center border-b border-border">
                  <p className="text-xl font-medium mb-2">
                    {isOwnProfile ? "You haven't posted anything yet" : `${profile.name} hasn't posted anything yet`}
                  </p>
                  {isOwnProfile && (
                    <p className="text-muted-foreground">
                      When you post, it will show up here.
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  {posts?.map((post: any) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="replies" className="mt-0">
              <div className="p-8 text-center border-b border-border">
                <p className="text-muted-foreground">
                  No replies yet
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="media" className="mt-0">
              <div className="p-8 text-center border-b border-border">
                <p className="text-muted-foreground">
                  No media posts yet
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="p-8 text-center">
          <p className="text-xl font-medium mb-2">User not found</p>
          <p className="text-muted-foreground">
            The user you're looking for doesn't exist.
          </p>
        </div>
      )}
    </MainLayout>
  );
};

export default Profile;

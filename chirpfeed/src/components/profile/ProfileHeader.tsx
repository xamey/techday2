import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { followUser } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/components/ui/use-toast";

interface ProfileHeaderProps {
  user: {
    id: string;
    name: string;
    username: string;
    bio?: string | null;
    profilePicture?: string | null;
    mimeType?: string | null;
    createdAt: string;
    _count?: {
      followers: number;
      following: number;
      posts: number;
    };
    isFollowing?: boolean;
  };
  isOwnProfile?: boolean;
}

export function ProfileHeader({
  user,
  isOwnProfile = false,
}: ProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(
    user._count?.followers || 0
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      const response = await followUser(user.username);
      if (response.error) {
        throw new Error(response.error);
      }

      setIsFollowing(!isFollowing);
      setFollowersCount((prevCount) =>
        isFollowing ? prevCount - 1 : prevCount + 1
      );

      toast({
        title: isFollowing ? "Unfollowed" : "Followed",
        description: isFollowing
          ? `You no longer follow ${user.name}`
          : `You are now following ${user.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to follow user",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const joinedDate = formatDistanceToNow(new Date(user.createdAt), {
    addSuffix: true,
  });

  return (
    <div className="border-b border-border animate-fade-in">
      {/* Header with back button and user name */}
      <div className="flex items-center p-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <Link to="/" className="mr-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="font-bold text-xl">{user.name}</h1>
          <p className="text-sm text-muted-foreground">
            {user._count?.posts || 0} posts
          </p>
        </div>
      </div>

      {/* Cover photo (placeholder) */}
      <div className="h-32 bg-muted w-full"></div>

      {/* Profile picture and follow button */}
      <div className="px-4 pb-4 relative">
        <div className="flex justify-between items-start">
          <div className="relative -mt-16">
            {user.profilePicture ? (
              <img
                src={`data:${user.mimeType};base64,${user.profilePicture}`}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-background object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-background bg-muted flex items-center justify-center text-4xl text-muted-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {isOwnProfile ? (
            <Button variant="outline" className="rounded-full">
              Edit Profile
            </Button>
          ) : (
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="rounded-full"
              onClick={handleFollowClick}
              disabled={isLoading}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
          )}
        </div>

        {/* User info */}
        <div className="mt-4">
          <h2 className="font-bold text-xl">{user.name}</h2>
          <p className="text-muted-foreground">@{user.username}</p>

          {user.bio && <p className="mt-3 whitespace-pre-wrap">{user.bio}</p>}

          <div className="flex items-center mt-3 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Joined {joinedDate}</span>
          </div>

          <div className="flex mt-3 space-x-4">
            <Link
              to={`/profile/${user.username}/following`}
              className="text-sm hover:underline"
            >
              <span className="font-semibold text-foreground">
                {user._count?.following || 0}
              </span>
              <span className="text-muted-foreground"> Following</span>
            </Link>
            <Link
              to={`/profile/${user.username}/followers`}
              className="text-sm hover:underline"
            >
              <span className="font-semibold text-foreground">
                {followersCount}
              </span>
              <span className="text-muted-foreground"> Followers</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

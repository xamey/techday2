import { toast } from "@/components/ui/use-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper to handle API responses
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const errorText = await response.text();
    try {
      const errorJson = JSON.parse(errorText);
      return { error: errorJson.message || "An error occurred" };
    } catch {
      return { error: errorText || "An error occurred" };
    }
  }

  const data = await response.json();
  return { data };
}

// Create a post
export async function createPost(
  text: string,
  image?: { base64: string; mimeType: string }
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        text,
        userId: "1",
        ...(image && {
          image: image.base64,
          mimeType: image.mimeType,
        }),
      }),
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create post. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Create a comment
export async function createComment(
  postId: string,
  text: string,
  image?: { base64: string; mimeType: string }
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/post/${postId}/comment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        text,
        userId: "1",
        ...(image && { image: image.base64, mimeType: image.mimeType }),
      }),
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create comment. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Create a user
export async function createUser(
  name: string,
  username: string,
  bio: string,
  profilePicture?: { base64: string; mimeType: string }
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        username,
        bio,
        ...(profilePicture && {
          profilePicture: profilePicture.base64,
          mimeType: profilePicture.mimeType,
        }),
      }),
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to create user. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Follow a user
export async function followUser(username: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/follow/${username}?followerId=1`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to follow user. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Get user posts
export async function getUserPosts(
  username: string
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/posts/${username}`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch posts. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Get home feed
export async function getHomeFeed(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/feed?userId=1`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch feed. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Get user profile
export async function getUserProfile(
  username: string
): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/user/${username}`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch user profile. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

// Get post by ID
export async function getPost(id: string): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_URL}/post/${id}`, {
      method: "GET",
      credentials: "include",
    });

    return handleResponse(response);
  } catch (error) {
    toast({
      title: "Error",
      description: "Failed to fetch post. Please try again.",
      variant: "destructive",
    });
    return { error: "Network error" };
  }
}

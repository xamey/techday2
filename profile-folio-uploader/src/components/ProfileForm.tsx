import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import ImageUploader from "./ImageUploader";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ProfileFormData {
  name: string;
  username: string;
  bio: string;
  profilePicture: string;
  mimeType: string;
  superUser: boolean;
}

const ProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    username: "",
    bio: "",
    profilePicture: "",
    mimeType: "",
    superUser: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (base64: string, mimeType: string) => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: base64,
      mimeType: mimeType,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Profile created successfully!");

        // Get the user ID from the response
        const responseData = await response.json();
        const userId = responseData?.user?.id;

        if (userId) {
          // Navigate to the create post page with the user ID
          navigate("/create-post", {
            state: {
              userId,
              userName: formData.name,
            },
          });
        } else {
          toast.error("User ID not found in response. Please try again.");
        }
      } else {
        const errorData = await response.json().catch(() => null);
        toast.error(
          errorData?.message || "Something went wrong. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting profile:", error);
      toast.error("Failed to connect to the server. Is it running?");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto animate-fade-in"
    >
      <Card className="shadow-sm border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-medium">Create Profile</CardTitle>
          <CardDescription>
            Fill out your information and upload a profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center mb-2">
            <ImageUploader
              onImageChange={handleImageChange}
              value={
                formData.profilePicture
                  ? `data:${formData.mimeType};base64,${formData.profilePicture}`
                  : undefined
              }
            />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="h-10"
                placeholder="John Appleseed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="h-10"
                placeholder="johnappleseed"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="min-h-24 resize-none"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <Button
            type="submit"
            className={cn(
              "w-full font-medium transition-all",
              "bg-primary hover:bg-primary/90",
              isSubmitting && "opacity-70 cursor-not-allowed"
            )}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Profile..." : "Create Profile"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ProfileForm;

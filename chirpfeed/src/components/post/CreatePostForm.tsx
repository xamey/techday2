
import { useState, useRef } from "react";
import { Image as ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createPost } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface CreatePostFormProps {
  onPostCreated?: () => void;
}

export function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [image, setImage] = useState<{ preview: string; base64: string; mimeType: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const base64 = await convertToBase64(file);
      setImage({
        preview: URL.createObjectURL(file),
        base64,
        mimeType: file.type,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    }
  };
  
  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim() && !image) {
      toast({
        title: "Empty post",
        description: "Please enter some text or add an image",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      const imageData = image ? { base64: image.base64, mimeType: image.mimeType } : undefined;
      const response = await createPost(text, imageData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      setText("");
      setImage(null);
      toast({
        title: "Success",
        description: "Your post has been created",
      });
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create post",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64 = base64String.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border border-border rounded-xl bg-card animate-scale-in mb-4">
      <Textarea
        value={text}
        onChange={handleTextChange}
        placeholder="What's happening?"
        className="resize-none border-0 focus-visible:ring-0 text-lg p-0 h-24 bg-transparent"
      />
      
      {image && (
        <div className="relative mt-2 rounded-lg overflow-hidden">
          <img 
            src={image.preview} 
            alt="Selected" 
            className="max-h-96 w-full object-contain"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2 rounded-full opacity-80 hover:opacity-100"
            onClick={removeImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-border">
        <div className="flex items-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="text-twitter-blue"
            onClick={handleImageClick}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
        </div>
        
        <Button 
          type="submit" 
          className="rounded-full bg-twitter-blue hover:bg-twitter-blue/90 text-white btn-hover"
          disabled={isSubmitting || (!text.trim() && !image)}
        >
          {isSubmitting ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}

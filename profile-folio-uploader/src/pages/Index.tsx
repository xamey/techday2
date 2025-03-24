import React from "react";
import ProfileForm from "@/components/ProfileForm";

const Index = () => {
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
            ✨✨✨
          </div>
          <h1 className="text-4xl font-medium tracking-tight mb-2">
            Candidat as a Service (CaaS)
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Create your own presidential candidate profile in minutes, for free!
          </p>
        </header>

        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 p-6 rounded-lg shadow-lg">
          <ProfileForm />
        </div>
      </div>
    </div>
  );
};

export default Index;

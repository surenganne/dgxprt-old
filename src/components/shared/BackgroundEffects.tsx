export const BackgroundEffects = () => {
  return (
    <>
      {/* Gradient overlay with reduced opacity in dark mode */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/10 via-primary-blue/5 to-transparent dark:from-primary-purple/5 dark:via-primary-blue/2 dark:to-transparent -z-10" />
      
      {/* Grid pattern with better dark mode visibility */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />
      
      {/* Animated blobs with adjusted dark mode colors */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -left-4 top-10 h-72 w-72 rounded-full bg-primary-purple/10 dark:bg-primary-purple/5 mix-blend-multiply dark:mix-blend-soft-light blur-xl animate-blob" />
        <div className="absolute -right-4 top-10 h-72 w-72 rounded-full bg-primary-blue/10 dark:bg-primary-blue/5 mix-blend-multiply dark:mix-blend-soft-light blur-xl animate-blob animation-delay-2000" />
        <div className="absolute left-1/2 bottom-10 h-72 w-72 rounded-full bg-primary-purple/10 dark:bg-primary-purple/5 mix-blend-multiply dark:mix-blend-soft-light blur-xl animate-blob animation-delay-4000" />
      </div>
    </>
  );
};
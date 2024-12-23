export const BackgroundEffects = () => {
  return (
    <>
      {/* Gradient overlay with improved dark mode handling */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-purple/5 via-primary-blue/2 to-transparent dark:from-primary-purple/10 dark:via-primary-blue/5 dark:to-transparent transition-opacity duration-300 -z-10" />
      
      {/* Enhanced grid pattern with better visibility */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)] -z-10" />
      
      {/* Modern animated blobs with improved dark mode appearance */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div 
          className="absolute -left-4 top-20 h-[30rem] w-[30rem] rounded-full bg-primary-purple/10 dark:bg-primary-purple/20 mix-blend-multiply dark:mix-blend-plus-lighter blur-3xl animate-blob opacity-70 dark:opacity-50"
        />
        <div 
          className="absolute -right-4 top-20 h-[35rem] w-[35rem] rounded-full bg-primary-blue/10 dark:bg-primary-blue/20 mix-blend-multiply dark:mix-blend-plus-lighter blur-3xl animate-blob animation-delay-2000 opacity-70 dark:opacity-50"
        />
        <div 
          className="absolute left-1/2 bottom-20 h-[25rem] w-[25rem] rounded-full bg-primary-purple/10 dark:bg-primary-purple/20 mix-blend-multiply dark:mix-blend-plus-lighter blur-3xl animate-blob animation-delay-4000 opacity-70 dark:opacity-50"
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4xNSIvPjwvc3ZnPg==')]"
      />
    </>
  );
};
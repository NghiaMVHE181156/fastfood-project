// src/components/ui/loading.tsx
import clsx from "clsx";
import React from "react";

interface LoadingProps extends React.ComponentProps<"div"> {
  size?: number; // px
  text?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({ size = 40, className = "", text, ...rest }, ref) => (
    <div
      ref={ref}
      className={clsx(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
      {...rest}
    >
      {/* Multi-ring spinner */}
      <div className="relative" style={{ width: size, height: size }}>
        <span
          className="absolute inset-0 animate-spin rounded-full border-4 border-solid border-gray-300 border-t-blue-600 shadow-lg"
          style={{ width: size, height: size }}
        />
        <span
          className="absolute inset-2 animate-spin-slow rounded-full border-2 border-dashed border-blue-400 border-t-transparent"
          style={{ width: size - 12, height: size - 12 }}
        />
        <span className="absolute inset-1/4 w-1/2 h-1/2 bg-blue-500 rounded-full opacity-30 blur" />
      </div>
      {/* Text shimmer + bouncing dots */}
      {text && (
        <div className="flex items-center gap-1">
          <span className="animate-pulse bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 bg-clip-text text-transparent font-medium">
            {text}
          </span>
          <span className="flex">
            <span className="block w-2 h-2 mx-0.5 rounded-full bg-blue-400 animate-bounce [animation-delay:-0.2s]" />
            <span className="block w-2 h-2 mx-0.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0s]" />
            <span className="block w-2 h-2 mx-0.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
          </span>
        </div>
      )}
    </div>
  )
);
Loading.displayName = "Loading";

export default Loading;

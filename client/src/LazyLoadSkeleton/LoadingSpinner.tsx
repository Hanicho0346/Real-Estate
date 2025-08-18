interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  color = "green-500",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className={`flex justify-center items-center min-h-screen ${className}`}>
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 ${sizeClasses[size]} border-${color}`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
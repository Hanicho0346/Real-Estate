import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { ErrorFallback } from "../routes/ErrorPage";
import ProfilePage from "../routes/Profile/ProfilePage";
import ProfileSkeleton from "./profileSkeltons";

const ProfilePageWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => navigate("/")}
    >
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfilePage />
      </Suspense>
    </ErrorBoundary>
  );
};
export default ProfilePageWrapper;
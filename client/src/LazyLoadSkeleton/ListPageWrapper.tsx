import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LoadingSpinner from "./LoadingSpinner";
import ListPage from "../routes/ListPage/ListPage";
import { useNavigate } from "react-router-dom";
import { ErrorFallback } from "../routes/ErrorPage";

const ListPageWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => navigate("/")}
    >
      <Suspense fallback={<LoadingSpinner />}>
        <ListPage />
      </Suspense>
    </ErrorBoundary>
  );
};
export default ListPageWrapper;
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  return (
    <div>
      error
    </div>
  )
}

export default ErrorPage

export const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h2>
      <p className="text-gray-600 mb-4">{error.message}</p>
      <button
        onClick={() => {
          resetErrorBoundary();
          navigate("/");
        }}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go to Home
      </button>
    </div>
  );
};

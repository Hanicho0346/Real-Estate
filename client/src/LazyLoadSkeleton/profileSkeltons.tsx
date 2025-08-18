import React from "react";

interface ProfileSkeletonProps {
  className?: string;
}

const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ className = "" }) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-6 ${className}`}>
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 w-64 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-96 bg-gray-200 rounded"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info and Listings */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Information Card Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <div className="h-12 w-full sm:w-48 bg-gray-200 rounded-xl"></div>
                  <div className="h-12 w-full sm:w-48 bg-gray-200 rounded-xl"></div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-6 w-48 bg-gray-200 rounded"></div>
                    <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded-xl"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-12 bg-gray-100 rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Listings Section Skeleton */}
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="h-12 w-48 bg-gray-200 rounded-xl"></div>
              </div>

              <div>
                {/* Tab Navigation Skeleton */}
                <div className="flex border-b border-gray-200 mb-6">
                  <div className="h-10 w-32 bg-gray-200 mr-4"></div>
                  <div className="h-10 w-32 bg-gray-200"></div>
                </div>

                {/* Listings Grid Skeleton */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Messaging Skeleton */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-96">
              <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
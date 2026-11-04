import React from "react";

const ProfilePageShimmer: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <div className="h-8 w-40 mx-auto bg-[#4caf50]/30 rounded-lg shimmer"></div>
          <div className="h-3 w-56 mx-auto bg-gray-200 rounded mt-3 shimmer"></div>
        </div>

        <div className="space-y-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex justify-between border-b border-gray-200 pb-2"
            >
              <div className="h-4 w-24 bg-gray-200 rounded shimmer"></div>
              <div className="h-4 w-36 bg-gray-200 rounded shimmer"></div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="h-9 w-32 mx-auto rounded-lg bg-[#4caf50]/40 shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePageShimmer;

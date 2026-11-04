import React from "react";

const LoginShimmer: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#4caf50] to-[#3e8e41] p-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20 animate-pulse">
        <div className="space-y-3 text-center mb-6">
          <div className="mx-auto h-7 w-3/4 bg-white/20 rounded"></div>
          <div className="mx-auto h-4 w-1/2 bg-white/10 rounded"></div>
        </div>

        <div className="space-y-5">
          <div className="h-10 w-full bg-white/20 rounded-lg"></div>
          <div className="h-10 w-full bg-white/20 rounded-lg"></div>
          <div className="h-10 w-full bg-[#4caf50]/60 rounded-lg"></div>
          <div className="mx-auto mt-4 h-4 w-2/3 bg-white/10 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginShimmer;

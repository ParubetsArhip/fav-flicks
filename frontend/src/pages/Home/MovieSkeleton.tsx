import React from 'react';

const MovieSkeleton: React.FC = () => {
    return (
        <div className="bg-white/10 rounded-2xl shadow-lg overflow-hidden flex flex-col animate-pulse">
            <div className="w-full h-[400px] bg-gray-700/50"></div>
            <div className="p-4 flex flex-col gap-3 flex-1">
                <div className="h-6 w-3/4 bg-gray-600/50 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-600/50 rounded"></div>
                <div className="space-y-2 mt-2">
                    <div className="h-3 bg-gray-600/50 rounded w-full"></div>
                    <div className="h-3 bg-gray-600/50 rounded w-11/12"></div>
                    <div className="h-3 bg-gray-600/50 rounded w-10/12"></div>
                </div>
                <div className="h-4 w-1/4 bg-yellow-400/50 rounded mt-auto"></div>
            </div>
        </div>
    );
};

export default MovieSkeleton;



import React from "react";
import { Check, X } from "lucide-react";

const FriendRequestCard = ({ name, time, onAccept, onReject }) => {
  return (
    <div className="flex items-center justify-between bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-2xl p-2 shadow-md w-75">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="relative">
          <img
            src="https://ui-avatars.com/api/?name=Frank+Mil&background=random"
            alt={name}
            className="w-12 h-12 rounded-full border-2 border-purple-400"
          />
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-purple-800 rounded-full"></span>
        </div>

        <div>
          <p className="font-semibold text-white">{name}</p>
          <p className="text-sm text-gray-300">Would like to connect</p>
          <p className="text-xs text-gray-400">{time}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="p-2 bg-green-500 hover:bg-green-600 rounded-full shadow-md"
        >
          <Check className="w-4 h-4 text-white" />
        </button>
        <button
          onClick={onReject}
          className="p-2 bg-red-500 hover:bg-red-600 rounded-full shadow-md"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;

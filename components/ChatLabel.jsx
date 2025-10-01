import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const ChatLabel = ({ chat }) => {
  const { selectedChat, setSelectedChat, deleteChat, renameChat } = useAppContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newName, setNewName] = useState(chat?.name || "Untitled Chat");
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  // Early return if chat is invalid
  if (!chat || !chat._id) {
    return null;
  }

  const isSelected = selectedChat?._id === chat._id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
        setShowDeleteConfirm(false);
      }
    };

    if (openMenu || showDeleteConfirm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu, showDeleteConfirm]);

  // Focus input when renaming starts
  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);
  
  // Sync newName with chat.name when it changes
    // Sync newName with chat.name when it changes
    useEffect(() => {
      if (chat?.name) {
        setNewName(chat.name);
      }
    }, [chat?.name]);

  const handleChatClick = () => {
    if (!isRenaming && !showDeleteConfirm) {
      setSelectedChat(chat);
    }
  };

  const handleRename = async () => {
    if (!chat?._id) {
      toast.error("Invalid chat");
      setIsRenaming(false);
      return;
    }

    if (newName.trim() && newName !== chat.name) {
      const success = await renameChat(chat._id, newName.trim());
      if (success) {
        toast.success("Chat renamed successfully");
      }
    } else if (!newName.trim()) {
      toast.error("Chat name cannot be empty");
      setNewName(chat.name); // Reset to original name if empty
    } else {
      setNewName(chat.name); // Reset to original name if unchanged
    }
    setIsRenaming(false);
    setOpenMenu(false);
  };

  const handleCancelRename = () => {
    setNewName(chat.name);
    setIsRenaming(false);
  };

  const handleDelete = async () => {
    const success = await deleteChat(chat._id);
    if (success) {
      toast.success("Chat deleted successfully");
    }
    setShowDeleteConfirm(false);
    setOpenMenu(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      handleCancelRename();
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-2 text-white/80 hover:bg-white/10 rounded-lg text-sm group cursor-pointer transition-colors ${
        isSelected ? "bg-white/10" : ""
      }`}
      onClick={handleChatClick}
    >
      {isRenaming ? (
        <div className="flex items-center gap-2 flex-1" onClick={(e) => e.stopPropagation()}>
          <input
            ref={inputRef}
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-gray-700 border border-primary/50 rounded px-2 py-1 text-white text-sm outline-none focus:border-primary"
            placeholder="Enter chat name"
          />
          <button
            onClick={handleRename}
            className="p-1 hover:bg-green-600/20 rounded transition-colors"
            title="Save"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={handleCancelRename}
            className="p-1 hover:bg-red-600/20 rounded transition-colors"
            title="Cancel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      ) : (
        <>
          <p className="flex-1 truncate pr-2">{chat.name}</p>

          <div
            ref={menuRef}
            className="relative flex items-center justify-center h-6 w-6 aspect-square hover:bg-black/50 rounded-lg transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              className={`w-4 cursor-pointer ${openMenu ? "" : "hidden"} group-hover:block`}
              src={assets.three_dots}
              alt="Menu"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && !showDeleteConfirm && (
              <div className="absolute -right-2 top-8 bg-gray-800 rounded-lg w-36 shadow-xl border border-white/10 overflow-hidden z-50">
                <div
                  className="flex items-center gap-3 hover:bg-primary/20 px-3 py-2.5 cursor-pointer transition-colors"
                  onClick={() => {
                    setIsRenaming(true);
                    setOpenMenu(false);
                  }}
                >
                  <Image className="w-4" src={assets.pencil_icon} alt="Rename" />
                  <p className="text-sm">Rename</p>
                </div>
                <div
                  className="flex items-center gap-3 hover:bg-red-600/20 px-3 py-2.5 cursor-pointer transition-colors text-red-400"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setOpenMenu(false);
                  }}
                >
                  <Image className="w-4" src={assets.delete_icon} alt="Delete" />
                  <p className="text-sm">Delete</p>
                </div>
              </div>
            )}

            {showDeleteConfirm && (
              <div className="absolute -right-2 top-8 bg-gray-800 rounded-lg w-48 shadow-xl border border-red-500/30 p-3 z-50">
                <p className="text-xs text-white/90 mb-3">Delete this chat?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded transition-colors font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs py-1.5 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChatLabel;
import { assets } from "@/assets/assets";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";

const PromptBox = ({ setisLoading, isLoading }) => {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef(null);
  const { user, chats, setChats, selectedChat, setSelectedChat, createNewChat, refreshSelectedChat } = useAppContext();

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [prompt]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt(e);
    }
  };

  const sendPrompt = async (e) => {
    const promptCopy = prompt.trim();
    
    try {
      e.preventDefault();
      
      // Validation checks
      if (!user) return toast.error("Please login to send a prompt");
      if (isLoading) return toast.error("Please wait for the previous prompt to complete");
      if (!promptCopy) return toast.error("Please enter a message");
      
      setisLoading(true);
      setPrompt("");

      // Create a new chat if none exists
      let chatId = selectedChat?._id;
      let currentChat = selectedChat;
      
      if (!chatId) {
        try {
          const newChat = await createNewChat();
          if (!newChat || !newChat._id) {
            throw new Error("Failed to create a new chat");
          }
          setSelectedChat(newChat);
          chatId = newChat._id;
          currentChat = newChat;
          toast.success("New chat created");
        } catch (error) {
          console.error("Error creating new chat:", error);
          toast.error("Failed to create a new chat");
          setPrompt(promptCopy);
          setisLoading(false);
          return;
        }
      }

      try {
        // Optimistically update the UI with the user's message
        const userMessage = {
          role: "user",
          content: promptCopy,
          timestamp: Date.now(),
        };

        // Update the selected chat with the new message
        const updatedChat = {
          ...currentChat,
          messages: [...(currentChat.messages || []), userMessage]
        };
        setSelectedChat(updatedChat);

        // Add a temporary loading message
        const loadingMessage = {
          role: "assistant",
          content: "Thinking...",
          timestamp: Date.now(),
          loading: true
        };
        
        const updatedChatWithLoading = {
          ...updatedChat,
          messages: [...updatedChat.messages, loadingMessage]
        };
        setSelectedChat(updatedChatWithLoading);

        const { data } = await axios.post('/api/chat/ai', {
          chatId,
          prompt: promptCopy
        });

        if (data.success && data.data) {
          // Replace the loading message with the actual response
          const responseMessage = {
            role: "assistant",
            content: data.data.content || "I'm sorry, I couldn't generate a response.",
            timestamp: Date.now(),
            loading: false
          };
          
          const finalChat = {
            ...updatedChatWithLoading,
            messages: [
              ...updatedChat.messages, // This includes the user's message but not the loading message
              responseMessage
            ]
          };
          
          setSelectedChat(finalChat);
          
          // Also refresh from the server to ensure consistency
          await refreshSelectedChat();
        } else {
          throw new Error(data.message || "Failed to get a response from the AI");
        }
      } catch (apiError) {
        console.error("Error in API call:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Error sending prompt:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to send message");
      setPrompt(promptCopy);
    } finally {
      setisLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setPrompt(e.target.value);
  };

  const isPromptValid = prompt.trim().length > 0;

  return (
    <form
      onSubmit={sendPrompt}
      className={`w-full max-w-3xl bg-[#404045] rounded-3xl transition-all duration-300 ${
        isLoading ? 'opacity-75' : 'opacity-100'
      }`}
    >
      <div className="flex items-end gap-3 p-4">
        {/* Textarea container */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            className="w-full leading-6 text-white bg-transparent outline-none resize-none placeholder-white/60"
            style={{
              minHeight: '24px',
              maxHeight: '200px',
              overflowY: prompt.length > 100 ? 'auto' : 'hidden'
            }}
            placeholder="Message Patent Pilot"
            onChange={handleInputChange}
            value={prompt}
            disabled={isLoading}
            rows={1}
          />
          
          {/* Character count for long messages */}
          {prompt.length > 500 && (
            <div className="absolute right-0 text-xs -top-6 text-white/40">
              {prompt.length}/2000
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pb-1">
          {/* Attachment button */}
          <button
            type="button"
            className="p-1 transition-colors rounded-lg hover:bg-white/10"
            disabled={isLoading}
          >
            <Image 
              className="w-4 transition-opacity cursor-pointer opacity-60 hover:opacity-100" 
              src={assets.pin_icon} 
              alt="Attach file" 
            />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={!isPromptValid || isLoading}
            className={`${
              isPromptValid && !isLoading
                ? "bg-primary hover:bg-primary/80 cursor-pointer" 
                : "bg-[#71717a] cursor-not-allowed"
            } rounded-full p-2 transition-all duration-200 transform ${
              isPromptValid && !isLoading ? 'hover:scale-105' : ''
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white"></div>
            ) : (
              <Image
                className="w-3.5 aspect-square"
                src={isPromptValid ? assets.arrow_icon : assets.arrow_icon_dull}
                alt="Send message"
              />
            )}
          </button>
        </div>
      </div>

      {/* Hint text */}
      <div className="px-4 pb-3 text-xs text-center text-white/40">
        Press Enter to send, Shift + Enter for new line
      </div>
    </form>
  );
};

export default PromptBox;
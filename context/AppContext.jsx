"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
  return useContext(AppContext);
};

export const AppContextProvider = ({ children }) => {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState({
    messages: [],
    _id: null,
  });

  const createNewChat = async () => {
    try {
      if (!user) return null;

      const token = await getToken();
      const response = await axios.post('/api/chat/create', {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (response.data.success) {
        await fetchUsersChats();
        setSelectedChat(response.data.data);
        return response.data.data; 
      } else {
        toast.error(response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error creating new chat:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to create chat');
      return null;
    }
  };

  const fetchUsersChats = async () => {
    try {
      if (!user) return;

      const token = await getToken();
      const { data } = await axios.get('/api/chat/get', { 
        headers: { Authorization: `Bearer ${token}` } 
      });

      if (data.success) {
        const sortedChats = data.data.sort((a, b) => 
          new Date(b.updatedAt) - new Date(a.updatedAt)
        );
        
        setChats(sortedChats);

        if (sortedChats.length === 0) {
          await createNewChat();
        } else if (!selectedChat._id) {
          setSelectedChat(sortedChats[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      if (!user) return false;

      const token = await getToken();
      const response = await axios.post('/api/chat/delete', 
        { chatId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remove chat from local state
        const updatedChats = chats.filter(chat => chat._id !== chatId);
        setChats(updatedChats);

        // If deleted chat was selected, select another one
        if (selectedChat._id === chatId) {
          if (updatedChats.length > 0) {
            setSelectedChat(updatedChats[0]);
          } else {
            await createNewChat();
          }
        }

        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast.error(error.response?.data?.message || 'Failed to delete chat');
      return false;
    }
  };

  const renameChat = async (chatId, newName) => {
    try {
      if (!user) return false;

      const token = await getToken();
      const response = await axios.post('/api/chat/rename', 
        { chatId, name: newName }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Update chat in local state
        const updatedChats = chats.map(chat => 
          chat._id === chatId ? { ...chat, name: newName } : chat
        );
        setChats(updatedChats);

        // Update selected chat if it's the one being renamed
        if (selectedChat._id === chatId) {
          setSelectedChat({ ...selectedChat, name: newName });
        }

        return true;
      } else {
        toast.error(response.data.message);
        return false;
      }
    } catch (error) {
      console.error('Error renaming chat:', error);
      toast.error(error.response?.data?.message || 'Failed to rename chat');
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchUsersChats();
    }
  }, [user]);

  const refreshSelectedChat = async () => {
    if (selectedChat._id) {
      try {
        const token = await getToken();
        const { data } = await axios.get('/api/chat/get', { 
          headers: { Authorization: `Bearer ${token}` } 
        });

        if (data.success) {
          const updatedChat = data.data.find(chat => chat._id === selectedChat._id);
          if (updatedChat) {
            setSelectedChat(updatedChat);
          }
        }
      } catch (error) {
        console.error('Error refreshing selected chat:', error);
      }
    }
  };

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUsersChats,
    createNewChat,
    refreshSelectedChat,
    deleteChat,
    renameChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
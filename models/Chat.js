import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';

const COLLECTION_NAME = 'chats';

class Chat {
  static async create(data) {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        name: data.name,
        messages: data.messages || [],
        userId: data.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const newDoc = await getDoc(docRef);
      return {
        _id: docRef.id,
        ...newDoc.data()
      };
    } catch (error) {
      console.error('Create Chat Error:', error);
      throw error;
    }
  }

  static async findOne({ userId, _id }) {
    try {
      const chatDoc = await getDoc(doc(db, COLLECTION_NAME, _id));
      
      if (!chatDoc.exists() || chatDoc.data().userId !== userId) {
        return null;
      }
      
      return {
        _id: chatDoc.id,
        ...chatDoc.data(),
        save: async function() {
          const docRef = doc(db, COLLECTION_NAME, this._id);
          await updateDoc(docRef, {
            messages: this.messages,
            updatedAt: new Date().toISOString()
          });
          return this;
        }
      };
    } catch (error) {
      console.error('Find Chat Error:', error);
      throw error;
    }
  }

  static async findByUserId(userId) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(q);
      const chats = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
      
      // Sort in memory instead of using orderBy
      return chats.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    } catch (error) {
      console.error('Find Chats Error:', error);
      throw error;
    }
  }

  static async deleteChat(chatId, userId) {
    try {
      const chatDoc = await getDoc(doc(db, COLLECTION_NAME, chatId));
      
      if (!chatDoc.exists() || chatDoc.data().userId !== userId) {
        throw new Error('Chat not found or unauthorized');
      }
      
      await deleteDoc(doc(db, COLLECTION_NAME, chatId));
      return true;
    } catch (error) {
      console.error('Delete Chat Error:', error);
      throw error;
    }
  }

  static async renameChat(chatId, userId, newName) {
    try {
      const chatDoc = await getDoc(doc(db, COLLECTION_NAME, chatId));
      
      if (!chatDoc.exists() || chatDoc.data().userId !== userId) {
        throw new Error('Chat not found or unauthorized');
      }
      
      const docRef = doc(db, COLLECTION_NAME, chatId);
      await updateDoc(docRef, {
        name: newName,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Rename Chat Error:', error);
      throw error;
    }
  }
}

export default Chat;
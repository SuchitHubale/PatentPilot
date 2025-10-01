import { db } from '../config/firebase';
import { 
  collection, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

const COLLECTION_NAME = 'users';

class User {
  /**
   * Create or update a user in Firestore
   * @param {Object} data - User data { id, name, email, image }
   * @returns {Promise<Object>} Created/updated user object
   */
  static async create(data) {
    try {
      if (!data.id) {
        throw new Error('User ID is required');
      }

      const userRef = doc(db, COLLECTION_NAME, data.id);
      const userData = {
        id: data.id,
        name: data.name || '',
        email: data.email || '',
        image: data.image || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(userRef, userData, { merge: true });

      return {
        _id: data.id,
        ...userData
      };
    } catch (error) {
      console.error('Create User Error:', error);
      throw error;
    }
  }

  /**
   * Find a user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  static async findById(userId) {
    try {
      const userDoc = await getDoc(doc(db, COLLECTION_NAME, userId));
      
      if (!userDoc.exists()) {
        return null;
      }
      
      return {
        _id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Find User Error:', error);
      throw error;
    }
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  static async findByEmail(email) {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where("email", "==", email)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return null;
      }
      
      const userDoc = querySnapshot.docs[0];
      return {
        _id: userDoc.id,
        ...userDoc.data()
      };
    } catch (error) {
      console.error('Find User by Email Error:', error);
      throw error;
    }
  }

  /**
   * Find one user by query
   * @param {Object} queryParams - Query parameters { id, email }
   * @returns {Promise<Object|null>} User object or null
   */
  static async findOne(queryParams) {
    try {
      if (queryParams.id || queryParams._id) {
        return await this.findById(queryParams.id || queryParams._id);
      }
      
      if (queryParams.email) {
        return await this.findByEmail(queryParams.email);
      }
      
      return null;
    } catch (error) {
      console.error('Find One User Error:', error);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} Array of user objects
   */
  static async findAll() {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const users = querySnapshot.docs.map(doc => ({
        _id: doc.id,
        ...doc.data()
      }));
      
      return users;
    } catch (error) {
      console.error('Find All Users Error:', error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param {string} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async updateById(userId, updateData) {
    try {
      const userRef = doc(db, COLLECTION_NAME, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const updates = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      await updateDoc(userRef, updates);
      
      const updatedDoc = await getDoc(userRef);
      return {
        _id: updatedDoc.id,
        ...updatedDoc.data()
      };
    } catch (error) {
      console.error('Update User Error:', error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteById(userId) {
    try {
      const userRef = doc(db, COLLECTION_NAME, userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      await deleteDoc(userRef);
      return true;
    } catch (error) {
      console.error('Delete User Error:', error);
      throw error;
    }
  }
}

export default User;
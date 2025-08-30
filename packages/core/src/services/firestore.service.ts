import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

export class FirestoreService {
  /**
   * Add a new document to a collection
   */
  async addDoc(collectionName: string, data: any): Promise<string> {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  }

  /**
   * Get a document by ID
   */
  async getDoc(collectionName: string, docId: string): Promise<any | null> {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  }

  /**
   * Update a document
   */
  async updateDoc(collectionName: string, docId: string, data: any): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now()
    });
  }

  /**
   * Delete a document
   */
  async deleteDoc(collectionName: string, docId: string): Promise<void> {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  }

  /**
   * Get all documents from a collection
   */
  async getAllDocs(collectionName: string): Promise<any[]> {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Query documents with conditions
   */
  async queryDocs(collectionName: string, field: string, operator: any, value: any): Promise<any[]> {
    const q = query(collection(db, collectionName), where(field, operator, value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  }

  /**
   * Create a new document (alias for addDoc)
   */
  async create(collectionName: string, data: any): Promise<string> {
    return this.addDoc(collectionName, data);
  }

  /**
   * Get all documents (alias for getAllDocs)
   */
  async getAll(collectionName: string): Promise<any[]> {
    return this.getAllDocs(collectionName);
  }

  /**
   * Query with where condition (alias for queryDocs)
   */
  async queryWhere(collectionName: string, field: string, operator: any, value: any): Promise<any[]> {
    return this.queryDocs(collectionName, field, operator, value);
  }

  /**
   * Get document by ID (alias for getDoc)
   */
  async getById(collectionName: string, docId: string): Promise<any | null> {
    return this.getDoc(collectionName, docId);
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
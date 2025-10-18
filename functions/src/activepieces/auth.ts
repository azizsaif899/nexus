/**
 * Activepieces Authentication Integration
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

const ACTIVEPIECES_URL = process.env.ACTIVEPIECES_URL || 'http://localhost:3000';

interface ActivepiecesUser {
  id: string;
  email: string;
  token: string;
}

// إنشاء user في Activepieces
async function createActivepiecesUser(firebaseUid: string, email: string): Promise<ActivepiecesUser> {
  const password = `AP_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  try {
    const response = await axios.post(`${ACTIVEPIECES_URL}/api/v1/authentication/sign-up`, {
      email: `${firebaseUid}@nexus.local`,
      password,
      firstName: 'User',
      lastName: firebaseUid.substring(0, 8),
    });
    
    // حفظ في Firestore
    await admin.firestore().collection('activepieces_users').doc(firebaseUid).set({
      activepiecesId: response.data.id,
      email: response.data.email,
      token: response.data.token,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 409) {
      // User exists, try login
      const loginResponse = await axios.post(`${ACTIVEPIECES_URL}/api/v1/authentication/sign-in`, {
        email: `${firebaseUid}@nexus.local`,
        password,
      });
      return loginResponse.data;
    }
    throw error;
  }
}

// Cloud Function للتهيئة
export const initActivepieces = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Not authenticated');
  }
  
  const uid = context.auth.uid;
  const email = context.auth.token.email!;
  
  // تحقق من وجود المستخدم
  const userDoc = await admin.firestore().collection('activepieces_users').doc(uid).get();
  
  let apUser: ActivepiecesUser;
  if (!userDoc.exists) {
    apUser = await createActivepiecesUser(uid, email);
  } else {
    const userData = userDoc.data()!;
    apUser = {
      id: userData.activepiecesId,
      email: userData.email,
      token: userData.token
    };
  }
  
  return {
    token: apUser.token,
    userId: apUser.id,
    baseUrl: ACTIVEPIECES_URL
  };
});
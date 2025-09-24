/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { geminiChat } from './ai/gemini-chat';

admin.initializeApp();

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export const onUserCreate = functions.auth.user().onCreate((user) => {
  logger.info("A new user was created:", user.email);
  // You can add more logic here, like adding user data to Firestore
});

export const chatWithGemini = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
    }

    const message = data.message;
    if (!message) {
        throw new functions.https.HttpsError('invalid-argument', 'The function must be called with one arguments "message" containing the message to process.');
    }

    try {
        const response = await geminiChat(message);
        return { response };
    } catch (error) {
        logger.error("Error calling geminiChat", error);
        throw new functions.https.HttpsError('internal', 'Unable to process chat message');
    }
});


import * as functions from 'firebase-functions';
import { auth } from 'firebase-admin';

export const onUserCreate = functions.auth.user().onCreate((user: auth.UserRecord) => {
  console.log('A new user was created:', user.email);
  // You can add more logic here, like adding user data to Firestore
});

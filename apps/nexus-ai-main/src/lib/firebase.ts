// Firebase services
import { getFunctions } from 'firebase/functions';
import { firebaseApp } from './firebase-config';

export const functions = getFunctions(firebaseApp);
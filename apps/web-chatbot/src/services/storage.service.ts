
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

// TODO: Replace with your Firebase config from your FIR
const firebaseConfig = {
  apiKey: "AIzaSyDNigeaS3tyY809X9KCKMNRGB6LgkO6BmY",
  authDomain: "gen-lang-client-0147492600.firebaseapp.com",
  projectId: "gen-lang-client-0147492600",
  storageBucket: "gen-lang-client-0147492600.appspot.com",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export class StorageService {

  async uploadFile(file: File, path: string): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("Failed to upload file.");
    }
  }

}

export const storageService = new StorageService();

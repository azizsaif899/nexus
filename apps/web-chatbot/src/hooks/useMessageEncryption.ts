import { useState, useCallback, useEffect, useRef } from 'react';
import { useMessageStore } from '../store/message.store';

export interface EncryptionKey {
  id: string;
  key: CryptoKey;
  algorithm: string;
  createdAt: Date;
  sessionId: string;
}

export interface EncryptedMessage {
  encryptedContent: string;
  keyId: string;
  algorithm: string;
  iv: string; // Initialization vector for AES-GCM
}

export interface UseMessageEncryptionReturn {
  encryptMessage: (content: string, sessionId: string) => Promise<EncryptedMessage>;
  decryptMessage: (encryptedMessage: EncryptedMessage) => Promise<string>;
  generateKey: (sessionId: string) => Promise<string>; // Returns keyId
  hasKeyForSession: (sessionId: string) => boolean;
  clearKeys: (sessionId?: string) => void;
  isEncrypting: boolean;
  isDecrypting: boolean;
  encryptionError: string | null;
}

const ENCRYPTION_KEYS_KEY = 'nexus-encryption-keys';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;

export const useMessageEncryption = (): UseMessageEncryptionReturn => {
  const [keys, setKeys] = useState<Map<string, EncryptionKey>>(new Map());
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [encryptionError, setEncryptionError] = useState<string | null>(null);

  // Use ref to avoid re-initialization
  const initialized = useRef(false);

  // Load keys from IndexedDB or localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    loadKeysFromStorage();
  }, []);

  const loadKeysFromStorage = useCallback(async () => {
    try {
      // Try IndexedDB first, fallback to localStorage
      if (window.indexedDB) {
        await loadKeysFromIndexedDB();
      } else {
        loadKeysFromLocalStorage();
      }
    } catch (error) {
      console.error('Failed to load encryption keys:', error);
      // Fallback to localStorage
      loadKeysFromLocalStorage();
    }
  }, []);

  const loadKeysFromIndexedDB = useCallback(async () => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('NexusChat', 1);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        const transaction = db.transaction(['encryptionKeys'], 'readonly');
        const store = transaction.objectStore('encryptionKeys');
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          const storedKeys = getAllRequest.result;
          const keysMap = new Map<string, EncryptionKey>();

          storedKeys.forEach((storedKey: any) => {
            // Reconstruct CryptoKey from exported data
            crypto.subtle.importKey(
              'raw',
              new Uint8Array(storedKey.keyData),
              ALGORITHM,
              false,
              ['encrypt', 'decrypt']
            ).then(key => {
              keysMap.set(storedKey.sessionId, {
                id: storedKey.id,
                key,
                algorithm: storedKey.algorithm,
                createdAt: new Date(storedKey.createdAt),
                sessionId: storedKey.sessionId,
              });
            }).catch(error => {
              console.error('Failed to import key:', error);
            });
          });

          setKeys(keysMap);
          resolve();
        };

        getAllRequest.onerror = () => {
          reject(new Error('Failed to load keys from IndexedDB'));
        };
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('encryptionKeys')) {
          db.createObjectStore('encryptionKeys', { keyPath: 'sessionId' });
        }
      };
    });
  }, []);

  const loadKeysFromLocalStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem(ENCRYPTION_KEYS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Note: localStorage can't store CryptoKey objects, so we only store metadata
        // Keys will need to be regenerated or loaded from server
        console.warn('Encryption keys metadata loaded from localStorage, but keys need to be regenerated');
      }
    } catch (error) {
      console.error('Failed to load keys from localStorage:', error);
    }
  }, []);

  const saveKeyToStorage = useCallback(async (keyData: any) => {
    try {
      if (window.indexedDB) {
        await saveKeyToIndexedDB(keyData);
      } else {
        // Fallback: save metadata only (not secure for production)
        const metadata = {
          id: keyData.id,
          algorithm: keyData.algorithm,
          createdAt: keyData.createdAt,
          sessionId: keyData.sessionId,
        };
        const existing = JSON.parse(localStorage.getItem(ENCRYPTION_KEYS_KEY) || '{}');
        existing[keyData.sessionId] = metadata;
        localStorage.setItem(ENCRYPTION_KEYS_KEY, JSON.stringify(existing));
      }
    } catch (error) {
      console.error('Failed to save key:', error);
    }
  }, []);

  const saveKeyToIndexedDB = useCallback(async (keyData: any) => {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('NexusChat', 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['encryptionKeys'], 'readwrite');
        const store = transaction.objectStore('encryptionKeys');

        const putRequest = store.put(keyData);

        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(new Error('Failed to save key to IndexedDB'));
      };

      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
    });
  }, []);

  const generateKey = useCallback(async (sessionId: string): Promise<string> => {
    try {
      setEncryptionError(null);

      // Check if key already exists
      if (keys.has(sessionId)) {
        return keys.get(sessionId)!.id;
      }

      // Generate new key
      const key = await crypto.subtle.generateKey(
        {
          name: ALGORITHM,
          length: KEY_LENGTH,
        },
        true, // extractable
        ['encrypt', 'decrypt']
      );

      const keyId = `key-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      const encryptionKey: EncryptionKey = {
        id: keyId,
        key,
        algorithm: ALGORITHM,
        createdAt: new Date(),
        sessionId,
      };

      // Export key for storage
      const exportedKey = await crypto.subtle.exportKey('raw', key);
      const keyData = {
        id: keyId,
        keyData: Array.from(new Uint8Array(exportedKey)),
        algorithm: ALGORITHM,
        createdAt: encryptionKey.createdAt.toISOString(),
        sessionId,
      };

      // Save to storage
      await saveKeyToStorage(keyData);

      // Update state
      setKeys((prev: Map<string, EncryptionKey>) => new Map(prev).set(sessionId, encryptionKey));

      return keyId;
    } catch (error: any) {
      const errorMessage = `Failed to generate encryption key: ${error.message}`;
      setEncryptionError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [keys, saveKeyToStorage]);

  const encryptMessage = useCallback(async (content: string, sessionId: string): Promise<EncryptedMessage> => {
    try {
      setIsEncrypting(true);
      setEncryptionError(null);

      const encryptionKey = keys.get(sessionId);
      if (!encryptionKey) {
        throw new Error(`No encryption key found for session ${sessionId}`);
      }

      // Generate IV (Initialization Vector)
      const iv = crypto.getRandomValues(new Uint8Array(12));

      // Encrypt the content
      const encodedContent = new TextEncoder().encode(content);
      const encryptedBuffer = await crypto.subtle.encrypt(
        {
          name: ALGORITHM,
          iv: iv,
        },
        encryptionKey.key,
        encodedContent
      );

      // Convert to base64 for storage/transmission
      const encryptedContent = btoa(String.fromCharCode(...new Uint8Array(encryptedBuffer)));
      const ivBase64 = btoa(String.fromCharCode(...iv));

      return {
        encryptedContent,
        keyId: encryptionKey.id,
        algorithm: encryptionKey.algorithm,
        iv: ivBase64,
      };
    } catch (error: any) {
      const errorMessage = `Failed to encrypt message: ${error.message}`;
      setEncryptionError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsEncrypting(false);
    }
  }, [keys]);

  const decryptMessage = useCallback(async (encryptedMessage: EncryptedMessage): Promise<string> => {
    try {
      setIsDecrypting(true);
      setEncryptionError(null);

      // Find the key by keyId (we need to search through all keys)
      let decryptionKey: CryptoKey | null = null;
      for (const key of keys.values()) {
        if (key.id === encryptedMessage.keyId) {
          decryptionKey = key.key;
          break;
        }
      }

      if (!decryptionKey) {
        throw new Error(`No decryption key found for key ID ${encryptedMessage.keyId}`);
      }

      // Decode the encrypted content and IV
      const encryptedBuffer = Uint8Array.from(atob(encryptedMessage.encryptedContent), c => c.charCodeAt(0));
      const iv = Uint8Array.from(atob(encryptedMessage.iv), c => c.charCodeAt(0));

      // Decrypt the content
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: encryptedMessage.algorithm,
          iv: iv,
        },
        decryptionKey,
        encryptedBuffer
      );

      // Convert back to string
      const decryptedContent = new TextDecoder().decode(decryptedBuffer);

      return decryptedContent;
    } catch (error: any) {
      const errorMessage = `Failed to decrypt message: ${error.message}`;
      setEncryptionError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsDecrypting(false);
    }
  }, [keys]);

  const hasKeyForSession = useCallback((sessionId: string): boolean => {
    return keys.has(sessionId);
  }, [keys]);

  const clearKeys = useCallback((sessionId?: string) => {
    if (sessionId) {
      // Clear keys for specific session
      setKeys((prev: Map<string, EncryptionKey>) => {
        const newKeys = new Map(prev);
        newKeys.delete(sessionId);
        return newKeys;
      });

      // Remove from storage
      if (window.indexedDB) {
        const request = indexedDB.open('NexusChat', 1);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['encryptionKeys'], 'readwrite');
          const store = transaction.objectStore('encryptionKeys');
          store.delete(sessionId);
        };
      }
    } else {
      // Clear all keys
      setKeys(new Map());

      // Clear storage
      if (window.indexedDB) {
        const request = indexedDB.open('NexusChat', 1);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['encryptionKeys'], 'readwrite');
          const store = transaction.objectStore('encryptionKeys');
          const clearRequest = store.clear();
          clearRequest.onerror = () => console.error('Failed to clear keys from IndexedDB');
        };
      }
      localStorage.removeItem(ENCRYPTION_KEYS_KEY);
    }
  }, []);

  return {
    encryptMessage,
    decryptMessage,
    generateKey,
    hasKeyForSession,
    clearKeys,
    isEncrypting,
    isDecrypting,
    encryptionError,
  };
};
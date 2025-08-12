import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CredentialManager {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32;

  async encryptCredential(credential: string, masterKey: string): Promise<string> {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(masterKey, 'salt', this.keyLength);
    const cipher = crypto.createCipher(this.algorithm, key);
    
    let encrypted = cipher.update(credential, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  async decryptCredential(encryptedCredential: string, masterKey: string): Promise<string> {
    const [ivHex, encrypted] = encryptedCredential.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const key = crypto.scryptSync(masterKey, 'salt', this.keyLength);
    const decipher = crypto.createDecipher(this.algorithm, key);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async getSecureCredential(key: string): Promise<string> {
    const encryptedValue = process.env[`ENCRYPTED_${key}`];
    const masterKey = process.env.MASTER_KEY;
    
    if (!encryptedValue || !masterKey) {
      throw new Error(`Secure credential ${key} not found`);
    }
    
    return this.decryptCredential(encryptedValue, masterKey);
  }
}
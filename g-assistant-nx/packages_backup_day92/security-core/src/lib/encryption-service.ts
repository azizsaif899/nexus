import * as crypto from 'crypto';

export interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  tagLength: number;
}

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
  algorithm: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export class EncryptionService {
  private config: EncryptionConfig;
  private masterKey: Buffer;

  constructor(config?: Partial<EncryptionConfig>) {
    this.config = {
      algorithm: 'aes-256-gcm',
      keyLength: 32,
      ivLength: 16,
      tagLength: 16,
      ...config
    };
    
    this.masterKey = this.deriveMasterKey();
  }

  private deriveMasterKey(): Buffer {
    const password = process.env.MASTER_KEY || 'default-master-key';
    const salt = process.env.MASTER_SALT || 'default-salt';
    
    return crypto.pbkdf2Sync(password, salt, 100000, this.config.keyLength, 'sha256');
  }

  // Symmetric encryption
  encrypt(data: string, key?: Buffer): EncryptedData {
    const encryptionKey = key || this.masterKey;
    const iv = crypto.randomBytes(this.config.ivLength);
    
    const cipher = crypto.createCipher(this.config.algorithm, encryptionKey);
    cipher.setAAD(Buffer.from('azizsys-auth-data'));
    
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag();
    
    return {
      data: encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
      algorithm: this.config.algorithm
    };
  }

  decrypt(encryptedData: EncryptedData, key?: Buffer): string {
    const decryptionKey = key || this.masterKey;
    const iv = Buffer.from(encryptedData.iv, 'hex');
    const tag = Buffer.from(encryptedData.tag, 'hex');
    
    const decipher = crypto.createDecipher(encryptedData.algorithm, decryptionKey);
    decipher.setAAD(Buffer.from('azizsys-auth-data'));
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedData.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // File encryption
  encryptFile(filePath: string, outputPath: string, key?: Buffer): void {
    const encryptionKey = key || this.masterKey;
    const iv = crypto.randomBytes(this.config.ivLength);
    
    const cipher = crypto.createCipher(this.config.algorithm, encryptionKey);
    const fs = require('fs');
    
    const input = fs.createReadStream(filePath);
    const output = fs.createWriteStream(outputPath);
    
    // Write IV to the beginning of the file
    output.write(iv);
    
    input.pipe(cipher).pipe(output);
  }

  decryptFile(encryptedFilePath: string, outputPath: string, key?: Buffer): void {
    const decryptionKey = key || this.masterKey;
    const fs = require('fs');
    
    const input = fs.createReadStream(encryptedFilePath);
    const output = fs.createWriteStream(outputPath);
    
    // Read IV from the beginning of the file
    const iv = Buffer.alloc(this.config.ivLength);
    input.read(iv);
    
    const decipher = crypto.createDecipher(this.config.algorithm, decryptionKey);
    
    input.pipe(decipher).pipe(output);
  }

  // Asymmetric encryption (RSA)
  generateKeyPair(keySize = 2048): KeyPair {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: keySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    });

    return { publicKey, privateKey };
  }

  encryptWithPublicKey(data: string, publicKey: string): string {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
  }

  decryptWithPrivateKey(encryptedData: string, privateKey: string): string {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
  }

  // Digital signatures
  sign(data: string, privateKey: string): string {
    const sign = crypto.createSign('SHA256');
    sign.update(data);
    sign.end();
    
    const signature = sign.sign(privateKey);
    return signature.toString('base64');
  }

  verify(data: string, signature: string, publicKey: string): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(data);
    verify.end();
    
    return verify.verify(publicKey, signature, 'base64');
  }

  // Key derivation
  deriveKey(password: string, salt: string, iterations = 100000): Buffer {
    return crypto.pbkdf2Sync(password, salt, iterations, this.config.keyLength, 'sha256');
  }

  // Secure random generation
  generateSecureRandom(length: number): string {
    return crypto.randomBytes(length).toString('hex');
  }

  generateSalt(length = 16): string {
    return crypto.randomBytes(length).toString('hex');
  }

  // Hash functions
  hash(data: string, algorithm = 'sha256'): string {
    return crypto.createHash(algorithm).update(data).digest('hex');
  }

  hmac(data: string, key: string, algorithm = 'sha256'): string {
    return crypto.createHmac(algorithm, key).update(data).digest('hex');
  }

  // Key rotation
  rotateKey(): Buffer {
    this.masterKey = this.deriveMasterKey();
    return this.masterKey;
  }

  // Secure comparison
  secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }
    
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  }

  // Database field encryption
  encryptField(value: string, fieldName: string): EncryptedData {
    const fieldKey = this.deriveKey(this.masterKey.toString('hex'), fieldName);
    return this.encrypt(value, fieldKey);
  }

  decryptField(encryptedData: EncryptedData, fieldName: string): string {
    const fieldKey = this.deriveKey(this.masterKey.toString('hex'), fieldName);
    return this.decrypt(encryptedData, fieldKey);
  }
}
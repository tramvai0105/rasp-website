import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
import { ENCRYPTION_KEY as secretKey } from '$env/static/private';

// Функция для нормализации ключа до 32 байт
function normalizeKey(key) {
    if (!key) throw new Error('Key is required');
    
    // Если ключ уже 32 байта, возвращаем как есть
    if (Buffer.from(key).length === 32) return key;
    
    // Создаем хеш SHA-256 от ключа чтобы получить ровно 32 байта
    return crypto.createHash('sha256').update(key).digest();
}

export function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const key = normalizeKey(secretKey);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return {
        content: encrypted,
        iv: iv.toString('hex'),
        tag: authTag.toString('hex')
    };
}

export async function decrypt(encryptedData) {
    encryptedData = JSON.parse(encryptedData)
    try {
        const key = normalizeKey(secretKey);
        const decipher = crypto.createDecipheriv(
            algorithm, 
            key, 
            Buffer.from(encryptedData.iv, 'hex')
        );
        
        decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
        
        let decrypted = decipher.update(encryptedData.content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return JSON.parse(decrypted);
        
    } catch (error) {
        console.error(error);
        return null;
    }
}

// Упрощенная версия для работы с куками
export function createClientCookie(userData) {
    const data = JSON.stringify({
        userData,
        timestamp: Date.now(),
        valid: true
    });
    
    const encrypted = encrypt(data);
    return JSON.stringify(encrypted);
}

export function validateClientCookie(cookieValue) {
    if (!cookieValue) return null;
    
    try {
        const encryptedData = JSON.parse(cookieValue);
        return decrypt(encryptedData);
    } catch (error) {
        return null;
    }
}
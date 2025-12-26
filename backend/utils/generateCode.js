import crypto from 'crypto';
export default function generateCode(length) {
    const code =crypto.randomBytes(4).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 6);
    return code;
}
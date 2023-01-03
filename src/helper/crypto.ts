import fs from 'fs'
import crypto from 'crypto'

export function encryptText(plainText) {
  return crypto.publicEncrypt(
    {
      key: fs.readFileSync('public_key.pem', 'utf8'),
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    // We convert the data string to a buffer
    Buffer.from(plainText),
  )
}
export function decryptText(encryptedText) {
  return crypto.privateDecrypt(
    {
      key: fs.readFileSync('../../private_key.pem', 'utf8'),
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: 'sha256',
    },
    encryptedText,
  )
}

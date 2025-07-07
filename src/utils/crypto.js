import CryptoJS from 'crypto-js';

export function gerarHash(texto) {
  return CryptoJS.SHA256(texto).toString();
}

# Rui Criptosuite
It includes simetric keys, asymetric keys and signature schemes.

## Simetric keys schemes

### BigBlock algorithm
Algorithm based on rotation, split, reverse and combine bytes with a password expanded. It is only one large block. Use to encode text messages.

### Raes
Based on AES 128-bit but added one more pass with bit shuffle. Supports EBC and CBC to encode text messages

## Assymetric keys scheme
Based on Rabin cryptosystem. Using special padding on message to allow verification. Text messages are encrypted and shown as chinese characteres (cjk). Supports also generating your own keys (tools section).

## Signature scheme
Based on Rabin cryptosystem. It allows to sign text messages (since cjk encoded) or files (hashing with sha-512). Exports .sign files with signature and a random number. This random number checks the own .sign file integrity and the signatures checks the message (or file hash).

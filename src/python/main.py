from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.backends import default_backend
import urllib.request
import base64
from Crypto.Cipher import AES

app = Flask(__name__)
cors = CORS(app)

@app.route('/send', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['File']
        bytes = f.read() 
        sha256_hash = hashlib.sha256(bytes).hexdigest()
        return sha256_hash
    return "nice"

@app.route('/rsa', methods=['GET', 'POST'])
def generateRsa():
    if request.method == 'POST':
        bits = int(request.get_json()['bits'])
            # generate private/public key pair
        key = rsa.generate_private_key(backend=default_backend(), public_exponent=65537, \
            key_size=bits)

        # get public key in OpenSSH format
        public_key = key.public_key().public_bytes(serialization.Encoding.OpenSSH, \
            serialization.PublicFormat.OpenSSH)

        # get private key in PEM container format
        pem = key.private_bytes(encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.TraditionalOpenSSL,
            encryption_algorithm=serialization.NoEncryption())

        # decode to printable strings
        private_key_str = pem.decode('utf-8')
        public_key_str = public_key.decode('utf-8')
        private_key_str = private_key_str.replace('-----BEGIN RSA PRIVATE KEY-----', '')
        private_key_str = private_key_str.replace('-----END RSA PRIVATE KEY-----', '')
        public_key_str = public_key_str.replace('ssh-rsa', '')

        keys = {
            'privateKey':private_key_str,
            'publicKey':public_key_str.replace('ab', '')
        }
        return jsonify(keys)
    return "nice"

@app.route('/decode', methods=['GET', 'POST'])
def decode():
    if request.method == "POST":
        link = request.get_json()['link']
        password = bytes(request.get_json()['password'], "UTF-8")
        decoded = ''
        
        with urllib.request.urlopen(link) as f:
            html = f.read().decode('utf-8')
            file = open("data.txt", "w")
            file.write(html)
            file.close()
            data = open("data.txt", "r").read()
            data_decoded = base64.b64decode(data) 

            decipher = AES.new(password, AES.MODE_ECB)
            decoded = decipher.decrypt(data_decoded)   
            
        return decoded
    return "nice"

    

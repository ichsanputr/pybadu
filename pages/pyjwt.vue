<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="PyJWT"
        :theme="theme" 
        :files="files"
        :activeFileId="activeFileId"
        :code="currentFileContent"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        :assets="assets"
        :assetsUploading="assetsUploading"
        @update:code="updateCurrentFile"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample"
        @newFile="createNewFile"
        @selectFile="selectFile"
        @deleteFile="deleteFile"
        @renameFile="renameFile"
        @saveToStorage="saveToStorage"
        @uploadAssets="uploadAssets"
        @deleteAsset="deleteAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online PyJWT Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            PyJWT is a Python implementation of RFC 7519, providing a complete JSON Web Token (JWT) library for creating, 
            encoding, decoding, and verifying JWT tokens. As one of the most popular JWT libraries in Python, PyJWT enables 
            secure token-based authentication and authorization in web applications, APIs, and distributed systems. JWT tokens 
            are widely used for stateless authentication, allowing services to verify user identity and permissions without 
            maintaining server-side sessions.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>PyJWT</strong> with full support for JWT encoding, decoding, verification, and 
            custom claims, all powered by Pyodide WebAssembly technology. The platform supports all core PyJWT features 
            including encoding payloads into JWT tokens with various algorithms (HS256, RS256, etc.), decoding and verifying 
            tokens with secret keys or public keys, handling token expiration and custom claims, working with token headers, 
            and decoding tokens without verification for inspection. You can also upload and use files or folders directly 
            in your code for JWT processing workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential JWT operations including basic encoding and decoding, creating 
            tokens with expiration times, adding custom claims to tokens, verifying tokens with secret keys, handling expired 
            tokens, working with different algorithms, and decoding tokens without verification for inspection. You'll also learn 
            how to implement secure authentication flows, handle token refresh scenarios, and work with JWT tokens in real-world 
            web application and API development scenarios.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers implementing token-based authentication in APIs and web applications</li>
            <li>Backend developers building secure authentication and authorization systems</li>
            <li>API developers creating stateless authentication for microservices</li>
            <li>Security engineers working with JWT token validation and verification</li>
            <li>Full-stack developers implementing secure user sessions and access control</li>
            <li>Anyone needing to create, decode, or verify JSON Web Tokens in Python</li>
          </ul>
        </div>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'PyJWTPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online PyJWT Compiler',
  meta: [
    { name: 'description', content: 'Create, encode, decode, and verify JSON Web Tokens (JWT) with PyJWT in your browser. Token-based authentication powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'pyjwt, jwt, json web token, token authentication, jwt encode, jwt decode, jwt verify, online compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online PyJWT Compiler' },
    { property: 'og:description', content: 'Create, encode, decode, and verify JSON Web Tokens with PyJWT in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online PyJWT Compiler' },
    { name: 'twitter:description', content: 'Create, encode, decode, and verify JSON Web Tokens with PyJWT in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic JWT Encoding and Decoding",
    code: `# Basic JWT encoding and decoding
import jwt

# Secret key for signing
secret = "my-secret-key"

# Payload data
payload = {
    "user_id": 123,
    "username": "alice",
    "role": "admin"
}

# Encode the token
token = jwt.encode(payload, secret, algorithm="HS256")
print("Encoded JWT token:")
print(token)
print()

# Decode and verify the token
decoded = jwt.decode(token, secret, algorithms=["HS256"])
print("Decoded payload:")
print(decoded)`
  },
  {
    title: "JWT with Expiration",
    code: `# Create JWT with expiration time
import jwt
from datetime import datetime, timedelta

secret = "my-secret-key"

# Payload with expiration
payload = {
    "user_id": 123,
    "username": "alice",
    "exp": datetime.utcnow() + timedelta(hours=1)  # Expires in 1 hour
}

# Encode token
token = jwt.encode(payload, secret, algorithm="HS256")
print("Token with expiration:")
print(token)
print()

# Decode and verify
try:
    decoded = jwt.decode(token, secret, algorithms=["HS256"])
    print("Token is valid!")
    print("Decoded payload:")
    print(decoded)
except jwt.ExpiredSignatureError:
    print("Token has expired!")`
  },
  {
    title: "JWT with Custom Claims",
    code: `# JWT with custom claims
import jwt
from datetime import datetime, timedelta

secret = "my-secret-key"

# Payload with standard and custom claims
payload = {
    # Standard claims
    "sub": "1234567890",  # Subject (user ID)
    "iat": datetime.utcnow(),  # Issued at
    "exp": datetime.utcnow() + timedelta(days=7),  # Expiration
    
    # Custom claims
    "username": "alice",
    "email": "alice@example.com",
    "roles": ["admin", "user"],
    "permissions": ["read", "write", "delete"]
}

# Encode token
token = jwt.encode(payload, secret, algorithm="HS256")
print("Token with custom claims:")
print(token)
print()

# Decode and display
decoded = jwt.decode(token, secret, algorithms=["HS256"])
print("Decoded claims:")
for key, value in decoded.items():
    print(f"  {key}: {value}")`
  },
  {
    title: "Decode Without Verification",
    code: `# Decode JWT without verification (for inspection)
import jwt

# A JWT token (may be expired or invalid)
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjMsInVzZXJuYW1lIjoiYWxpY2UifQ.invalid_signature"

# Decode without verification (for inspection only)
decoded = jwt.decode(token, options={"verify_signature": False})
print("Decoded payload (without verification):")
print(decoded)
print()

# Get token header
header = jwt.get_unverified_header(token)
print("Token header:")
print(header)
print()

# WARNING: Never use decoded data from unverified tokens in production!
print("⚠️  WARNING: This is for inspection only. Always verify tokens in production!")`
  },
  {
    title: "Verify Token Expiration",
    code: `# Check if token is expired
import jwt
from datetime import datetime, timedelta

secret = "my-secret-key"

# Create a token that expires in 1 second
payload = {
    "user_id": 123,
    "exp": datetime.utcnow() + timedelta(seconds=1)
}

token = jwt.encode(payload, secret, algorithm="HS256")
print("Token created (expires in 1 second)")
print(f"Token: {token[:50]}...")
print()

# Try to decode immediately (should work)
try:
    decoded = jwt.decode(token, secret, algorithms=["HS256"])
    print("✓ Token is valid")
except jwt.ExpiredSignatureError:
    print("✗ Token has expired")

# Note: In real scenarios, you'd wait for expiration or use an expired token`
  },
  {
    title: "JWT with Different Algorithms",
    code: `# JWT with different signing algorithms
import jwt

secret = "my-secret-key"
payload = {"user_id": 123, "username": "alice"}

# HS256 (HMAC with SHA-256) - symmetric
token_hs256 = jwt.encode(payload, secret, algorithm="HS256")
print("HS256 token:")
print(token_hs256[:50] + "...")
print()

# HS384 (HMAC with SHA-384) - symmetric
token_hs384 = jwt.encode(payload, secret, algorithm="HS384")
print("HS384 token:")
print(token_hs384[:50] + "...")
print()

# HS512 (HMAC with SHA-512) - symmetric
token_hs512 = jwt.encode(payload, secret, algorithm="HS512")
print("HS512 token:")
print(token_hs512[:50] + "...")
print()

# Decode with algorithm specification
decoded = jwt.decode(token_hs256, secret, algorithms=["HS256"])
print("\\nDecoded payload:")
print(decoded)`
  },
  {
    title: "Complete Authentication Flow",
    code: `# Complete JWT authentication flow example
import jwt
from datetime import datetime, timedelta

secret = "my-secret-key"

# 1. User login - create token
def create_token(user_id, username):
    payload = {
        "user_id": user_id,
        "username": username,
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    return jwt.encode(payload, secret, algorithm="HS256")

# 2. Verify token
def verify_token(token):
    try:
        decoded = jwt.decode(token, secret, algorithms=["HS256"])
        return {"valid": True, "data": decoded}
    except jwt.ExpiredSignatureError:
        return {"valid": False, "error": "Token expired"}
    except jwt.InvalidTokenError:
        return {"valid": False, "error": "Invalid token"}

# Simulate login
print("1. User logs in:")
token = create_token(123, "alice")
print(f"   Token created: {token[:50]}...")
print()

# Simulate API request with token
print("2. API request with token:")
result = verify_token(token)
if result["valid"]:
    print(f"   ✓ Token valid for user: {result['data']['username']}")
    print(f"   User ID: {result['data']['user_id']}")
else:
    print(f"   ✗ {result['error']}")`
  }
]

const defaultCode = `# Basic JWT encoding and decoding
import jwt

# Secret key for signing
secret = "my-secret-key"

# Payload data
payload = {
    "user_id": 123,
    "username": "alice",
    "role": "admin"
}

# Encode the token
token = jwt.encode(payload, secret, algorithm="HS256")
print("Encoded JWT token:")
print(token)
print()

# Decode and verify the token
decoded = jwt.decode(token, secret, algorithms=["HS256"])
print("Decoded payload:")
print(decoded)`

// Use the shared composable
const {
  files,
  activeFileId,
  output,
  isLoading,
  pyodideReady,
  theme,
  loaderVisible,
  currentFileContent,
  monacoTheme,
  assets,
  assetsUploading,
  updateCurrentFile,
  createNewFile,
  selectFile,
  deleteFile,
  renameFile,
  saveToStorage,
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide,
  cleanupWorker,
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'pyjwt',
  defaultCode,
  examples,
  additionalPackages: ["ssl"],
  setupCode: `
import jwt
from datetime import datetime, timedelta
  `
})

onMounted(async () => {
  await initializePyodide()
})

onBeforeUnmount(() => {
  cleanupWorker()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


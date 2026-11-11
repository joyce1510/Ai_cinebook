const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('✨ CINEBOOK GEMINI API INTEGRATION & SECURITY SUITE ✨');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

let passed = 0;
let failed = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}`);
    failed++;
  }
}

// 1. Dependency & Capabilities Verification
console.log('\n📦 1. Dependencies & Metadata Capabilities');

it('@google/genai is installed and is version >= 2.29.1', () => {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  assert(pkg.dependencies['@google/genai'], '@google/genai must be in dependencies');
  const versionStr = pkg.dependencies['@google/genai'].replace(/[\^~]/g, '');
  const [major, minor] = versionStr.split('.').map(Number);
  // Major >= 3 or (major == 2 and minor >= 29)
  const isSatisfied = major > 2 || (major === 2 && minor >= 29);
  assert(isSatisfied, `@google/genai version must be >= 2.29.1 (current: ${pkg.dependencies['@google/genai']})`);
});

it('dotenv is installed in dependencies', () => {
  const pkgPath = path.resolve(__dirname, '../package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  assert(pkg.dependencies['dotenv'], 'dotenv must be in dependencies for loading .env.local');
});

it('metadata.json contains MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API', () => {
  const metaPath = path.resolve(__dirname, '../metadata.json');
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  assert(Array.isArray(meta.majorCapabilities), 'metadata.json must contain majorCapabilities array');
  assert(
    meta.majorCapabilities.includes('MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API'),
    'metadata.json must include MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API'
  );
});

// 2. Environment Security & Git Exclusion
console.log('\n🔒 2. Environment Security & Version Control Isolation');

it('.env.local and .env are strictly included in .gitignore', () => {
  const gitignorePath = path.resolve(__dirname, '../.gitignore');
  assert(fs.existsSync(gitignorePath), '.gitignore must exist');
  const content = fs.readFileSync(gitignorePath, 'utf-8');
  assert(content.includes('.env.local'), '.gitignore must explicitly include .env.local');
  assert(content.includes('.env'), '.gitignore must explicitly include .env');
});

it('.env.example exists with placeholder and no actual secret key', () => {
  const envExamplePath = path.resolve(__dirname, '../.env.example');
  assert(fs.existsSync(envExamplePath), '.env.example must exist');
  const content = fs.readFileSync(envExamplePath, 'utf-8');
  assert(content.includes('GEMINI_API_KEY='), '.env.example must specify GEMINI_API_KEY');
  assert(
    content.includes('your_gemini_api_key_here') || content.includes('placeholder'),
    '.env.example must use a safe placeholder value'
  );
  assert(!content.includes('AIzaSy'), '.env.example must NEVER contain an actual Google API key');
});

// 3. Client-Side Code Hygiene & Zero-Leak Guarantee
console.log('\n🛡️ 3. Client-Side Code Hygiene & Zero API Key Exposure');

it('src/ directory does NOT import @google/genai anywhere in client code', () => {
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        assert(
          !content.includes('@google/genai'),
          `Client file ${fullPath} must not import @google/genai directly`
        );
        assert(
          !content.includes('GoogleGenAI'),
          `Client file ${fullPath} must not instantiate GoogleGenAI in the browser`
        );
      }
    }
  }
  scanDir(path.resolve(__dirname, '../src'));
});

it('Client-side files do NOT reference process.env.GEMINI_API_KEY or expose keys', () => {
  function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        assert(
          !content.includes('process.env.GEMINI_API_KEY'),
          `Client file ${fullPath} must not reference process.env.GEMINI_API_KEY`
        );
        assert(
          !content.includes('AIzaSy'),
          `Client file ${fullPath} must not contain hardcoded Google API keys`
        );
      }
    }
  }
  scanDir(path.resolve(__dirname, '../src'));
});

it('vite.config.ts does NOT inject GEMINI_API_KEY into client defines', () => {
  const vitePath = path.resolve(__dirname, '../vite.config.ts');
  const content = fs.readFileSync(vitePath, 'utf-8');
  assert(!content.includes('GEMINI_API_KEY'), 'vite.config.ts must not define GEMINI_API_KEY');
});

// 4. Server-Side Integration & Graceful Fallback
console.log('\n⚙️ 4. Server-Side Gemini API Implementation & Resilient Fallback');

it('server.ts loads .env.local and .env via dotenv', () => {
  const serverPath = path.resolve(__dirname, '../server.ts');
  const content = fs.readFileSync(serverPath, 'utf-8');
  assert(content.includes("import dotenv from 'dotenv'"), 'server.ts must import dotenv');
  assert(content.includes('.env.local'), 'server.ts must configure .env.local loading');
});

it('server.ts initializes GoogleGenAI securely on the server with User-Agent header', () => {
  const serverPath = path.resolve(__dirname, '../server.ts');
  const content = fs.readFileSync(serverPath, 'utf-8');
  assert(content.includes("from '@google/genai'"), 'server.ts must import GoogleGenAI from @google/genai');
  assert(content.includes('process.env.GEMINI_API_KEY'), 'server.ts must access process.env.GEMINI_API_KEY');
  assert(content.includes("'aistudio-build'"), "server.ts must specify 'aistudio-build' User-Agent header");
  assert(content.includes("'gemini-3.8-flash'"), "server.ts must specify active model 'gemini-3.8-flash'");
});

it('server.ts provides GET /api/ai/status and POST /api/ai/chat endpoints', () => {
  const serverPath = path.resolve(__dirname, '../server.ts');
  const content = fs.readFileSync(serverPath, 'utf-8');
  assert(content.includes('/api/ai/status'), 'server.ts must provide /api/ai/status endpoint');
  assert(content.includes('/api/ai/chat'), 'server.ts must provide /api/ai/chat endpoint');
  assert(content.includes('/api/gemini/generate'), 'server.ts must provide /api/gemini/generate endpoint');
});

it('server.ts accesses response.text as a property (never response.text())', () => {
  const serverPath = path.resolve(__dirname, '../server.ts');
  const content = fs.readFileSync(serverPath, 'utf-8');
  assert(content.includes('response.text'), 'server.ts must extract response.text property');
  assert(!content.includes('response.text()'), 'server.ts must not call response.text() as a function');
});

it('aiAssistantService in frontend seamlessly proxies through /api/ai/chat with fallback', () => {
  const servicePath = path.resolve(__dirname, '../src/utils/aiAssistantService.ts');
  const content = fs.readFileSync(servicePath, 'utf-8');
  assert(content.includes('/api/ai/chat'), 'aiAssistantService must call /api/ai/chat proxy');
  assert(content.includes('data.fallback'), 'aiAssistantService must respect fallback signal');
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (failed > 0) {
  process.exit(1);
}

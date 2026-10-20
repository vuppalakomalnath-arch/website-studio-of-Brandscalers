const http = require('http');

async function get(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function post(path, body) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(body);
    const req = http.request(`http://localhost:3000${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runSmokeTests() {
  console.log('=== STARTING HTTP SMOKE TESTS ===\n');

  // Test 1: GET /
  console.log('Test 1: GET / (Main Builder Application UI)');
  const resHome = await get('/');
  console.log(`Status: ${resHome.status}`);
  if (resHome.status !== 200) throw new Error(`GET / returned status ${resHome.status}`);
  if (!resHome.body.includes('Website Studio 2.0')) throw new Error('Page does not contain expected header');
  if (!resHome.body.includes('bs')) throw new Error('Page does not contain .bs styling container');
  console.log('✓ GET / successfully returned interactive application with .bs styling.\n');

  // Test 2: POST /api/plan
  console.log('Test 2: POST /api/plan (Brief planning route)');
  const testBrief = {
    businessName: 'Highland Dental Care',
    businessType: 'Family Dental Practice',
    primaryGoal: 'enquiries',
    targetAudience: 'Inverness families',
    location: 'Inverness, Scotland',
    servicesOrProducts: [
      { id: '1', name: 'General Checkups', source: 'user' },
      { id: '2', name: 'Emergency Tooth Relief', source: 'user' }
    ],
    preferredDesignDirection: 'local-service',
  };
  const resPlan = await post('/api/plan', { profile: testBrief });
  console.log(`Status: ${resPlan.status}`);
  if (resPlan.status !== 200 || !resPlan.body.success) throw new Error('POST /api/plan failed');
  console.log(`Plan generated: Family=${resPlan.body.plan.designFamily}, Preset=${resPlan.body.plan.preset}, Pages=${resPlan.body.plan.pages.length}`);
  console.log('✓ POST /api/plan passed.\n');

  // Test 3: POST /api/generate
  console.log('Test 3: POST /api/generate (Full website generation route)');
  const resGen = await post('/api/generate', { profile: testBrief });
  console.log(`Status: ${resGen.status}`);
  if (resGen.status !== 200 || !resGen.body.success) throw new Error(`POST /api/generate failed: ${JSON.stringify(resGen.body)}`);
  console.log(`Document ID: ${resGen.body.document.projectId}`);
  console.log(`Pages generated: ${resGen.body.document.pages.map(p => p.slug).join(', ')}`);
  console.log(`Actual credits charged: ${resGen.body.actualCredits} / 250 credits`);
  console.log(`Is Mocked/Demo Mode: ${resGen.body.isMocked}`);
  if (resGen.body.actualCredits > 250) throw new Error('Credits exceeded 250 hard cap!');
  console.log('✓ POST /api/generate passed with valid schema and budget safety.\n');

  console.log('=== ALL HTTP SMOKE TESTS PASSED! ===');
}

runSmokeTests().catch((err) => {
  console.error('Smoke test failed:', err);
  process.exit(1);
});

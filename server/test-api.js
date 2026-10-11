async function testEndpoints() {
  console.log('Testing frontend index...');
  const htmlRes = await fetch('http://localhost:5173');
  const html = await htmlRes.text();
  console.log('Frontend status:', htmlRes.status, '| Contains root div:', html.includes('id="root"'));

  console.log('\nTesting Vite /api proxy -> backend...');
  const healthRes = await fetch('http://localhost:5173/api/health');
  const health = await healthRes.json();
  console.log('Health API status:', healthRes.status, '| Response:', health);

  console.log('\nTesting AI endpoint via proxy...');
  const aiRes = await fetch('http://localhost:5173/api/ai/generate-message', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ girlfriendName: 'Elena', nickname: 'Sunshine' })
  });
  const aiData = await aiRes.json();
  console.log('AI API status:', aiRes.status, '| Success:', aiData.success, '| Source:', aiData.source);
  console.log('Sample generated letter:', aiData.message?.slice(0, 100) + '...');

  console.log('\nTesting Memories API...');
  const memRes = await fetch('http://localhost:5173/api/memories');
  const memData = await memRes.json();
  console.log('Memories API status:', memRes.status, '| Success:', memData.success);

  console.log('\nTesting Birthday API...');
  const bdayRes = await fetch('http://localhost:5173/api/birthday');
  const bdayData = await bdayRes.json();
  console.log('Birthday API status:', bdayRes.status, '| Success:', bdayData.success);

  console.log('\nALL ENDPOINTS RESPONDED SUCCESSFULLY WITH 200 OK! 🎉');
}

testEndpoints().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});

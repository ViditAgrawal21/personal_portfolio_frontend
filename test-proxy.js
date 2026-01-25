// Test script to check all proxy endpoints
const testEndpoints = async () => {
  const baseUrl = 'https://personal-portfolio-frontend-henna.vercel.app/api/proxy';
  
  console.log('🧪 Testing all admin API endpoints through proxy...\n');
  
  // Test 1: Health check (direct backend)
  try {
    console.log('1️⃣ Testing backend health...');
    const healthResponse = await fetch('https://personal-portfolio-backend-ec6a.onrender.com/health');
    const healthData = await healthResponse.json();
    console.log('✅ Backend health:', healthResponse.status, healthData);
  } catch (error) {
    console.log('❌ Backend health error:', error.message);
  }
  
  // Test 2: Login through proxy
  try {
    console.log('\n2️⃣ Testing login endpoint...');
    const loginResponse = await fetch(`${baseUrl}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'agrawalvidit656@gmail.com',
        password: 'Vidit@123'
      })
    });
    
    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    // If login successful, test other endpoints
    if (loginResponse.ok && loginData.data && loginData.data.token) {
      const token = loginData.data.token;
      console.log('🔑 Got token, testing authenticated endpoints...');
      
      // Test 3: Stats endpoint
      try {
        console.log('\n3️⃣ Testing stats endpoint...');
        const statsResponse = await fetch(`${baseUrl}/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Stats status:', statsResponse.status);
        const statsData = await statsResponse.json();
        console.log('Stats data:', statsData);
      } catch (error) {
        console.log('❌ Stats error:', error.message);
      }
      
      // Test 4: Inquiries endpoint
      try {
        console.log('\n4️⃣ Testing inquiries endpoint...');
        const inquiriesResponse = await fetch(`${baseUrl}/admin/inquiries?page=1&limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Inquiries status:', inquiriesResponse.status);
        const inquiriesData = await inquiriesResponse.json();
        console.log('Inquiries data:', inquiriesData);
      } catch (error) {
        console.log('❌ Inquiries error:', error.message);
      }
      
      // Test 5: Hire requests endpoint  
      try {
        console.log('\n5️⃣ Testing hire requests endpoint...');
        const hireResponse = await fetch(`${baseUrl}/admin/hire-requests?page=1&limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log('Hire requests status:', hireResponse.status);
        const hireData = await hireResponse.json();
        console.log('Hire requests data:', hireData);
      } catch (error) {
        console.log('❌ Hire requests error:', error.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  console.log('\n✨ Test completed!');
};

testEndpoints();
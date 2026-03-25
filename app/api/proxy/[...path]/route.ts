import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://personal-portfolio-backend-ec6a.onrender.com';

export async function GET(request: NextRequest) {
  try {
    // Extract the path from the request URL
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const queryString = url.search;
    
    // Only add /api prefix if the path doesn't already start with /api
    const fullPath = path.startsWith('/api') ? `${path}${queryString}` : `/api${path}${queryString}`;
    
    const finalUrl = `${BACKEND_URL}${fullPath}`;
    console.log(`🔄 Proxying GET request to: ${finalUrl}`);
    console.log(`📍 Original path: ${path}`);
    console.log(`🎯 Final path: ${fullPath}`);
    
    // Forward the request to the backend with all headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      requestHeaders['Authorization'] = authHeader;
      console.log('🔑 Authorization header forwarded');
    }

    const backendResponse = await fetch(finalUrl, {
      method: 'GET',
      headers: requestHeaders,
    });

    console.log(`📊 Backend response status: ${backendResponse.status}`);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`❌ Backend error: ${backendResponse.status} - ${errorText}`);
      let errorBody: any;
      try { errorBody = JSON.parse(errorText); } catch { errorBody = { error: errorText }; }
      return NextResponse.json(errorBody, {
        status: backendResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const data = await backendResponse.json();
    console.log('✅ Successfully proxied request');

    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('🚨 Proxy error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch data from backend', details: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const queryString = url.search;
    
    // Only add /api prefix if the path doesn't already start with /api
    const fullPath = path.startsWith('/api') ? `${path}${queryString}` : `/api${path}${queryString}`;
    const body = await request.json();

    const finalUrl = `${BACKEND_URL}${fullPath}`;
    console.log(`🔄 Proxying POST request to: ${finalUrl}`);
    console.log(`📍 Original path: ${path}`);
    console.log(`🎯 Final path: ${fullPath}`);
    console.log(`📦 Request body:`, body);

    // Forward the request to the backend with all headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      requestHeaders['Authorization'] = authHeader;
      console.log('🔑 Authorization header forwarded');
    }

    const backendResponse = await fetch(finalUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    console.log(`📊 Backend response status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`❌ Backend error: ${backendResponse.status} - ${errorText}`);
      let errorBody: any;
      try { errorBody = JSON.parse(errorText); } catch { errorBody = { error: errorText }; }
      return NextResponse.json(errorBody, {
        status: backendResponse.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    const data = await backendResponse.json();
    console.log('✅ Successfully proxied POST request');

    // Return the response with CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('🚨 Proxy POST error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch data from backend', details: errorMessage },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
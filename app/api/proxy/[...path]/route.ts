import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://personal-portfolio-backend-ec6a.onrender.com';

export async function GET(request: NextRequest) {
  try {
    // Extract the path from the request URL
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const queryString = url.search;
    const fullPath = `${path}${queryString}`;
    
    console.log(`Proxying GET request to: ${BACKEND_URL}${fullPath}`);
    
    // Forward the request to the backend with all headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      requestHeaders['Authorization'] = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}${fullPath}`, {
      method: 'GET',
      headers: requestHeaders,
    });

    console.log(`Backend response status: ${backendResponse.status}`);
    
    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);
      throw new Error(`Backend responded with status: ${backendResponse.status} - ${errorText}`);
    }

    const data = await backendResponse.json();

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
    console.error('Proxy error:', error);
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
    const fullPath = `${path}${queryString}`;
    const body = await request.json();

    console.log(`Proxying POST request to: ${BACKEND_URL}${fullPath}`);

    // Forward the request to the backend with all headers
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Forward Authorization header if present
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      requestHeaders['Authorization'] = authHeader;
    }

    const backendResponse = await fetch(`${BACKEND_URL}${fullPath}`, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(body),
    });

    console.log(`Backend response status: ${backendResponse.status}`);

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text();
      console.error(`Backend error: ${backendResponse.status} - ${errorText}`);
      throw new Error(`Backend responded with status: ${backendResponse.status} - ${errorText}`);
    }

    const data = await backendResponse.json();

    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Proxy error:', error);
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
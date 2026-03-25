import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'https://personal-portfolio-backend-ec6a.onrender.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function proxyRequest(request: NextRequest, method: string): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace('/api/proxy', '');
    const queryString = url.search;

    // Only add /api prefix if the path doesn't already start with /api
    const fullPath = path.startsWith('/api') ? `${path}${queryString}` : `/api${path}${queryString}`;
    const finalUrl = `${BACKEND_URL}${fullPath}`;

    console.log(`🔄 Proxying ${method} request to: ${finalUrl}`);

    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      requestHeaders['Authorization'] = authHeader;
    }

    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const bodyJson = await request.json();
        body = JSON.stringify(bodyJson);
      } catch {
        body = undefined;
      }
    }

    const backendResponse = await fetch(finalUrl, {
      method,
      headers: requestHeaders,
      body,
    });

    console.log(`📊 Backend response status: ${backendResponse.status}`);

    const responseText = await backendResponse.text();
    let responseData: any;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText ? { message: responseText } : { success: true };
    }

    if (!backendResponse.ok) {
      console.error(`❌ Backend error: ${backendResponse.status} - ${responseText}`);
      return NextResponse.json(responseData, {
        status: backendResponse.status,
        headers: CORS_HEADERS,
      });
    }

    return NextResponse.json(responseData, {
      status: backendResponse.status,
      headers: CORS_HEADERS,
    });

  } catch (error) {
    console.error(`🚨 Proxy ${method} error:`, error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch data from backend', details: errorMessage },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function PATCH(request: NextRequest) {
  return proxyRequest(request, 'PATCH');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: CORS_HEADERS,
  });
}
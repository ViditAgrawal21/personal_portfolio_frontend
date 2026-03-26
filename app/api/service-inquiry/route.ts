import { NextRequest, NextResponse } from 'next/server';

// Redirect to the unified proxy system for consistency and security
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the proxy system
    const proxyUrl = new URL('/api/proxy/services/inquiry', request.url);
    
    const response = await fetch(proxyUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error forwarding service inquiry to proxy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

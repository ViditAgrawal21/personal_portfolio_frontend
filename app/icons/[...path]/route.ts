import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  console.log('Icon redirect requested for:', resolvedParams.path);
  
  // Get the requested path
  const path = resolvedParams.path?.join('/') || '';
  
  // Handle specific old icon file requests
  if (path.includes('apple') || path.includes('touch') || path.includes('180')) {
    console.log('Redirecting to apple-icon');
    return NextResponse.redirect(new URL('/apple-icon', request.url), 301);
  }
  
  // Default redirect to main icon
  console.log('Redirecting to icon');
  return NextResponse.redirect(new URL('/icon', request.url), 301);
}
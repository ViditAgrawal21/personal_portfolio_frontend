import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  // Redirect old icon paths to new dynamic routes
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Handle specific old icon file requests
  if (pathname.includes('apple') || pathname.includes('touch')) {
    return NextResponse.redirect(new URL('/apple-icon', request.url), 301);
  }
  
  // Default redirect to main icon
  return NextResponse.redirect(new URL('/icon', request.url), 301);
}
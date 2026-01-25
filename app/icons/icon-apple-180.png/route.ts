import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  console.log('Redirecting icon-apple-180.png to /apple-icon');
  return NextResponse.redirect(new URL('/apple-icon', request.url), 301);
}
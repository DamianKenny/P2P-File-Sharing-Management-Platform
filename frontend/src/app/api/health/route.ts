import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Frontend is running',
    timestamp: new Date().toISOString(),
  });
}
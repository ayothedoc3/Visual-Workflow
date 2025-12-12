import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload] Receiving file upload request...');

    // Check if Blob storage is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('[Upload] BLOB_READ_WRITE_TOKEN not configured');
      return NextResponse.json(
        {
          error: 'File storage not configured',
          details: 'Please set up Vercel Blob storage in your project settings. Go to Vercel Dashboard → Storage → Create Blob Store'
        },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload] No file in request');
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('[Upload] File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    console.log('[Upload] File uploaded to Vercel Blob:', blob.url);

    return NextResponse.json({
      success: true,
      url: blob.url,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('[Upload] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Check for common Vercel Blob errors
    let userMessage = 'Failed to upload file';
    if (errorMessage.includes('token') || errorMessage.includes('auth')) {
      userMessage = 'Vercel Blob storage not properly configured. Please check your environment variables.';
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

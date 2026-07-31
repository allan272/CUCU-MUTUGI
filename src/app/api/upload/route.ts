import { NextResponse } from 'next/server';
import { supabase, hasSupabase } from '@/lib/supabaseClient';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

function isAuthorized(request: Request): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  
  let password = request.headers.get('x-admin-password');
  
  if (!password && request.url) {
    try {
      const { searchParams } = new URL(request.url);
      password = searchParams.get('auth');
    } catch (e) {}
  }
  
  return password === adminPassword;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || (file.type.includes('video') ? '.mp4' : '.jpg');
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;

    // 1. Try Supabase Storage if configured
    if (hasSupabase && supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('media')
          .upload(`uploads/${filename}`, buffer, {
            contentType: file.type,
            upsert: true,
          });

        if (!error && data) {
          const { data: publicUrlData } = supabase.storage
            .from('media')
            .getPublicUrl(data.path);
          return NextResponse.json({ url: publicUrlData.publicUrl });
        }
      } catch (err) {
        console.warn('Supabase storage upload failed, falling back to disk/data URL:', err);
      }
    }

    // 2. Save locally in public/uploads if filesystem allows
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);
      return NextResponse.json({ url: `/uploads/${filename}` });
    } catch (fsError) {
      console.warn('Local filesystem write failed, converting to Data URL:', fsError);
    }

    // 3. Fallback to Data URL for maximum reliability
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${file.type || 'image/png'};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });

  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ error: 'File upload failed', message: error.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/welcome';

  if (token_hash && type) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.redirect(new URL('/auth/login?error=link_expired', request.url));
}
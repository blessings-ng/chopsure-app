import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // Make sure this points to your server client

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/welcome';

  // If we have a hash and a type, verify the user
  if (token_hash && type) {
    const supabase = createClient();
    
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // SUCCESS! The user is verified. Redirect them to the Welcome page.
      const redirectUrl = new URL(next, request.url);
      return NextResponse.redirect(redirectUrl);
    }
  }

  // FAIL: If the link is actually broken or expired, send them back to login with an error
  return NextResponse.redirect(new URL('/auth/login?error=auth_code_error', request.url));
}
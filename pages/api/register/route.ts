import { sendinBlueMailNewRegistration } from '@/lib/sendinBlue/sendinBlueEmail';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { name, email } = await request.json();
  
  try {
    await sendinBlueMailNewRegistration(name, email);
    return NextResponse.json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

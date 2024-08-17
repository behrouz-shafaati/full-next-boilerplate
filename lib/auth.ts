import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { User } from './entity/user/interface';
import userCtrl from './entity/user/controller';
import { z } from 'zod';

const durationOfSessionValidity = 60 * 60 * 12 * 1000; // 12 ساعت به میلی‌ثانیه
const secretKey = 'secret';
const key = new TextEncoder().encode(secretKey);

const FormSchema = z.object({
  email: z
    .string({ required_error: 'لطفا ایمیل را وارد کنید.' })
    .email({ message: 'لطفا ایمیل معتبر وارد کنید.' }),
  password: z
    .string({ required_error: 'لطفا رمز ورود را وارد کنید.' })
    .min(6, { message: 'لطفا رمز ورود را وارد کنید.' }),
});

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await userCtrl.findOne({ filters: { email } });

    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function encrypt(payload: any) {
  const expiresInSeconds = durationOfSessionValidity / 1000; // تبدیل مدت زمان به ثانیه
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token has expired. Please generate a new one.');
    } else {
      console.log('Token verification failed:', error.message);
    }
    return null;
  }
}

export async function login(formData: FormData) {
  const parsedCredentials = FormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  console.log('#209 parsedCredentials:', JSON.stringify(parsedCredentials));
  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;
    // Verify credentials && get the user
    console.log('#0028 email:', email);
    const user = await getUser(email);
    console.log('#29 user:', user);
    if (!user) return null;

    // Create the session
    const expires = new Date(Date.now() + durationOfSessionValidity);
    const session = await encrypt({ user, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
  } else {
    // Invalid credentials
    return {
      errors: parsedCredentials.error.flatten().fieldErrors,
      message: 'لطفا فیلدهای لازم را پر کنید.',
    };
  }
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  parsed.expires = new Date(Date.now() + durationOfSessionValidity);
  const res = NextResponse.next();
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  });
  return res;
}

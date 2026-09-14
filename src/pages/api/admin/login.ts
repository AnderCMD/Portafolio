export const prerender = false;

import type { APIRoute } from 'astro';
import { createSessionToken, SESSION_COOKIE, verifyPassword, verifyUsername } from '@lib/shortener/auth';
import { getClientKey } from '@lib/shortener/guard';
import { clearAttempts, isRateLimited, registerFailedAttempt } from '@lib/shortener/rateLimit';

export const POST: APIRoute = async (context) => {
	const { request, cookies, redirect } = context;

	let address: string | undefined;
	try {
		address = context.clientAddress;
	} catch {
		address = undefined;
	}
	const key = getClientKey(request, address);

	if (isRateLimited(key)) {
		return new Response('Demasiados intentos. Intenta de nuevo más tarde.', { status: 429 });
	}

	const form = await request.formData();
	const username = String(form.get('username') ?? '');
	const password = String(form.get('password') ?? '');

	let valid: boolean;
	try {
		valid = username.length > 0 && password.length > 0 && verifyUsername(username) && verifyPassword(password);
	} catch {
		return new Response('El panel de administración no está configurado correctamente.', { status: 500 });
	}

	if (!valid) {
		registerFailedAttempt(key);
		return redirect('/Admin/login?error=1', 303);
	}

	clearAttempts(key);
	cookies.set(SESSION_COOKIE, createSessionToken(), {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		path: '/',
	});

	return redirect('/Admin', 303);
};

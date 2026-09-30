export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { createLink } from '@lib/shortener/db';
import { requireSession } from '@lib/shortener/guard';
import { parseFutureDate } from '@lib/shortener/utils';
import { isValidCode, isValidTargetUrl } from '@lib/shortener/validate';

export const POST: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	let form: FormData;
	try {
		form = await context.request.formData();
	} catch {
		return new Response('Bad request', { status: 400 });
	}

	const targetUrl = String(form.get('targetUrl') ?? '').trim();
	const requestedCode = String(form.get('code') ?? '').trim();

	if (!isValidTargetUrl(targetUrl)) {
		return context.redirect('/Admin?error=url', 303);
	}

	if (requestedCode && !isValidCode(requestedCode)) {
		return context.redirect('/Admin?error=code', 303);
	}

	const expiresRaw = String(form.get('expiresAt') ?? '').trim();
	const expiresAt = parseFutureDate(expiresRaw);
	if (expiresRaw && !expiresAt) {
		return context.redirect('/Admin?error=expires', 303);
	}

	try {
		await createLink({
			code: requestedCode || undefined,
			targetUrl,
			expiresAt: expiresAt ?? undefined,
			autoDelete: expiresAt !== null && form.get('autoDelete') === '1',
		});
	} catch (error) {
		const message = error instanceof Error && error.message === 'DUPLICATE_CODE' ? 'duplicate' : 'unknown';
		if (message === 'unknown') console.error('[admin] createLink failed', error);
		return context.redirect(`/Admin?error=${message}`, 303);
	}

	return context.redirect('/Admin', 303);
};

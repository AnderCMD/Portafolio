export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { createLink } from '@lib/shortener/db';
import { requireSession } from '@lib/shortener/guard';
import { isValidCode, isValidTargetUrl } from '@lib/shortener/validate';

export const POST: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	const form = await context.request.formData();
	const targetUrl = String(form.get('targetUrl') ?? '').trim();
	const requestedCode = String(form.get('code') ?? '').trim();

	if (!isValidTargetUrl(targetUrl)) {
		return context.redirect('/Admin?error=url', 303);
	}

	if (requestedCode && !isValidCode(requestedCode)) {
		return context.redirect('/Admin?error=code', 303);
	}

	try {
		await createLink({ code: requestedCode || undefined, targetUrl });
	} catch (error) {
		const message = error instanceof Error && error.message === 'DUPLICATE_CODE' ? 'duplicate' : 'unknown';
		return context.redirect(`/Admin?error=${message}`, 303);
	}

	return context.redirect('/Admin', 303);
};

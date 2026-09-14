export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { deleteLinkByCode, setLinkActive } from '@lib/shortener/db';
import { requireSession } from '@lib/shortener/guard';

export const POST: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	const code = context.params.code;
	if (!code) {
		return new Response('Bad request', { status: 400 });
	}

	const form = await context.request.formData();
	const action = String(form.get('action') ?? '');

	if (action === 'delete') {
		await deleteLinkByCode(code);
	} else if (action === 'toggle') {
		await setLinkActive(code, form.get('active') === '1');
	}

	return context.redirect('/Admin', 303);
};

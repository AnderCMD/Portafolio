export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { createProject } from '@lib/projects/db';
import { isValidSlug, normalizeSlug, parseName } from '@lib/projects/validate';
import { requireSession } from '@lib/shortener/guard';

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

	const slug = normalizeSlug(String(form.get('slug') ?? ''));
	const name = parseName(form.get('name'));

	if (!isValidSlug(slug)) {
		return context.redirect('/Admin/Proyectos?error=slug', 303);
	}
	if (!name) {
		return context.redirect('/Admin/Proyectos?error=name', 303);
	}

	try {
		await createProject({ slug, name });
	} catch (error) {
		const message = error instanceof Error && error.message === 'DUPLICATE_SLUG' ? 'duplicate' : 'unknown';
		if (message === 'unknown') console.error('[admin] createProject failed', error);
		return context.redirect(`/Admin/Proyectos?error=${message}`, 303);
	}

	return context.redirect('/Admin/Proyectos', 303);
};

export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { deleteProject, setProjectActive } from '@lib/projects/db';
import { isValidSlug } from '@lib/projects/validate';
import { requireSession } from '@lib/shortener/guard';

export const POST: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	const slug = context.params.slug;
	if (!slug || !isValidSlug(slug)) {
		return new Response('Bad request', { status: 400 });
	}

	let form: FormData;
	try {
		form = await context.request.formData();
	} catch {
		return new Response('Bad request', { status: 400 });
	}

	const action = String(form.get('action') ?? '');

	try {
		switch (action) {
			case 'toggle':
				await setProjectActive(slug, form.get('active') === '1');
				break;
			case 'delete':
				await deleteProject(slug);
				break;
			default:
				return new Response('Bad request', { status: 400 });
		}
	} catch (error) {
		console.error('[admin] project action failed', action, error);
		return context.redirect('/Admin/Proyectos?error=unknown', 303);
	}

	return context.redirect('/Admin/Proyectos', 303);
};

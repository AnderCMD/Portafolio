export const prerender = false;

import type { APIContext, APIRoute } from 'astro';
import { deleteLinkByCode, renewLink, setLinkActive, setLinkFavorite, updateLinkTargetUrl } from '@lib/shortener/db';
import { requireSession } from '@lib/shortener/guard';
import { parseRenewDays, safeReturnPath, withError } from '@lib/shortener/utils';
import { isValidTargetUrl } from '@lib/shortener/validate';

const CODE_PARAM = /^[a-zA-Z0-9_-]{1,64}$/;

export const POST: APIRoute = async (context: APIContext) => {
	const unauthorized = requireSession(context);
	if (unauthorized) {
		return unauthorized;
	}

	const code = context.params.code;
	if (!code || !CODE_PARAM.test(code)) {
		return new Response('Bad request', { status: 400 });
	}

	let form: FormData;
	try {
		form = await context.request.formData();
	} catch {
		return new Response('Bad request', { status: 400 });
	}

	const action = String(form.get('action') ?? '');
	const back = safeReturnPath(form.get('returnTo'));

	try {
		switch (action) {
			case 'delete':
				await deleteLinkByCode(code);
				break;
			case 'toggle':
				await setLinkActive(code, form.get('active') === '1');
				break;
			case 'favorite':
				await setLinkFavorite(code, form.get('favorite') === '1');
				break;
			case 'edit': {
				const targetUrl = String(form.get('targetUrl') ?? '').trim();
				if (!isValidTargetUrl(targetUrl)) {
					return context.redirect(withError(back, 'url'), 303);
				}
				await updateLinkTargetUrl(code, targetUrl);
				break;
			}
			case 'renew': {
				const days = parseRenewDays(form.get('days'));
				if (days === null) {
					return context.redirect(withError(back, 'expires'), 303);
				}
				await renewLink(code, new Date(Date.now() + days * 86_400_000));
				break;
			}
			case 'clear-expiry':
				await renewLink(code, null);
				break;
			default:
				return new Response('Bad request', { status: 400 });
		}
	} catch (error) {
		console.error('[admin] link action failed', action, error);
		return context.redirect(withError(back, 'unknown'), 303);
	}

	return context.redirect(back, 303);
};

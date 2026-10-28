const SLUG_PATTERN = /^[a-z0-9][a-z0-9_-]{1,63}$/;
export const MAX_NAME_LENGTH = 100;

export function normalizeSlug(value: string): string {
	return value.trim().toLowerCase();
}

export function isValidSlug(slug: string): boolean {
	return SLUG_PATTERN.test(slug);
}

export function parseName(value: FormDataEntryValue | null): string | null {
	if (typeof value !== 'string') return null;
	const name = value.trim();
	return name.length >= 1 && name.length <= MAX_NAME_LENGTH ? name : null;
}

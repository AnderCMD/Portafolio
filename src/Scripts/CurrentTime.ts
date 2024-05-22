let currentYear = new Date().getFullYear();
export let CurrentYear = '';

if (currentYear > 2024) {
    CurrentYear = new Date().getFullYear().toString();
    CurrentYear = ` - ${CurrentYear}`;
} else {
    CurrentYear = '';
}
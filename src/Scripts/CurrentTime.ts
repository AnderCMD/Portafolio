export const getCurrentYear = (): string => {
    const currentYear = new Date().getFullYear();
    return currentYear > 2024 ? currentYear.toString() : '';
};

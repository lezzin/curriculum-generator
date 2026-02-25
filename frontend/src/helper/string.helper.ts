export function toHumanReadableDate(date: string): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };

    return new Date(date).toLocaleDateString(undefined, options);
}

export function getFirstLetter(value?: string) {
    return value?.charAt(0).toUpperCase();
}
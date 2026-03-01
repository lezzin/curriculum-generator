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

export function nullToEmpty<T extends Record<string, any>>(obj: T): T {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            value ?? ''
        ])
    ) as T
}

export function capitalizeFirst(str?: string) {
    if (typeof str !== 'string' || str.length === 0) {
        return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}
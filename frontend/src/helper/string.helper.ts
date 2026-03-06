export function toHumanReadableDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Date(date).toLocaleDateString(undefined, options);
}

export function getTodayDate() {
  return new Intl.DateTimeFormat('sv-SE').format(new Date());
}

export function getFirstLetter(value?: string) {
  return value?.charAt(0).toUpperCase();
}

export function nullToEmpty<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, value ?? ''])) as T;
}

export function handleDownload(url: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = ''
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
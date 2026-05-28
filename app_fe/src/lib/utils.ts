import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import DOMPurify from 'dompurify'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//This function formats a given amount as a currency string in US dollars. It divides the amount by 1 (which is essentially a no-op) and then uses the toLocaleString method to format the number according to the 'en-US' locale, specifying that the style should be 'currency' and the currency should be 'USD'. The resulting string will include the appropriate currency symbol and formatting for US dollars.
export const formatCurrency = (amount: number) => {
  return (amount / 1).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

//This function takes a date string and an optional locale (defaulting to 'en-AU') and formats the date according to the specified locale. It uses the Intl.DateTimeFormat API to format the date, providing options for displaying the weekday, day, month, and year in a long format. The function returns the formatted date string.
export const formatDateToLocal = (dateStr: string, locale = 'en-AU') => {
  const date = new Date(dateStr)
  // biome-ignore lint/complexity/noBannedTypes: <reason>
  const options: {} = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }
  const formatter = new Intl.DateTimeFormat(locale, options)
  return formatter.format(date)
}

//This function reads the html markup from Directus and sanitizes it to prevent XSS attacks. It uses the DOMPurify library to sanitize the HTML string. If the code is running in a server environment (where window is undefined), it simply returns the original HTML string without sanitization, as DOMPurify relies on the DOM APIs which are not available in a server environment.
export const sanitizeHtml = (html: string) => {
  if (typeof window === 'undefined') return html
  return DOMPurify.sanitize(html)
}

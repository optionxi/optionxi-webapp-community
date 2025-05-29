export const getSentimentStyles = (sentiment: string | null) => {
  switch (sentiment?.toLowerCase()) {
    case 'bullish':
      return {
        border: 'border-l-4 border-l-emerald-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950',
        tag: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'
      }
    case 'bearish':
      return {
        border: 'border-l-4 border-l-rose-500',
        bg: 'bg-rose-50 dark:bg-rose-950',
        tag: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100'
      }
    default:
      return {
        border: 'border-l-4 border-l-gray-500',
        bg: 'bg-gray-50 dark:bg-gray-900',
        tag: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
      }
  }
}

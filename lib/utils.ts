export function formatDateTime(dateString: string): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(dateString));
  }

  export function formatJSON(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }
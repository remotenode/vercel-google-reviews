/**
 * Date filtering utilities for review queries
 */

/**
 * Parse date filter parameter and return start date
 * Supports both absolute dates (YYYY-MM-DD) and relative dates (7d, 1w, 1m, 1y)
 * @param dateFilter - Date filter string
 * @returns Date object or null if no filter
 */
export function parseDateFilter(dateFilter?: string): Date | null {
  if (!dateFilter) {
    return null;
  }

  const now = new Date();
  
  // Handle relative dates
  if (dateFilter.endsWith('d')) {
    const days = parseInt(dateFilter.slice(0, -1));
    if (!isNaN(days)) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - days);
      return startDate;
    }
  }
  
  if (dateFilter.endsWith('w')) {
    const weeks = parseInt(dateFilter.slice(0, -1));
    if (!isNaN(weeks)) {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - (weeks * 7));
      return startDate;
    }
  }
  
  if (dateFilter.endsWith('m')) {
    const months = parseInt(dateFilter.slice(0, -1));
    if (!isNaN(months)) {
      const startDate = new Date(now);
      startDate.setMonth(now.getMonth() - months);
      return startDate;
    }
  }
  
  if (dateFilter.endsWith('y')) {
    const years = parseInt(dateFilter.slice(0, -1));
    if (!isNaN(years)) {
      const startDate = new Date(now);
      startDate.setFullYear(now.getFullYear() - years);
      return startDate;
    }
  }
  
  // Handle absolute dates (YYYY-MM-DD)
  if (dateFilter.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const date = new Date(dateFilter);
    if (!isNaN(date.getTime())) {
      return date;
    }
  }
  
  throw new Error(`Invalid date format: ${dateFilter}. Use YYYY-MM-DD or relative format (7d, 1w, 1m, 1y)`);
}

/**
 * Filter reviews by date
 * @param reviews - Array of reviews
 * @param startDate - Start date for filtering
 * @returns Filtered reviews
 */
export function filterReviewsByDate(reviews: any[], startDate: Date | null): any[] {
  if (!startDate) {
    return reviews;
  }
  
  return reviews.filter(review => {
    const reviewDate = new Date(review.date);
    return reviewDate >= startDate;
  });
}

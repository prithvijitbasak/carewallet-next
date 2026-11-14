/**
 * ============================================================================
 * TIMEZONE VALIDATION & HELPERS
 * ============================================================================
 * 
 * Why does timezone matter in CareWallet?
 * When calculating "Today's Expenses", "This Month", or generating charts:
 * If the server runs in UTC and a user is in "Asia/Kolkata" (UTC+5:30) or "America/New_York" (UTC-5),
 * midnight happens at completely different times!
 * 
 * To ensure expenses are grouped under the correct calendar day for the user,
 * CareWallet stores each user's IANA timezone string (e.g. "Asia/Kolkata", "America/New_York")
 * and validates it using TimezoneDB API with a reliable fallback to JavaScript's native `Intl` API.
 */

/**
 * Validates whether a provided timezone string is a recognized IANA timezone.
 * 
 * Checks against:
 * 1. TimezoneDB API (if TIMEZONE_DB_API_KEY environment variable is configured)
 * 2. Standard built-in JavaScript `Intl.DateTimeFormat` (available in all modern Node.js versions)
 * 
 * @param timezone - String representing the timezone, e.g. "Asia/Kolkata" or "UTC"
 * @returns Promise resolving to `true` if valid, or `false` if invalid
 */
export const isValidTimezone = async (timezone: string): Promise<boolean> => {
  try {
    const apiKey = process.env.TIMEZONE_DB_API_KEY;
    if (apiKey) {
      const params = new URLSearchParams({
        key: apiKey,
        format: "json",
        by: "zone",
        zone: timezone,
      });

      const response = await fetch(
        `https://api.timezonedb.com/v2.1/list-time-zone?${params.toString()}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.zones && data.zones.length > 0) {
          return data.zones[0].zoneName === timezone;
        }
      }
    }

    // Fallback using native JavaScript Internationalization (Intl) API
    // If timezone is invalid, Intl.DateTimeFormat will throw a RangeError
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    console.error("Timezone validation error:", error);
    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone });
      return true;
    } catch {
      return false;
    }
  }
};

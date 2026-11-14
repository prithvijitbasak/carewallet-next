// Timezone validation using TimezoneDB API with Intl fallback

// Validates whether a provided timezone string is a recognized IANA timezone
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

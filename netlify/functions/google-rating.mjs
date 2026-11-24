// Live Google rating for the homepage badge.
//
// Returns { rating, count } for the Google Business Profile, fetched from the
// Google Places API (New). Netlify's CDN caches the answer for a day, so Google
// is called roughly once per day no matter how many visitors load the page.
//
// Setup (Netlify -> Site configuration -> Environment variables):
//   GOOGLE_PLACES_API_KEY  an API key with "Places API (New)" enabled
//   GOOGLE_PLACE_ID        the business's Place ID (starts with "ChIJ")
// Until both are set this returns 503 and the page keeps its built-in numbers.

const json = (body, status, cache) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'cache-control': cache ? 'public, max-age=3600' : 'no-store',
      ...(cache && {
        'netlify-cdn-cache-control': 'public, durable, s-maxage=86400, stale-while-revalidate=604800',
      }),
    },
  });

export default async () => {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return json({ error: 'not configured' }, 503, false);

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'rating,userRatingCount' },
    });
    if (!res.ok) return json({ error: `google ${res.status}` }, 502, false);
    const place = await res.json();
    if (typeof place.rating !== 'number') return json({ error: 'no rating' }, 502, false);
    return json({ rating: place.rating, count: place.userRatingCount ?? 0 }, 200, true);
  } catch {
    return json({ error: 'fetch failed' }, 502, false);
  }
};

export const config = { path: '/api/google-rating' };

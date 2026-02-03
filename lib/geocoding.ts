const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

const geocodeCache = new Map<string, string>();

// Queue pour respecter le rate limit de Nominatim (1 req/sec)
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1500; // 1.5 seconde pour être sûr

const pendingRequests = new Map<string, Promise<string>>();

interface NominatimAddress {
  road?: string;
  city?: string;
  town?: string;
  village?: string;
}

interface NominatimResponse {
  address?: NominatimAddress;
  display_name?: string;
}

/**
 * Attend le temps nécessaire pour respecter le rate limit
 */
async function waitForRateLimit(): Promise<void> {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest));
  }
  
  lastRequestTime = Date.now();
}

/**
 * Effectue la requête avec retry
 */
async function fetchWithRetry(url: string, retries = 2): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'QuadriFleet/1.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        return response;
      }
            if (response.status === 429 && i < retries) {
        await new Promise(resolve => setTimeout(resolve, 2000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

/**
 * Récupère une adresse simplifiée à partir de coordonnées GPS
 * Utilise l'API Nominatim (OpenStreetMap)
 */
export async function reverseGeocode(lat: string | number, lng: string | number): Promise<string> {
  // Valider les coordonnées
  const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
  const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
  
  if (isNaN(latNum) || isNaN(lngNum)) {
    return `${lat}, ${lng}`;
  }
  
  const cacheKey = `${latNum.toFixed(4)},${lngNum.toFixed(4)}`;
  
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }
  
  if (pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey)!;
  }
  
  const requestPromise = (async (): Promise<string> => {
    try {
      await waitForRateLimit();
      
      const response = await fetchWithRetry(
        `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latNum}&lon=${lngNum}&accept-language=fr`
      );
      
      const data: NominatimResponse = await response.json();
      
      let result: string;
      if (data.address) {
        const parts: string[] = [];
        if (data.address.road) parts.push(data.address.road);
        if (data.address.city || data.address.town || data.address.village) {
          parts.push(data.address.city || data.address.town || data.address.village || "");
        }
        result = parts.join(", ") || data.display_name || `${lat}, ${lng}`;
      } else {
        result = `${lat}, ${lng}`;
      }
            geocodeCache.set(cacheKey, result);
      
      return result;
    } catch {
      return `${lat}, ${lng}`;
    } finally {
      pendingRequests.delete(cacheKey);
    }
  })();
  
  pendingRequests.set(cacheKey, requestPromise);
  
  return requestPromise;
}

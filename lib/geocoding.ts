const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";

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
 * Récupère une adresse simplifiée à partir de coordonnées GPS
 * Utilise l'API Nominatim (OpenStreetMap)
 */
export async function reverseGeocode(lat: string | number, lng: string | number): Promise<string> {
  try {
    const response = await fetch(
      `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }
    
    const data: NominatimResponse = await response.json();
    
    if (data.address) {
      const parts: string[] = [];
      if (data.address.road) parts.push(data.address.road);
      if (data.address.city || data.address.town || data.address.village) {
        parts.push(data.address.city || data.address.town || data.address.village || "");
      }
      return parts.join(", ") || data.display_name || `${lat}, ${lng}`;
    }
    
    return `${lat}, ${lng}`;
  } catch (error) {
    console.error("Error fetching address:", error);
    return `${lat}, ${lng}`;
  }
}

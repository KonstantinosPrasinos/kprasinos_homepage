export type LocationData = {
    city: string;
    country: string;
    countryCode: string;
}

export const getCityName = async (lat: number, lon: number): Promise<LocationData> => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();

    // It returns a detailed object; usually 'address.city' or 'address.town' is what you want
    return {
        city: data.address.city || data.address.town || data.address.village || "Unknown Location",
        country: data.address.country || "Unknown Country",
        countryCode: data.address.country_code || "Unknown Country Code"
    };
}
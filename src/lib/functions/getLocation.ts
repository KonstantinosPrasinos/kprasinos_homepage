export type Location = {
    longitude: number,
    latitude: number
}

async function getIpLocation(): Promise<Location> {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('IP Fetch failed');

    const data = await res.json();

    return {
        longitude: data.longitude,
        latitude: data.latitude
    }
}

export const getLocation = async (): Promise<Location> => {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
    }


    // 2. Request the position
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const data: Location = {
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude,
                }

                resolve(data);
            },
            () => {
                // Failed to fetch, attempting to get location by the ip
                getIpLocation().then(resolve).catch(reject);
            },
            // Optional settings for high accuracy
            {
                enableHighAccuracy: false, // Uses GPS if available
                timeout: 5000, // Wait max 5 seconds
                maximumAge: 0 // Do not use a cached position
            }
        );
    });
}
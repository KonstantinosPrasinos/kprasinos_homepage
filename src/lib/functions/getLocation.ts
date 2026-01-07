export const getLocation = async () : Promise<GeolocationPosition> => {
    if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser.');
    }

    // 2. Request the position
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve(position);
            },
            (err) => {
                // Error handling
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        throw new Error('User denied the request for Geolocation.');
                        break;
                    case err.POSITION_UNAVAILABLE:
                        throw new Error('Location information is unavailable.');
                        break;
                    case err.TIMEOUT:
                        throw new Error('The request to get user location timed out.');
                        break;
                    default:
                        throw new Error('An unknown error occurred while retrieving location.');
                        break;
                }
                reject(err);
            },
            // Optional settings for high accuracy
            {
                enableHighAccuracy: true, // Uses GPS if available
                timeout: 5000, // Wait max 5 seconds
                maximumAge: 0 // Do not use a cached position
            }
        );
    });
}
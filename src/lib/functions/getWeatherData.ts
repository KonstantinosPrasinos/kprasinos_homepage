import { fetchWeatherApi } from "openmeteo";
import { Question, Sun, CloudSun, Cloud, CloudFog, CloudRain, CloudSnow, CloudLightning } from "phosphor-svelte";
import type { Component } from "svelte";

export type WeatherData = {
    hourly: {
        time: Date[];
        temperature_2m: Float32Array<ArrayBufferLike>;
        weather_code: Float32Array<ArrayBufferLike>;
    };
    daily: {
        time: Date[];
        apparent_temperature_max: Float32Array<ArrayBufferLike>;
        apparent_temperature_min: Float32Array<ArrayBufferLike>;
        weather_code: Float32Array<ArrayBufferLike>;
    };
    today: {
        maxTemp: number;
        minTemp: number;
    }
};

export const getWeatherDescription = (code: number): string => {
    switch (code) {
        case 0:
            return 'Clear sky';
        case 1:
            return 'Mainly clear';
        case 2:
            return 'Partly cloudy';
        case 3:
            return 'Overcast';
        case 45:
        case 48:
            return 'Fog';
        case 51:
        case 53:
        case 55:
            return 'Drizzle';
        case 56:
        case 57:
            return 'Freezing Drizzle';
        case 61:
        case 63:
        case 65:
            return 'Rain';
        case 66:
        case 67:
            return 'Freezing Rain';
        case 71:
        case 73:
        case 75:
            return 'Snow';
        case 77:
            return 'Snow grains';
        case 80:
        case 81:
        case 82:
            return 'Rain showers';
        case 85:
        case 86:
            return 'Snow showers';
        case 95:
            return 'Thunderstorm';
        case 96:
        case 99:
            return 'Thunderstorm with hail';
        default:
            return 'Unknown';
    }
};

export const getWeatherIcon = (description: string): Component => {
    return weatherIconMap[description] || Question;
}



export const weatherIconMap: Record<string, Component> = {
    // Clear / Sunny
    'Clear sky': Sun,
    'Mainly clear': Sun,
    'Partly cloudy': CloudSun,

    // Cloudy / Fog
    Overcast: Cloud,
    Fog: CloudFog,

    // Rain
    Drizzle: CloudRain,
    'Freezing Drizzle': CloudRain, // Or CloudSnow if you prefer
    Rain: CloudRain,
    'Freezing Rain': CloudRain,
    'Rain showers': CloudRain,

    // Snow
    Snow: CloudSnow,
    'Snow grains': CloudSnow,
    'Snow showers': CloudSnow,

    // Storms
    Thunderstorm: CloudLightning,
    'Thunderstorm with hail': CloudLightning,

    // Fallback
    Unknown: Question
};

export const getDayLetter = (date: Date): string => {
    return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0);
}

export const getWeatherData = async (lon: number, lat: number): Promise<WeatherData> => {
    const params = {
        latitude: lat,
        longitude: lon,
        daily: ['apparent_temperature_max', 'apparent_temperature_min', 'weather_code'],
        hourly: ['temperature_2m', 'weather_code']
    };
    const url = 'https://api.open-meteo.com/v1/forecast';
    const responses = await fetchWeatherApi(url, params);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const latitude = response.latitude();
    const longitude = response.longitude();
    const elevation = response.elevation();
    const utcOffsetSeconds = response.utcOffsetSeconds();

    console.log(
        `\nCoordinates: ${latitude}°N ${longitude}°E`,
        `\nElevation: ${elevation}m asl`,
        `\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`
    );

    const hourly = response.hourly()!;
    const daily = response.daily()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
        hourly: {
            time: Array.from(
                { length: (Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval() },
                (_, i) =>
                    new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
            ),
            temperature_2m: hourly.variables(0)!.valuesArray()!,
            weather_code: hourly.variables(1)!.valuesArray()!
        },
        daily: {
            time: Array.from(
                { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
                (_, i) =>
                    new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
            ),
            apparent_temperature_max: daily.variables(0)!.valuesArray()!,
            apparent_temperature_min: daily.variables(1)!.valuesArray()!,
            weather_code: daily.variables(2)!.valuesArray()!
        },
        today: {
            maxTemp: daily.variables(0)!.valuesArray()![0],
            minTemp: daily.variables(1)!.valuesArray()![0]
        }
    };

    return weatherData;
};
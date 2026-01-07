<script lang="ts">
	import { onMount } from 'svelte';
	import { Question } from 'phosphor-svelte';
	import { getLocation } from '$lib/functions/getLocation';
	import {
		getDayLetter,
		getWeatherData,
		getWeatherDescription,
		getWeatherIcon,
		weatherIconMap,
		type WeatherData
	} from '$lib/functions/getWeatherData';
	import { getCityName, type LocationData } from '$lib/functions/getCityName';

	let error: string | null = null;
	let loading: boolean = true;
	let description: string = 'Unknown';
	let currentTemperature: String = '0';
	let locationData: LocationData = {
		city: 'Unknown Location',
		country: 'Unknown Country',
		countryCode: 'Unknown Country Code'
	};
	let weatherData: WeatherData | null = null;

	$: IconComponent = weatherIconMap[description] || Question;

	onMount(() => {
		initialize();
	});

	const initialize = async () => {
		try {
			loading = true;
			const location = await getLocation();
			if (location) {
				weatherData = await getWeatherData(location.coords.longitude, location.coords.latitude);

				const now = new Date();
				const hour = now.getUTCHours();

				currentTemperature = weatherData?.hourly?.temperature_2m?.at(hour)?.toFixed(0) ?? '0';
				description = getWeatherDescription(weatherData?.hourly?.weather_code?.[0] ?? 0);
				locationData = await getCityName(location.coords.latitude, location.coords.longitude);

				console.log(weatherData);
			} else {
				error = 'Could not retrieve location.';
			}
		} catch (err) {
			error = 'An error occurred while fetching weather data.';
			console.error(err);
		} finally {
			loading = false;
		}
	};
</script>

<div class="weather-container glass">
	{#if loading}
		<div>Loading...</div>
	{:else if error}
		<div class="error">{error}</div>
	{:else}
		<div class="column">
			<div class="top-half">
				<div class="location">{locationData.city}, {locationData.countryCode.toUpperCase()}</div>
				<div class="temperature">{currentTemperature}°C</div>
			</div>
			<div class="bottom-half">
				<div class="weather-icon">
					<svelte:component this={IconComponent} size={32} weight="regular" />
				</div>
				<div class="column bottom-info">
					<div class="temperatureRange">H: {weatherData?.today.maxTemp.toFixed(0) ?? 'N/A'}°C</div>
					<div class="temperatureRange">L: {weatherData?.today.minTemp.toFixed(0) ?? 'N/A'}°C</div>
				</div>
			</div>
		</div>
		<div class="column">
			{#each weatherData?.daily?.time.slice(1).slice(0, -1) as day, i}
				<div class="bottom-half">
					<div class="day">{getDayLetter(new Date(day))}:</div>
					<div class="column bottom-info">
						<div class="row">
							<div class="temperatureRange small">
								{weatherData?.daily?.apparent_temperature_min?.[i + 1]?.toFixed(0) ?? '--'}°C
							</div>
							<div class="temperatureRange small">
								{weatherData?.daily?.apparent_temperature_max?.[i + 1]?.toFixed(0) ?? '--'}°C
							</div>
						</div>
					</div>
					<div class="weather-icon small">
						<svelte:component
							this={getWeatherIcon(
								getWeatherDescription(weatherData?.daily?.weather_code?.[i + 1] ?? 0)
							)}
							size={22}
							weight="regular"
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.weather-container {
		display: flex;
		flex-direction: row;
		gap: 20px;
		border-radius: 24px;
		padding: 12px;

		width: 320px;
		height: 150px;
		border-radius: 20px;

		color: var(--on-surface-color);
	}

	.column {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.temperature {
		font-size: 36px;
		font-weight: 500;
	}

	.bottom-half {
		width: 100%;
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 10px;
	}

	.temperatureRange {
		font-size: 16px;
		font-weight: 400;
		display: inline-block;
		width: max-content;
	}

	.temperatureRange.small {
		font-size: 14px;
		font-weight: 400;
	}

	.weather-icon.small {
		width: 22px;
		height: 22px;
	}

    .row {
        display: flex;
        flex-direction: row;
        gap: 6px;
    }
</style>

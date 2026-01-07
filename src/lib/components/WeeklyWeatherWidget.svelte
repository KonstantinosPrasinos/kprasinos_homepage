<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowsClockwise, Question } from 'phosphor-svelte';
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
	import LoadingIndicator from './LoadingIndicator.svelte';

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
		const interval = setInterval(initialize, 30 * 60 * 1000); // Refresh every 30 minutes
		return () => clearInterval(interval);
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

<div class="weather-container glass widget" class:loading>
	{#if loading}
		<LoadingIndicator />
	{:else if error}
		<div class="error">{error}</div>
	{:else}
		<button class="reload-button icon-button" title="Reload" on:click={initialize}>
			<ArrowsClockwise size={24} />
		</button>
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
		position: relative;
	}

	.reload-button {
		position: absolute;
		top: 10px;
		right: 10px;
		opacity: 0;
		transition: opacity 0.1s ease-in-out, transform 0.1s ease-in-out;
		pointer-events: none;
		background-color: var(--opaque-surface-color);
		width: 32px;
		height: 32px;
		border-radius: 32px;

		display: flex;
		justify-content: center;
		align-items: center;
		transform: scale(0.8);

		padding: 4px;
	}
	.weather-container:hover .reload-button {
		opacity: 1;
		pointer-events: all;
		transform: scale(1);
	}

	.weather-container.loading {
		justify-content: center;
		align-items: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	.column {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		animation: 0.15s fadeIn ease-in-out;
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

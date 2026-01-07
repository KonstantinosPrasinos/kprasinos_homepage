
<div class="weather-container glass">
    <div class="column">
        <div class="top-half">
            <div class="location">
                Athens, GR
            </div>
            <div class="temperature">22°C</div>
        </div>
        <div class="bottom-half">
            <div class="condition">Sunny</div>
            <div class="temperatureRange">L: 10°C H: 25°C</div>
        </div>
    </div>
</div>

<style>
    .weather-container {
        display: flex;
        flex-direction: row;
        /* background: rgb(from var(--surface-color) r g b / 0.4);
		border: 1px solid var(--outline-color); */
		border-radius: 24px;
        padding: 10px;

        width: 320px;
        height: 150px;
        border-radius: 20px;

        color: var(--on-surface-color);
    }

    .column {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .temperature {
        font-size: 36px;
        font-weight: 500;
    }
</style>
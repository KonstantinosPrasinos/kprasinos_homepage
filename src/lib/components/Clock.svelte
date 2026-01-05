<script lang="ts">
	import { onMount } from "svelte";

    export let showSeconds: boolean = true;
    
    let now = new Date();
    let formattedDate: string = '';
    let timeString: string = '';

    onMount(() => {
        function updateTime() {
            now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            formattedDate = now.toLocaleDateString('en-GB', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            });
            
            if (!showSeconds) {
                timeString = `${hours}:${minutes}`;
                return;
            }
            timeString = `${hours}:${minutes}:${seconds}`;
        }

        updateTime(); // Initial call
        const interval = setInterval(updateTime, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    })
</script>

<div class="time-container">
    <div class="clock">
        {timeString}
    </div>
    <div class="date">
        {formattedDate}
    </div>
</div>

<style>
    .time-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'JetBrains Mono', monospace;
        text-align: center;
        color: var(--on-background-color);
    }

    .clock {

        font-size: 100px;
        font-weight: 600;
    }

    .date {
        font-size: 24px;
        font-weight: 400;
        opacity: 0.67;
    }
</style>
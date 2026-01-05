<script lang="ts">
	import { onMount } from 'svelte';

    type CircleType = {
        size: number;
        x: number;
        y: number;
        color: string;
    };

	// Settings
	const positionInterval: number = 3000; // milliseconds
    const maxCircles: number = 3;
    const maxOverlapPercent: number = 0.3;
	const colors: string[] = [
		'#1abc9c',
		'#2ecc71',
		'#3498db',
		'#9b59b6',
		'#16a085',
		'#27ae60',
		'#2980b9',
		'#8e44ad',
		'#f1c40f',
		'#e67e22',
		'#e74c3c',
		'#f39c12',
		'#d35400',
		'#c0392b'
	];
    let circles: CircleType[] = [];

	// Returns a random integer between min (x) and max (y) INCLUSIVE
	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const randomColor: string = colors[getRandomInt(0, colors.length - 1)];
	const gradient: string = `radial-gradient(circle, ${randomColor} 0%, #000000 100%)`;

	let width: number = 0;
	let height: number = 0;
	let size: number = 0;
	let x: number = 0;
	let y: number = 0;

    const populateCircles = () => {
        for (const index in circles) {
			circles[index].size = getRandomInt(200, 600);
            circles[index].x = getRandomInt(-circles[index].size / 2, width - circles[index].size / 2);
            circles[index].y = getRandomInt(-circles[index].size / 2, height - circles[index].size / 2);
            circles[index].color = colors[getRandomInt(0, colors.length - 1)];
			continue;

			let overlapping: boolean = false;
            
            do {
				const tempX = getRandomInt(-circles[index].size / 2, width - circles[index].size / 2);
				const tempY = getRandomInt(-circles[index].size / 2, height - circles[index].size / 2);

				for (const otherIndex in circles) {
					if (otherIndex === index) continue;

					const dx = tempX + circles[index].size / 2 - (circles[otherIndex].x + circles[otherIndex].size / 2);
					const dy = tempY + circles[index].size / 2 - (circles[otherIndex].y + circles[otherIndex].size / 2);
					const distance = Math.sqrt(dx * dx + dy * dy);

					if ((distance < (circles[index].size / 2) * (1 - maxOverlapPercent)) && (distance < (circles[otherIndex].size / 2) * (1 - maxOverlapPercent))) {
						overlapping = true;
					} else {
						overlapping = false;
						circles[index].x = tempX;
						circles[index].y = tempY;
					}
				}
            } while (overlapping)
        }
    }

	onMount(() => {
		width = window.innerWidth;
		height = window.innerHeight;

        circles = Array.from({ length: maxCircles }, () => {
            return {
                size: 0,
                x: width / 2,
                y: height / 2,
                color: colors[0]
            };
        });

		// const interval = setInterval(populateCircles, positionInterval);

		populateCircles(); // Initial population

		// return () => clearInterval(interval);
	});
</script>

<div class="background">
	{#each circles as circle}
		<div
			class="circle"
			style={`background-color: ${circle.color}; width: ${circle.size}px; height: ${circle.size}px; position: absolute; top: ${circle.y}px; left: ${circle.x}px; border-radius: 50%; transition-duration: ${positionInterval * 2}ms;`}
		></div>
	{/each}
</div>

<style>
	.background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		filter: blur(100px);
	}
	.circle {
        transition-timing-function: linear;
		transition: top, left, width, height, background-color;
        top: 50%;
        left: 50%;
        height: 0;
        width: 0;
	}
</style>

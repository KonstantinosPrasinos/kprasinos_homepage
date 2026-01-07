<script lang="ts">
	import { onMount } from 'svelte';

    type CircleType = {
        size: number;
        x: number;
        y: number;
        color: string;
    };

	// Settings
	let randomRotation: number = 0;
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

	const generateBackground = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		const circleRadius = (Math.sqrt(width * width + height * height)) / 2;

		randomRotation = getRandomInt(0, 360);

		const circle1 = {
			x: -circleRadius,
			y: -circleRadius,
			size: circleRadius * 2,
			color: `radial-gradient(circle, ${colors[getRandomInt(0, colors.length - 1)]} 0%, var(--background-color) 100%)`
		};

		const circle2 = {
			x: width - circleRadius,
			y: -circleRadius,
			size: circleRadius * 2,
			color: `radial-gradient(circle, ${colors[getRandomInt(0, colors.length - 1)]} 0%, var(--background-color) 100%)`
		};

		const circle3 = {
			x: width / 2 - circleRadius,
			y: height / 2,
			size: circleRadius * 2,
			color: `radial-gradient(circle, ${colors[getRandomInt(0, colors.length - 1)]} 0%, var(--background-color) 100%)`
		};

		circles = [circle1, circle2, circle3];
	}

	const handleResize = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;

		const circleRadius = (Math.sqrt(width * width + height * height)) / 2;

		circles[0].x = -circleRadius;
		circles[0].y = -circleRadius;
		circles[0].size = circleRadius * 2;
		
		circles[1].x = width - circleRadius;
		circles[1].y = -circleRadius;
		circles[1].size = circleRadius * 2;

		circles[2].x = width / 2 - circleRadius;
		circles[2].y = height / 2;
		circles[2].size = circleRadius * 2;
	};

	onMount(() => {
		generateBackground();
	});
</script>

<svelte:window on:resize={handleResize} />

<div class="background" style={`transform: rotate(${randomRotation.toString()}deg)`}>
	{#each circles as circle}
		<div
			class="circle"
			style={`background: ${circle.color}; width: ${circle.size}px; height: ${circle.size}px; top: ${circle.y}px; left: ${circle.x}px;`}
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
        top: 50%;
        left: 50%;
        height: 0;
        width: 0;
		border-radius: 50%;
		position: absolute;
	}
</style>

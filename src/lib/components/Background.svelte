<script lang="ts">
    import { onMount } from 'svelte';

    let canvas: HTMLCanvasElement;

    const colors: string[] = [
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#16a085', 
        '#27ae60', '#2980b9', '#8e44ad', '#f1c40f', '#e67e22', 
        '#e74c3c', '#f39c12', '#d35400', '#c0392b'
    ];

    function getRandomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCssVar(name: string) {
        return getComputedStyle(document.body).getPropertyValue(name).trim() || 'transparent';
    }

    const draw = () => {
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const circleRadius = (Math.sqrt(width * width + height * height)) / 2;
        const bgColor = getCssVar('--background-color');

        const circles = [
            { x: 0, y: 0 },                    // Top-Left
            { x: width, y: 0 },                // Top-Right
            { x: width / 2, y: height }    // Center
        ];

        circles.forEach(circle => {
            const color = colors[getRandomInt(0, colors.length - 1)];

            
            const g = ctx.createRadialGradient(
                circle.x, circle.y, 0,
                circle.x, circle.y, circleRadius 
            );

            g.addColorStop(0, color);
            g.addColorStop(1, bgColor); // Fade into background color

            ctx.fillStyle = g;
            
            // Move to the position and draw
            ctx.beginPath();
            ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
            ctx.fill();
        });
    };

    onMount(() => {
        requestAnimationFrame(draw);
    });
</script>

<svelte:window />

<canvas 
    bind:this={canvas}
></canvas>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
		filter: blur(100px);
        z-index: -1;
        /* Blur is still needed to smooth the gradients, but it's faster on one element */
        /* filter: blur(50px);  */
    }
</style>
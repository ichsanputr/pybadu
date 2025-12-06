<template>
    <div class="h-full w-full p-2 relative">
        <Line v-if="chartData.datasets[0].data.length > 0" :data="chartData" :options="chartOptions" />
        <div v-else class="flex flex-col items-center justify-center h-full text-gray-400">
            <Icon icon="ph:chart-line" class="w-12 h-12 mb-2 opacity-50" />
            <p class="text-center text-sm">Print numbers to plot them.<br />Example: <code
                    class="bg-gray-200 dark:bg-gray-700 px-1 rounded">print(10)</code></p>
        </div>
    </div>
</template>

<script setup>
import { computed, defineProps } from 'vue'
import { Line } from 'vue-chartjs'
import { Icon } from '@iconify/vue'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
)

const props = defineProps({
    dataPoints: {
        type: Array,
        required: true
    },
    theme: {
        type: String,
        required: true
    }
})

const chartData = computed(() => {
    return {
        labels: props.dataPoints.map((_, index) => index),
        datasets: [
            {
                label: 'Series 1',
                backgroundColor: props.theme === 'light' ? '#3b82f6' : '#60a5fa',
                borderColor: props.theme === 'light' ? '#1d6fa5' : '#60a5fa',
                borderWidth: 1.5,
                data: props.dataPoints,
                tension: 0, // straight line like Thonny
                fill: false,
                pointRadius: 0 // hide points (Thonny does this)
            }
        ]
    }
})

const chartOptions = computed(() => {
    const isDark = props.theme !== 'light'
    const gridColor = isDark ? '#374151' : '#ccc'
    const textColor = isDark ? '#d1d5db' : '#666'

    return {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,

        scales: {
            x: {
                display: false // Thonny hides X-axis completely
            },
            y: {
                display: true, // Thonny shows horizontal gridlines
                ticks: {
                    color: textColor,
                    font: { size: 10 }
                },
                grid: {
                    color: gridColor,   // Grey dotted lines like Thonny
                    borderDash: [3, 3]
                }
            }
        },

        plugins: {
            legend: { display: false } // Thonny hides legend for single series
        },

        elements: {
            line: { borderJoinStyle: "round" },
            point: { radius: 0 }
        }
    }
})
</script>

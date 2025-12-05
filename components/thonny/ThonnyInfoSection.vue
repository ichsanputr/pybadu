<template>
    <section class="py-16 px-4 bg-gray-50">
        <div class="max-w-6xl mx-auto">
            <!-- Title -->
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                    {{ title }}
                </h1>
            </div>

            <!-- Description paragraphs -->
            <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700">
                <p v-for="(paragraph, index) in paragraphs" :key="index" class="text-base md:text-lg leading-relaxed"
                    v-html="paragraph">
                </p>

                <!-- Features section -->
                <div v-if="featuresTitle && features.length > 0">
                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 mt-8 mb-4">{{ featuresTitle }}</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li v-for="(feature, index) in features" :key="index">{{ feature }}</li>
                    </ul>
                </div>

                <!-- Custom slot for additional content -->
                <slot></slot>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        default: 'Online Thonny IDE - Try on Browser'
    },
    paragraphs: {
        type: Array,
        default: () => [
            'Thonny is a beginner-friendly Python IDE designed specifically for learning programming. Our online version brings the simplicity and power of Thonny directly to your browser, requiring no installation or setup. With its clean interface and helpful features like variable inspection and step-by-step execution visualization, Thonny Online makes learning Python easier and more intuitive than ever before.',
            'This online IDE comes with <strong>Python 3.11</strong> powered by Pyodide WebAssembly technology, providing a complete Python environment that runs entirely in your browser. The interface features a two-panel layout with the code editor on top and an interactive shell below, just like the desktop Thonny application. You can write, run, and debug Python code while watching variables update in real-time in the Variables panel.',
            'Whether you\'re taking your first steps in programming or teaching Python to others, Thonny Online provides a distraction-free environment focused on learning fundamentals. The variable inspector helps you understand how your code affects data, while the interactive shell lets you experiment with Python commands instantly.'
        ]
    },
    featuresTitle: {
        type: String,
        default: 'Perfect For'
    },
    features: {
        type: Array,
        default: () => [
            'Students learning Python programming for the first time',
            'Teachers conducting interactive Python coding lessons',
            'Beginners practicing basic programming concepts and syntax',
            'Anyone wanting a simple, distraction-free Python environment',
            'Quick Python experiments and code testing without installation'
        ]
    }
})
</script>

<style scoped>
/* Light theme specific styles for info section */
section {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}
</style>

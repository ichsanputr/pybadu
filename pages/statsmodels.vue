<template>
    <div>
        <!-- Editor Area -->
        <div class="sm:min-h-screen">
            <CodeEditor libraryName="Statsmodels" :theme="theme" :files="files" :activeFileId="activeFileId"
                :code="currentFileContent" :output="output" :isLoading="isLoading" :pyodideReady="pyodideReady"
                :monacoTheme="monacoTheme" :examples="examples" :assets="assets" :assetsUploading="assetsUploading"
                @update:code="updateCurrentFile" @toggleTheme="toggleTheme" @runCode="runCode" @clearCode="clearCode"
                @clearOutput="clearOutput" @loadExample="loadExample" @newFile="createNewFile" @selectFile="selectFile"
                @deleteFile="deleteFile" @renameFile="renameFile" @saveToStorage="saveToStorage"
                @uploadAssets="uploadAssets" @deleteAsset="deleteAsset" @downloadAsset="downloadAsset"
                @refreshAssets="refreshAssets" @createAssetFolder="createAssetFolder" />
        </div>

        <!-- Information Section -->
        <LibraryInfoSection>
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                    Online Statsmodels Compiler
                </h1>

                <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
                    <p class="text-base md:text-lg leading-relaxed">
                        Statsmodels is a powerful Python module that provides classes and functions for the estimation
                        of many
                        different statistical models, as well as for conducting statistical tests and statistical data
                        exploration.
                        It complements SciPy's statistics module with descriptive statistics, estimation and inference
                        for
                        statistical models.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Our online Statsmodels compiler empowers you to perform complex statistical analysis directly in
                        your browser.
                        Powered by Pyodide, it runs a full Python environment with <strong>Statsmodels</strong>,
                        <strong>NumPy</strong>, <strong>Pandas</strong>, and <strong>Matplotlib</strong> pre-installed.
                        You can
                        perform Linear Regression (OLS), Generalized Linear Models (GLM), Time Series Analysis (ARIMA,
                        etc.),
                        and various robust statistical tests without setting up a local environment.
                    </p>

                    <p class="text-base md:text-lg leading-relaxed">
                        Whether you are a student learning econometrics, a researcher needing a quick statistical check,
                        or a
                        data scientist exploring datasets, this tool offers a seamless experience. Support for file
                        uploads means
                        you can bring your own CSV datasets and analyze them instantly.
                    </p>

                    <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Key Features</h3>
                    <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
                        <li>Linear regression models (OLS, WLS, GLS)</li>
                        <li>Generalized linear models (GLM) for various families (Binomial, Poisson, etc.)</li>
                        <li>Time Series Analysis (ARIMA, VAR, State Space Models)</li>
                        <li>Statistical tests (t-tests, F-tests, non-parametric tests)</li>
                        <li>Plotting functions for goodness-of-fit and diagnostics</li>
                    </ul>
                </div>
            </div>
        </LibraryInfoSection>

        <!-- Footer -->
        <AppFooter />
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
    name: 'StatsmodelsPlayground'
})

definePageMeta({
    layout: 'library'
})

useHead({
    title: 'Online Statsmodels Compiler',
    meta: [
        { name: 'description', content: 'Run Statsmodels code online. Perform statistical modeling, hypothesis testing, and data exploration directly in your browser with Pyodide.' },
        { name: 'keywords', content: 'statsmodels online, python statistics, OLS regression online, GLM, time series analysis, python compiler, pyodide' },
        { property: 'og:title', content: 'Online Statsmodels Compiler' },
        { property: 'og:description', content: 'Perform statistical analysis and modeling with Statsmodels in your browser.' },
        { property: 'og:type', content: 'website' }
    ]
})

// Example code snippets
const examples = [
    {
        title: "Linear Regression (OLS)",
        code: `import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt

# Generate synthetic data
np.random.seed(42)
nsample = 100
x = np.linspace(0, 10, nsample)
X = np.column_stack((x, x**2))
beta = np.array([1, 0.1, 10])
e = np.random.normal(size=nsample)

# Add constant (intercept)
X = sm.add_constant(X)
y = np.dot(X, beta) + e

# Fit OLS model
model = sm.OLS(y, X)
results = model.fit()

# Print summary
print(results.summary())

# Plot results
fig, ax = plt.subplots(figsize=(10, 6))
ax.plot(x, y, 'o', label="Data")
ax.plot(x, results.fittedvalues, 'r--', label="OLS Fit")
ax.legend(loc="best")
ax.set_title('OLS Regression')
plt.show()`
    },
    {
        title: "Logistic Regression (GLM)",
        code: `import statsmodels.api as sm
import numpy as np
import pandas as pd

# Generate synthetic binary data
np.random.seed(123)
nobs = 1000
X = np.random.normal(size=(nobs, 2))
X = sm.add_constant(X) # Intercept
beta = [1, 0.5, -0.5]
lin_pred = np.dot(X, beta)
prob = 1 / (1 + np.exp(-lin_pred)) # Sigmoid
y = np.random.binomial(1, prob)

# Fit GLM (Binomial family)
model_glm = sm.GLM(y, X, family=sm.families.Binomial())
result_glm = model_glm.fit()

print("GLM Summary:")
print(result_glm.summary())

# Odds Ratios
print("\\nOdds Ratios:")
print(np.exp(result_glm.params))`
    },
    {
        title: "Time Series (ARIMA)",
        code: `import numpy as np
import pandas as pd
import statsmodels.api as sm
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA

# Generate an AR(1) process
np.random.seed(42)
ar_params = np.array([0.75])
ma_params = np.array([])
n_samples = 200

# statsmodels generate_sample requires (1, -ar_params) layout for AR
ar = np.r_[1, -ar_params]
ma = np.r_[1, ma_params]
y = sm.tsa.arma_generate_sample(ar, ma, n_samples)

# Create a pandas series with dates
dates = pd.date_range('2024-01-01', periods=n_samples, freq='D')
y_series = pd.Series(y, index=dates)

# Fit ARIMA(1, 0, 0)
model = ARIMA(y_series, order=(1, 0, 0))
res = model.fit()

print(res.summary())

# Forecast
forecast_steps = 20
forecast = res.get_forecast(steps=forecast_steps)
mean_forecast = forecast.predicted_mean
conf_int = forecast.conf_int()

# Plot
plt.figure(figsize=(12, 6))
plt.plot(y_series, label='Observed')
plt.plot(mean_forecast.index, mean_forecast, color='r', label='Forecast')
plt.fill_between(mean_forecast.index, 
                 conf_int.iloc[:, 0], 
                 conf_int.iloc[:, 1], 
                 color='pink', alpha=0.3)
plt.legend()
plt.title('ARIMA(1,0,0) Forecast')
plt.show()`
    },
    {
        title: "Nonparametric (Lowess)",
        code: `import numpy as np
import statsmodels.api as sm
import matplotlib.pyplot as plt

# Generate noisy non-linear data
np.random.seed(10)
x = np.linspace(0, 2 * np.pi, 100)
y = np.sin(x) + np.random.normal(0, 0.2, 100)

# Apply Lowess smoothing (Locally Weighted Scatterplot Smoothing)
lowess = sm.nonparametric.lowess
z = lowess(y, x, frac=0.2) 
# frac is the fraction of data used when estimating each y-value.

# Plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, 'o', label='Noisy Data', alpha=0.5)
plt.plot(z[:, 0], z[:, 1], 'r-', linewidth=3, label='Lowess Smoothing')
plt.legend()
plt.title('Lowess Smoothing of Sine Wave')
plt.grid(True, alpha=0.3)
plt.show()

print("Lowess run complete. Smoothed " + str(len(z)) + " points.")`
    }
]

const defaultCode = examples[0].code // Defaults to OLS

// Use the shared composable
const {
    files,
    activeFileId,
    output,
    isLoading,
    pyodideReady,
    theme,
    loaderVisible,
    currentFileContent,
    monacoTheme,
    updateCurrentFile,
    createNewFile,
    selectFile,
    deleteFile,
    renameFile,
    saveToStorage,
    toggleTheme,
    runCode,
    clearCode,
    clearOutput,
    loadExample,
    initializePyodide,
    cleanupWorker,
    assets,
    assetsUploading,
    refreshAssets,
    uploadAssets,
    deleteAsset,
    downloadAsset,
    createAssetFolder
} = useLibraryPlayground({
    packageName: 'statsmodels',
    defaultCode: examples[0].code,
    examples,
    additionalPackages: ['pandas', 'numpy', 'scipy', 'matplotlib', 'patsy'],
    setupCode: `
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import statsmodels.api as sm

# Set matplotlib backend for web
matplotlib.use('Agg')

# Configure matplotlib
plt.rcParams['figure.facecolor'] = 'white'
plt.rcParams['axes.facecolor'] = 'white'
plt.rcParams['figure.dpi'] = 100
  `
})

onMounted(async () => {
    await initializePyodide()
})

onBeforeUnmount(() => {
    cleanupWorker()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>

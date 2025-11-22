<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
      <MatplotlibEditor 
        libraryName="Scikit-learn"
        :theme="theme" 
        :files="files"
        :activeFileId="activeFileId"
        :code="currentFileContent"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        @update:code="updateCurrentFile"
        @toggleTheme="toggleTheme"
        @runCode="runCode" 
        @clearCode="clearCode"
        @clearOutput="clearOutput"
        @loadExample="loadExample"
        @newFile="createNewFile"
        @selectFile="selectFile"
        @deleteFile="deleteFile" />

      <!-- Loading Transition (client-only) -->
      <ClientOnly>
        <transition name="fade">
          <div v-if="loaderVisible"
            class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#18181b] transition-colors duration-300">
            <Icon icon="ph:spinner" class="w-10 h-10 text-python-yellow-500 animate-spin" />
          </div>
        </transition>
      </ClientOnly>
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 mb-4">
          <Icon icon="simple-icons:scikitlearn" class="w-8 h-8 text-white" />
        </div>
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          About Scikit-learn Playground
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Build and train machine learning models with simple and efficient tools for predictive data analysis.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:brain" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">ML Algorithms</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Classification & regression models</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:circles-three" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Clustering</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Unsupervised learning methods</p>
          </div>
        </AnimatedCard>
        
        <AnimatedCard>
          <div class="text-center">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <Icon icon="ph:chart-line" class="w-7 h-7 text-white" />
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">Model Evaluation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Metrics & cross-validation</p>
          </div>
        </AnimatedCard>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '#app'
import MatplotlibEditor from '~/components/matplotlib/MatplotlibEditor.vue'
import LibraryInfoSection from '~/components/LibraryInfoSection.vue'
import AnimatedCard from '~/components/ui/AnimatedCard.vue'
import AppFooter from '~/components/AppFooter.vue'
import { Icon } from '@iconify/vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'ScikitLearnPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Scikit-learn Playground - Pybadu',
  meta: [
    { name: 'description', content: 'Interactive Scikit-learn machine learning playground powered by Pyodide WebAssembly' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Linear Regression",
    code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data
np.random.seed(42)
X = np.array([[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]])
y = 2 * X.flatten() + 1 + np.random.randn(10) * 0.5

# Create and train the model
model = LinearRegression()
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)

# Print results
print("Linear Regression Results:")
print(f"Coefficient: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print(f"R² Score: {r2_score(y, y_pred):.4f}")
print(f"MSE: {mean_squared_error(y, y_pred):.4f}")

print("\\nPredictions for first 5 samples:")
for i in range(5):
    print(f"X={X[i][0]:.1f}, Actual={y[i]:.2f}, Predicted={y_pred[i]:.2f}")`
  },
  {
    title: "Classification with Logistic Regression",
    code: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# Generate sample data
np.random.seed(42)
X = np.random.randn(100, 2)
y = (X[:, 0] + X[:, 1] > 0).astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train model
model = LogisticRegression()
model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Results
print("Logistic Regression Classification:")
print(f"Training Accuracy: {model.score(X_train, y_train):.4f}")
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\\nClassification Report:")
print(classification_report(y_test, y_pred))`
  },
  {
    title: "K-Means Clustering",
    code: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

# Generate sample data
np.random.seed(42)
X = np.vstack([
    np.random.randn(30, 2) + [2, 2],
    np.random.randn(30, 2) + [-2, -2],
    np.random.randn(30, 2) + [2, -2]
])

# Perform clustering
n_clusters = 3
kmeans = KMeans(n_clusters=n_clusters, random_state=42)
labels = kmeans.fit_predict(X)

# Results
print(f"K-Means Clustering (k={n_clusters}):")
print(f"Silhouette Score: {silhouette_score(X, labels):.4f}")
print(f"\\nCluster Centers:")
for i, center in enumerate(kmeans.cluster_centers_):
    print(f"Cluster {i}: [{center[0]:.2f}, {center[1]:.2f}]")

print(f"\\nSamples per cluster:")
unique, counts = np.unique(labels, return_counts=True)
for cluster, count in zip(unique, counts):
    print(f"Cluster {cluster}: {count} samples")`
  },
  {
    title: "Decision Tree Classifier",
    code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix

# Generate sample data
np.random.seed(42)
X = np.random.randn(150, 4)
y = (X[:, 0] + X[:, 1] > X[:, 2] + X[:, 3]).astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train model
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)

# Predictions
y_pred = dt.predict(X_test)

# Results
print("Decision Tree Classifier:")
print(f"Training Accuracy: {dt.score(X_train, y_train):.4f}")
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print(f"Tree Depth: {dt.get_depth()}")
print(f"Number of Leaves: {dt.get_n_leaves()}")
print("\\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))`
  },
  {
    title: "Random Forest",
    code: `import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Generate sample data
np.random.seed(42)
X = np.random.randn(200, 5)
y = ((X[:, 0] + X[:, 1]) > (X[:, 2] + X[:, 3])).astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# Train Random Forest
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
rf.fit(X_train, y_train)

# Predictions
y_pred = rf.predict(X_test)

# Results
print("Random Forest Classifier:")
print(f"Number of trees: {rf.n_estimators}")
print(f"Training Accuracy: {rf.score(X_train, y_train):.4f}")
print(f"Test Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\\nFeature Importances:")
for i, importance in enumerate(rf.feature_importances_):
    print(f"Feature {i}: {importance:.4f}")`
  },
  {
    title: "Principal Component Analysis",
    code: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Generate sample data
np.random.seed(42)
X = np.random.randn(100, 5)

# Standardize features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Apply PCA
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)

# Results
print("Principal Component Analysis:")
print(f"Original dimensions: {X.shape[1]}")
print(f"Reduced dimensions: {X_pca.shape[1]}")
print(f"\\nExplained Variance Ratio:")
for i, var in enumerate(pca.explained_variance_ratio_):
    print(f"PC{i+1}: {var:.4f} ({var*100:.2f}%)")
print(f"\\nTotal Variance Explained: {pca.explained_variance_ratio_.sum():.4f}")
print(f"({pca.explained_variance_ratio_.sum()*100:.2f}%)")

print(f"\\nTransformed data shape: {X_pca.shape}")`
  }
]

const defaultCode = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Generate sample data
np.random.seed(42)
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

# Create and train the model
model = LinearRegression()
model.fit(X, y)

# Make predictions
y_pred = model.predict(X)

# Print results
print("Linear Regression Example:")
print(f"Coefficient: {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print(f"R² Score: {r2_score(y, y_pred):.4f}")
print("\\nPredictions:")
for i in range(len(X)):
    print(f"X={X[i][0]}, y={y[i]}, predicted={y_pred[i]:.2f}")`

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
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide
} = useLibraryPlayground({
  packageName: 'scikit-learn',
  defaultCode,
  examples,
  additionalPackages: ['numpy'],
  setupCode: `
import numpy as np
from sklearn import *
  `
})

onMounted(async () => {
  await initializePyodide()
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


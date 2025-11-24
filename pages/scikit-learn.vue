<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
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
        @deleteFile="deleteFile"
        @renameFile="renameFile"
        @saveToStorage="saveToStorage" />

    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Scikit-learn Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            Scikit-learn is Python's most accessible and widely-used machine learning library, offering simple yet powerful 
            tools for predictive data analysis. As the de facto standard for machine learning in Python, Scikit-learn is 
            used by Fortune 500 companies, leading research institutions, and individual developers worldwide. Our dedicated 
            online Scikit-learn compiler provides a complete browser environment for building, training, and evaluating 
            machine learning models without any installation or setup requirements. The library's consistent API design 
            makes it easy to learn and apply various machine learning algorithms to solve real-world problems.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>Scikit-learn 1.7+</strong> with <strong>NumPy</strong>, powered by Pyodide 
            WebAssembly technology, providing instant access to classification, regression, clustering, and dimensionality 
            reduction algorithms. The platform supports both supervised learning with algorithms for labeled data and 
            unsupervised learning for pattern discovery. You can perform model selection using cross-validation and grid 
            search for hyperparameter tuning, apply preprocessing techniques like data scaling and normalization, use 
            feature selection tools, experiment with ensemble methods including Random Forests and Gradient Boosting, and 
            evaluate models using comprehensive performance metrics such as accuracy, precision, recall, and F1-score. 
            You can also upload and use files or folders directly in your code for machine learning workflows and data processing. 
            This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our interactive examples cover a wide range of machine learning algorithms including Linear Regression, 
            Logistic Regression for classification, K-Means Clustering, Decision Trees, Random Forest ensemble learning, 
            Support Vector Machines, and Principal Component Analysis (PCA). Each example demonstrates key concepts like 
            training and evaluating models, regression analysis and prediction, clustering and pattern recognition, feature 
            engineering and selection, cross-validation techniques, and handling overfitting and underfitting. The examples 
            are designed to help you understand both the theory and practical implementation of machine learning algorithms.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Target Audience</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Machine learning beginners and students learning fundamentals</li>
            <li>Data scientists prototyping models before production deployment</li>
            <li>Researchers experimenting with different algorithms and techniques</li>
            <li>Educators teaching machine learning courses with hands-on examples</li>
            <li>Developers building predictive applications and AI features</li>
            <li>Anyone interested in understanding and applying ML algorithms</li>
          </ul>
        </div>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useHead } from '#app'
import CodeEditor from '~/components/CodeEditor.vue'
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
  title: 'Online Scikit-learn Compiler',
  meta: [
    { name: 'description', content: 'Build machine learning models with Scikit-learn in your browser. Classification, regression, clustering powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'scikit-learn, machine learning, sklearn, python ml, online compiler, pyodide, ml online, data science' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online Scikit-learn Compiler' },
    { property: 'og:description', content: 'Build ML models with Scikit-learn in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online Scikit-learn Compiler' },
    { name: 'twitter:description', content: 'Build machine learning models with Scikit-learn online' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Linear Regression",
    code: `# Generate sample data
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
    code: `# Generate sample data
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
    code: `# Generate sample data
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
    code: `# Generate sample data
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
    code: `# Generate sample data
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
    code: `# Generate sample data
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

const defaultCode = `# Generate sample data
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
  renameFile,
  saveToStorage,
  toggleTheme,
  runCode,
  clearCode,
  clearOutput,
  loadExample,
  initializePyodide,
  cleanupWorker
} = useLibraryPlayground({
  packageName: 'scikit-learn',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import r2_score, mean_squared_error, accuracy_score, classification_report, confusion_matrix, silhouette_score
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
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


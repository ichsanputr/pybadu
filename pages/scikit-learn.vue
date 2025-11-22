<template>
  <div>
    <!-- Editor Area -->
    <div class="min-h-screen">
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
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          About Scikit-learn Playground
        </h2>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-lg leading-relaxed">
            Scikit-learn is Python's most accessible machine learning library, offering simple and efficient tools for 
            predictive data analysis. Our dedicated Scikit-learn playground provides a complete browser environment for 
            building, training, and evaluating machine learning models without any installation or setup requirements.
          </p>
          
          <p class="text-lg leading-relaxed">
            This compiler includes <strong>Scikit-learn 1.7+</strong> with <strong>NumPy</strong>, providing access to 
            classification, regression, clustering, and dimensionality reduction algorithms. Whether you're learning machine 
            learning fundamentals or prototyping ML models, our playground offers instant execution with comprehensive examples.
          </p>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Machine Learning Capabilities</h3>
          
          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li><strong>Supervised Learning:</strong> Classification and regression algorithms for labeled data</li>
            <li><strong>Unsupervised Learning:</strong> Clustering and dimensionality reduction for pattern discovery</li>
            <li><strong>Model Selection:</strong> Cross-validation, grid search, and hyperparameter tuning</li>
            <li><strong>Preprocessing:</strong> Data scaling, normalization, and feature engineering</li>
            <li><strong>Feature Selection:</strong> Tools for selecting the most relevant features</li>
            <li><strong>Ensemble Methods:</strong> Random Forests, Gradient Boosting, and voting classifiers</li>
            <li><strong>Model Evaluation:</strong> Comprehensive metrics for assessing model performance</li>
          </ul>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Algorithms Covered</h3>

          <p class="text-lg leading-relaxed">
            Explore a wide range of machine learning algorithms through our interactive examples:
          </p>

          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li><strong>Linear Regression:</strong> Predict continuous values and understand linear relationships</li>
            <li><strong>Logistic Regression:</strong> Binary and multiclass classification problems</li>
            <li><strong>K-Means Clustering:</strong> Group similar data points without labels</li>
            <li><strong>Decision Trees:</strong> Interpretable models for classification and regression</li>
            <li><strong>Random Forest:</strong> Ensemble learning with multiple decision trees</li>
            <li><strong>Support Vector Machines:</strong> Powerful classification with maximum-margin hyperplanes</li>
            <li><strong>Principal Component Analysis (PCA):</strong> Dimensionality reduction and feature extraction</li>
          </ul>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Learning Topics</h3>

          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Training and evaluating classification models</li>
            <li>Regression analysis and prediction</li>
            <li>Clustering and pattern recognition</li>
            <li>Feature engineering and selection</li>
            <li>Model evaluation metrics (accuracy, precision, recall, F1-score)</li>
            <li>Cross-validation techniques</li>
            <li>Handling overfitting and underfitting</li>
          </ul>

          <h3 class="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Ideal For</h3>

          <ul class="list-disc list-inside space-y-2 text-lg ml-4">
            <li>Machine learning beginners and students</li>
            <li>Data scientists prototyping models</li>
            <li>Researchers experimenting with algorithms</li>
            <li>Educators teaching machine learning courses</li>
            <li>Developers building predictive applications</li>
            <li>Anyone interested in understanding ML fundamentals</li>
          </ul>
        </div>
      </div>
    </LibraryInfoSection>

    <AppFooter />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
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
  renameFile,
  saveToStorage,
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


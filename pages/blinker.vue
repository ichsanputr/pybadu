<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="blinker"
        :theme="theme" 
        :files="files"
        :activeFileId="activeFileId"
        :code="currentFileContent"
        :output="output" 
        :isLoading="isLoading" 
        :pyodideReady="pyodideReady"
        :monacoTheme="monacoTheme"
        :examples="examples"
        :assets="assets"
        :assetsUploading="assetsUploading"
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
        @saveToStorage="saveToStorage"
        @uploadAssets="uploadAssets"
        @deleteAsset="deleteAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online blinker Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            blinker is a fast, simple object-to-object and broadcast signaling system for Python that provides a powerful 
            event dispatching mechanism. As part of the Pallets Community Ecosystem, blinker allows any number of interested 
            parties to subscribe to events, or "signals", enabling loose coupling between components in your application. This 
            makes it perfect for implementing the observer pattern, event-driven architectures, and decoupled communication 
            between different parts of your codebase.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>blinker</strong> with full support for signal creation, receiver subscription, 
            sender-specific connections, and broadcast signaling, all powered by Pyodide WebAssembly technology. The platform 
            supports all core blinker features including creating named signals for different events, connecting receivers 
            (functions or methods) to signals, sending signals with optional data payloads, filtering receivers by specific 
            senders, connecting and disconnecting receivers dynamically, and using signal namespaces for organizing events. 
            You can also upload and use files or folders directly in your code for event-driven application workflows. This 
            compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential signal-based programming techniques including basic signal 
            creation and connection, sending signals with data, connecting receivers to specific senders, multiple receivers 
            for the same signal, disconnecting receivers, signal return values, and using signals in class-based architectures. 
            You'll also learn how to implement event-driven patterns, create loosely coupled components, and build reactive 
            systems commonly used in web frameworks, GUI applications, and distributed systems.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Web developers building event-driven applications and frameworks</li>
            <li>Application developers implementing observer patterns and loose coupling</li>
            <li>Framework developers creating extensible plugin systems</li>
            <li>Developers building reactive and event-driven architectures</li>
            <li>System integrators connecting components without tight dependencies</li>
            <li>Anyone needing fast, simple signaling between objects in Python</li>
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
import AppFooter from '~/components/AppFooter.vue'
import { useLibraryPlayground } from '~/composables/useLibraryPlayground'

defineOptions({
  name: 'BlinkerPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online blinker Compiler',
  meta: [
    { name: 'description', content: 'Create event-driven applications with blinker signals in your browser. Fast object-to-object and broadcast signaling powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'blinker, signals, event dispatching, observer pattern, event-driven, python signals, online compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online blinker Compiler' },
    { property: 'og:description', content: 'Create event-driven applications with blinker signals in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online blinker Compiler' },
    { name: 'twitter:description', content: 'Create event-driven applications with blinker signals in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Basic Signal Connection",
    code: `# Basic signal creation and connection
from blinker import signal

# Create a signal
started = signal('round-started')

# Define a receiver function
def each(round):
    print(f"Round {round}!")

# Connect the receiver to the signal
started.connect(each)

# Send the signal
for round in range(1, 4):
    started.send(round)

print("\\nAll rounds completed!")`
  },
  {
    title: "Signal with Sender Filtering",
    code: `# Connect receivers to specific senders
from blinker import signal

# Create a signal
started = signal('round-started')

# Receiver for all rounds
def each(round):
    print(f"Round {round}!")

# Receiver only for round 2
def round_two(round):
    print("This is round two!")

# Connect receivers
started.connect(each)
started.connect(round_two, sender=2)

# Send signals
for round in range(1, 4):
    started.send(round)

print("\\nDone!")`
  },
  {
    title: "Signal with Data Payload",
    code: `# Send signals with additional data
from blinker import signal

# Create a signal
user_created = signal('user-created')

# Receiver that accepts data
def send_welcome_email(user_data):
    name = user_data['name']
    email = user_data['email']
    print(f"Sending welcome email to {name} at {email}")

def log_user_creation(user_data):
    print(f"User created: {user_data['name']} (ID: {user_data['id']})")

# Connect receivers
user_created.connect(send_welcome_email)
user_created.connect(log_user_creation)

# Send signal with data
user_data = {
    'id': 1,
    'name': 'Alice',
    'email': 'alice@example.com'
}
user_created.send(user_data)`
  },
  {
    title: "Multiple Receivers",
    code: `# Multiple receivers for the same signal
from blinker import signal

# Create a signal
order_placed = signal('order-placed')

# Multiple receivers
def update_inventory(order):
    print(f"Updating inventory for order {order['id']}")

def send_confirmation(order):
    print(f"Sending confirmation email for order {order['id']}")

def calculate_shipping(order):
    print(f"Calculating shipping for order {order['id']}")

def notify_warehouse(order):
    print(f"Notifying warehouse about order {order['id']}")

# Connect all receivers
order_placed.connect(update_inventory)
order_placed.connect(send_confirmation)
order_placed.connect(calculate_shipping)
order_placed.connect(notify_warehouse)

# Send signal - all receivers will be called
order = {'id': 12345, 'items': ['Laptop', 'Mouse'], 'total': 1299.99}
order_placed.send(order)`
  },
  {
    title: "Disconnecting Receivers",
    code: `# Connect and disconnect receivers
from blinker import signal

# Create a signal
event = signal('test-event')

# Define receivers
def receiver_one(data):
    print("Receiver one called")

def receiver_two(data):
    print("Receiver two called")

def receiver_three(data):
    print("Receiver three called")

# Connect all receivers
event.connect(receiver_one)
event.connect(receiver_two)
event.connect(receiver_three)

print("All receivers connected:")
event.send("test")

# Disconnect one receiver
event.disconnect(receiver_two)
print("\\nAfter disconnecting receiver_two:")
event.send("test")

# Disconnect all receivers
event.disconnect_all()
print("\\nAfter disconnecting all:")
event.send("test")
print("(No output - all receivers disconnected)")`
  },
  {
    title: "Signal Return Values",
    code: `# Collect return values from receivers
from blinker import signal

# Create a signal
process_data = signal('process-data')

# Receivers that return values
def multiply_by_two(data):
    return data * 2

def add_ten(data):
    return data + 10

def square(data):
    return data ** 2

# Connect receivers
process_data.connect(multiply_by_two)
process_data.connect(add_ten)
process_data.connect(square)

# Send signal and collect results
results = process_data.send(5)

print("Processing data: 5")
print("\\nResults from receivers:")
for receiver, result in results:
    print(f"  {receiver.__name__}: {result}")`
  },
  {
    title: "Class-Based Signal Usage",
    code: `# Using signals with classes
from blinker import signal

# Create signals
user_registered = signal('user-registered')
user_logged_in = signal('user-logged-in')

# Class that sends signals
class UserManager:
    def register_user(self, username, email):
        user = {'username': username, 'email': email}
        # Send signal with the class instance as sender
        user_registered.send(self, user=user)
        print(f"User {username} registered")
        return user
    
    def login_user(self, username):
        user_registered.send(self, username=username)
        print(f"User {username} logged in")

# Receivers
def send_welcome_email(sender, user):
    print(f"  → Sending welcome email to {user['email']}")

def log_registration(sender, user):
    print(f"  → Logging registration: {user['username']}")

def notify_admin(sender, username):
    print(f"  → Notifying admin about login: {username}")

# Connect receivers
user_registered.connect(send_welcome_email)
user_registered.connect(log_registration)
user_logged_in.connect(notify_admin)

# Use the class
manager = UserManager()
print("Registering user:")
manager.register_user('alice', 'alice@example.com')
print("\\nUser login:")
manager.login_user('alice')`
  }
]

const defaultCode = `# Basic signal example
from blinker import signal

# Create a signal
started = signal('round-started')

# Define receiver functions
def each(round):
    print(f"Round {round}!")

def round_two(round):
    print("This is round two!")

# Connect receivers
started.connect(each)
started.connect(round_two, sender=2)

# Send signals
for round in range(1, 4):
    started.send(round)

print("\\nAll rounds completed!")`

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
  assets,
  assetsUploading,
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
  refreshAssets,
  uploadAssets,
  deleteAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'blinker',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from blinker import signal
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


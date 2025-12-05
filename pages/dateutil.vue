<template>
  <div>
    <!-- Editor Area -->
    <div class="sm:min-h-screen">
      <CodeEditor 
        libraryName="python-dateutil"
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
        @deleteAsset="deleteAsset" @downloadAsset="downloadAsset"
        @refreshAssets="refreshAssets"
        @createAssetFolder="createAssetFolder" />
    </div>

    <!-- Information Section -->
    <LibraryInfoSection>
      <div class="text-center mb-12">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Online Python Dateutil Compiler
        </h1>
        
        <div class="max-w-4xl mx-auto text-left space-y-6 text-gray-700 dark:text-gray-300">
          <p class="text-base md:text-lg leading-relaxed">
            python-dateutil provides powerful extensions to the standard Python datetime module, offering advanced date and 
            time manipulation capabilities that go far beyond what's available in the standard library. As one of the most 
            widely used date/time libraries in Python, dateutil makes it easy to parse dates from strings, calculate relative 
            deltas, work with timezones, and handle complex date arithmetic. Whether you're building applications that need 
            flexible date parsing, recurring event calculations, or timezone-aware datetime handling, dateutil provides the 
            tools you need.
          </p>
          
          <p class="text-base md:text-lg leading-relaxed">
            This compiler includes <strong>python-dateutil</strong> with full support for date parsing, relative deltas, 
            recurrence rules, timezone handling, and Easter date calculations, all powered by Pyodide WebAssembly technology. 
            The platform supports all core dateutil features including parsing dates from almost any string format, computing 
            relative deltas (next month, next year, last Monday, etc.), calculating dates based on flexible recurrence rules 
            using iCalendar specification, working with timezones including tzfile format and TZ environment strings, and 
            computing Easter Sunday dates for any year. You can also upload and use files or folders directly in your code 
            for date processing workflows. This compiler is online and completely free to use.
          </p>

          <p class="text-base md:text-lg leading-relaxed">
            Our comprehensive example collection covers essential date and time manipulation techniques including flexible date 
            parsing from strings, computing relative deltas between dates, using relativedelta for date arithmetic, working 
            with recurrence rules for recurring events, timezone conversions and handling, calculating Easter dates, and 
            finding specific dates like the next Friday the 13th. You'll also learn how to handle complex date calculations 
            commonly needed in calendar applications, scheduling systems, and data processing pipelines.
          </p>

          <h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Perfect For</h3>
          <ul class="list-disc list-inside space-y-2 text-base md:text-lg ml-4">
            <li>Application developers working with date and time calculations and parsing</li>
            <li>Data engineers processing time-series data and date-based filtering</li>
            <li>Web developers handling user input dates and timezone conversions</li>
            <li>Calendar and scheduling application developers building recurring events</li>
            <li>System integrators working with various date formats and timezones</li>
            <li>Anyone needing advanced date and time manipulation beyond Python's standard library</li>
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
  name: 'DateutilPlayground'
})

definePageMeta({
  layout: 'library'
})

useHead({
  title: 'Online Python Dateutil Compiler',
  meta: [
    { name: 'description', content: 'Parse dates, calculate relative deltas, and work with timezones using python-dateutil in your browser. Advanced date and time manipulation powered by Pyodide WebAssembly. No installation required.' },
    { name: 'keywords', content: 'python-dateutil, dateutil, date parsing, relativedelta, timezone, rrule, date arithmetic, online compiler, pyodide' },
    { name: 'author', content: 'Pybadu' },
    { property: 'og:title', content: 'Online python-dateutil Compiler' },
    { property: 'og:description', content: 'Parse dates, calculate relative deltas, and work with timezones using python-dateutil in your browser' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/pybadu.png' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Online python-dateutil Compiler' },
    { name: 'twitter:description', content: 'Parse dates, calculate relative deltas, and work with timezones using python-dateutil in your browser' },
    { name: 'twitter:image', content: '/pybadu.png' }
  ]
})

// Example code snippets
const examples = [
  {
    title: "Flexible Date Parsing",
    code: `# Parse dates from various string formats
from dateutil import parser
from datetime import datetime

# Various date string formats
date_strings = [
    "2024-03-15",
    "March 15, 2024",
    "15/03/2024",
    "2024-03-15 14:30:00",
    "Mar 15 2024 2:30 PM",
    "2024-03-15T14:30:00Z",
    "next Monday",
    "tomorrow",
    "yesterday"
]

print("Parsing various date formats:")
print("-" * 50)
for date_str in date_strings:
    try:
        parsed = parser.parse(date_str)
        print(f"{date_str:25} -> {parsed}")
    except Exception as e:
        print(f"{date_str:25} -> Error: {e}")`
  },
  {
    title: "Relative Deltas",
    code: `# Calculate relative deltas (next month, next year, etc.)
from dateutil.relativedelta import relativedelta
from datetime import datetime

today = datetime(2024, 3, 15)
print(f"Today: {today.strftime('%Y-%m-%d')}")
print()

# Next month
next_month = today + relativedelta(months=+1)
print(f"Next month: {next_month.strftime('%Y-%m-%d')}")

# Next year
next_year = today + relativedelta(years=+1)
print(f"Next year: {next_year.strftime('%Y-%m-%d')}")

# Next Monday
next_monday = today + relativedelta(weekday=0)  # 0 = Monday
print(f"Next Monday: {next_monday.strftime('%Y-%m-%d')}")

# Last day of current month
last_day = today + relativedelta(day=31)  # Will adjust to last day
print(f"Last day of month: {last_day.strftime('%Y-%m-%d')}")

# 2 months and 3 days from now
future = today + relativedelta(months=+2, days=+3)
print(f"2 months and 3 days: {future.strftime('%Y-%m-%d')}")`
  },
  {
    title: "Date Arithmetic with relativedelta",
    code: `# Calculate differences and perform date arithmetic
from dateutil.relativedelta import relativedelta
from datetime import datetime

date1 = datetime(2024, 1, 15)
date2 = datetime(2024, 6, 20)

# Calculate difference
diff = relativedelta(date2, date1)
print(f"Date 1: {date1.strftime('%Y-%m-%d')}")
print(f"Date 2: {date2.strftime('%Y-%m-%d')}")
print()
print("Difference:")
print(f"  Years: {diff.years}")
print(f"  Months: {diff.months}")
print(f"  Days: {diff.days}")
print(f"  Total days: {(date2 - date1).days}")

# Add relative delta
print()
print("Adding 1 year, 2 months, 5 days:")
result = date1 + relativedelta(years=+1, months=+2, days=+5)
print(f"  Result: {result.strftime('%Y-%m-%d')}")`
  },
  {
    title: "Recurrence Rules (rrule)",
    code: `# Generate recurring dates using rrule
from dateutil.rrule import rrule, DAILY, WEEKLY, MONTHLY, YEARLY, MO, TU, WE, TH, FR
from datetime import datetime

start_date = datetime(2024, 3, 1)

# Daily for 10 occurrences
print("Daily for 10 days:")
daily_dates = list(rrule(DAILY, count=10, dtstart=start_date))
for date in daily_dates[:5]:
    print(f"  {date.strftime('%Y-%m-%d')}")
print(f"  ... (total: {len(daily_dates)} dates)")

# Every Monday for 5 occurrences
print("\\nEvery Monday (5 occurrences):")
monday_dates = list(rrule(WEEKLY, byweekday=MO, count=5, dtstart=start_date))
for date in monday_dates:
    print(f"  {date.strftime('%Y-%m-%d %A')}")

# Monthly on the 15th for 6 months
print("\\nMonthly on the 15th (6 occurrences):")
monthly_dates = list(rrule(MONTHLY, bymonthday=15, count=6, dtstart=start_date))
for date in monthly_dates:
    print(f"  {date.strftime('%Y-%m-%d')}")`
  },
  {
    title: "Timezone Handling",
    code: `# Work with timezones
from dateutil import tz
from datetime import datetime

# Get UTC timezone
utc = tz.UTC
print("UTC timezone:", utc)

# Create timezone-aware datetime
utc_now = datetime.now(utc)
print(f"Current UTC time: {utc_now}")

# Create timezone with fixed offset (UTC+5:30)
ist = tz.tzoffset('IST', 5*3600 + 30*60)  # 5 hours 30 minutes
ist_time = utc_now.astimezone(ist)
print(f"IST time (UTC+5:30): {ist_time}")

# Convert between timezones
print()
print("Timezone conversions:")
print(f"  UTC: {utc_now.strftime('%Y-%m-%d %H:%M:%S %Z')}")
print(f"  IST: {ist_time.strftime('%Y-%m-%d %H:%M:%S %Z')}")

# Parse timezone-aware string
tz_string = "2024-03-15 14:30:00+05:30"
parsed = datetime.fromisoformat(tz_string)
print(f"\\nParsed timezone-aware: {parsed}")`
  },
  {
    title: "Easter Date Calculation",
    code: `# Calculate Easter Sunday dates
from dateutil.easter import easter

years = [2024, 2025, 2026, 2027, 2028]

print("Easter Sunday dates:")
print("-" * 40)
for year in years:
    easter_date = easter(year)
    print(f"{year}: {easter_date.strftime('%B %d, %Y (%A)')}")

# Calculate relative to Easter
print()
print("Dates relative to Easter 2024:")
easter_2024 = easter(2024)
print(f"Easter: {easter_2024.strftime('%Y-%m-%d')}")

from dateutil.relativedelta import relativedelta

# Good Friday (2 days before)
good_friday = easter_2024 - relativedelta(days=2)
print(f"Good Friday: {good_friday.strftime('%Y-%m-%d')}")

# Ascension Day (39 days after)
ascension = easter_2024 + relativedelta(days=39)
print(f"Ascension Day: {ascension.strftime('%Y-%m-%d')}")`
  },
  {
    title: "Finding Specific Dates",
    code: `# Find specific dates (e.g., next Friday the 13th)
from dateutil.rrule import rrule, MONTHLY, FR
from dateutil.relativedelta import relativedelta
from datetime import datetime

today = datetime(2024, 3, 15)
print(f"Today: {today.strftime('%Y-%m-%d')}")
print()

# Find next Friday the 13th
friday_13th_dates = list(rrule(
    MONTHLY,
    dtstart=today,
    bymonthday=13,
    byweekday=FR,
    count=3
))

print("Next Friday the 13th dates:")
for date in friday_13th_dates:
    print(f"  {date.strftime('%Y-%m-%d (%A)')}")

# Find last day of each month for next 6 months
print()
print("Last day of each month (next 6 months):")
for i in range(6):
    month_start = today + relativedelta(months=+i)
    last_day = month_start + relativedelta(day=31)  # Adjusts to last day
    print(f"  {last_day.strftime('%Y-%m-%d')}")`
  }
]

const defaultCode = `# Flexible date parsing
from dateutil import parser
from dateutil.relativedelta import relativedelta
from datetime import datetime

# Parse various date formats
date_strings = [
    "2024-03-15",
    "March 15, 2024",
    "15/03/2024",
    "2024-03-15 14:30:00"
]

print("Parsing date strings:")
for date_str in date_strings:
    parsed = parser.parse(date_str)
    print(f"{date_str:25} -> {parsed}")

# Calculate relative dates
print()
today = datetime(2024, 3, 15)
print(f"Today: {today.strftime('%Y-%m-%d')}")
print(f"Next month: {(today + relativedelta(months=+1)).strftime('%Y-%m-%d')}")
print(f"Next year: {(today + relativedelta(years=+1)).strftime('%Y-%m-%d')}")`

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
  
  downloadAsset,
  createAssetFolder
} = useLibraryPlayground({
  packageName: 'python-dateutil',
  defaultCode,
  examples,
  additionalPackages: [],
  setupCode: `
from dateutil import parser, tz
from dateutil.relativedelta import relativedelta
from dateutil.rrule import rrule, DAILY, WEEKLY, MONTHLY, YEARLY, MO, TU, WE, TH, FR
from dateutil.easter import easter
from datetime import datetime
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


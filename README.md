# Broadcast System Dashboard

This dashboard provides insights into device types and panels in workstations in a broadcast environment, visualizing data from InterviewData.json.

## Prerequisites
Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (usually comes with Node.js)

## Getting Started
Follow these steps to set up and run the dashboard:

### 1. Clone the repository
```bash
git clone https://github.com/ianMuchesia/broadcast-dashboard.git
cd broadcast-dashboard
```

### 2. Install dependencies
Due to some package compatibility issues, we need to use the legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

### 3. Run the development server
```bash
npm run dev
```
The application should now be running on [http://localhost:5173](http://localhost:5173) (or another port if 5173 is in use).

## Project Structure
- `/components` - React components for the dashboard
- `/pages` - Main page layouts
- `public` - Static assets including InterviewData.json
- `/store` - Redux store configuration

## Features
- Summary cards showing device and panel counts
- Top device types visualization
- Top workstation panels visualization
- Searchable and sortable device type table with pagination

## Technologies Used
- React
- TypeScript
- Tailwind CSS for styling
- ApexCharts for data visualization
- Redux for state management

## Component Analysis & Design Decisions

### Overview
This document explains the design decisions and data manipulation techniques used in creating the dashboard components. The JSON data represents a broadcast or media production environment with two main data structures:

- **deviceTypes**: Information about different device types and their counts
- **panelsInWorkstations**: Information about panels installed in workstations

## Data Analysis
The dashboard visualizes broadcast system data that includes:
- 260+ device types with varying counts
- 900+ panels in workstations with hierarchical naming

Each component is designed to present this information in the most useful way for broadcast system administrators and engineers.

## Notes
- The search functionality in the device table is case-insensitive
- Charts are optimized for both desktop and mobile viewing
- Dark mode support is available throughout the application

## Data Structure Analysis

```json
"deviceTypes": {
  "totalCount": 260,
  "countByType": {
    "evertz_mv": 1,
    "evertz_multiviewercontrol": 1,
    "PackagerAuto": 109,
    /* many more device types... */
  }
}
```

- The structure contains a total count (260) and a mapping of device types to their individual counts
- There are over 200 different device types with varying counts
- Some device types have very high counts (e.g., "CP-1000E": 210), while others have just 1 or 2 instances


## Panels in Workstations Data

```json
"panelsInWorkstations": {
  "totalCount": 954,
  "workStationCountByPanel": {
    "ringmaster_packaging/package_router": 198,
    "ringmaster_packaging/arrivals_board": 188,
    /* many more panels... */
  }
}
```

- The structure contains a total count (954) and a mapping of panel types to their counts
- Panel names use a path-like structure with categories (e.g., "studio_1/video_xy_mapped")
- Some panels appear in many workstations, while others are rare or unused (value of 0)
- There are empty key entries ("": 170) that need special handling


## Dashboard Component Design Rationale

### Main Dashboard Component
Design Decision: Create a container component that fetches data and manages overall layout.

Rationale:
- Separates data fetching concerns from presentation components
- Provides loading and error states for better UX
- Uses a grid layout for responsive design across different screen sizes
- Organizes visualizations logically based on their importance and relationship

### Summary Cards Component
Design Decision: Display four key metrics in card format at the top of the dashboard.

**Data Analysis:**
* The JSON data provides two main top-level counts: `deviceTypes.totalCount` (260) and `panelsInWorkstations.totalCount` (954)
* The number of unique device types and panel types can be derived by counting the keys in the respective objects

**Data Manipulation:**
```javascript
const uniqueDeviceTypes = Object.keys(data.deviceTypes.countByType).length;
const uniquePanelTypes = Object.keys(data.panelsInWorkstations.workStationCountByPanel).length;
```

**Rationale:**
* Provides immediate high-level metrics to understand system scale
* Uses `Object.keys().length` to count the unique types, which is an efficient way to determine cardinality
* Positioned at the top as a standard dashboard pattern for KPIs
* Uses distinct colors and icons to make metrics easily distinguishable

### Top Device Types Component (Horizontal Bar Chart)
**Design Decision:** Use horizontal bars to display the top 10 device types.

**Data Analysis:**
* The `countByType` object contains many entries (200+) with widely varying counts
* The data is in key-value object format but needs to be in array format for sorting

**Data Manipulation:**
```javascript
const topDevices = Object.entries(data)
    .sort((a, b) => b[1] - a[1])  // Sort by count in descending order
    .slice(0, 10);                // Take only top 10 entries
```

**Rationale:**
* `Object.entries()` converts the object to an array of [key, value] pairs, making it sortable
* Sorting in descending order shows the most numerous devices first
* `slice(0, 10)` limits the display to only the top 10 entries, preventing visual overload
* Horizontal bar orientation accommodates longer text labels that vertical bars wouldn't display well
* Focusing on top 10 provides actionable insights without overwhelming the user with all 200+ device types
* Bar charts excel at comparing quantities across categories, making it ideal for this data

### Top Workstation Panels Component (Horizontal Bar Chart)
**Design Decision:** Use horizontal bars for top 10 panels with special tooltip handling.

**Data Analysis:**
* Panel names use a path-like structure (e.g., "studio_1/video_xy_mapped")
* There's an empty string key with a significant count (170) which should be filtered out
* Full paths are informative but too long for display labels

**Data Manipulation:**
```javascript
const topPanels = Object.entries(data)
    .filter(([name]) => name !== '')  // Remove empty key entries
    .sort((a, b) => b[1] - a[1])      // Sort by count descending
    .slice(0, 10);                    // Take only top 10
const categories = topPanels.map(([name]) => {
    // Extract the panel name from the path
    const panelName = name.split('/').pop() || name;
    return panelName;
});
```

**Rationale:**
* `filter()` removes the empty string key to avoid confusing data presentation
* Using `split('/').pop()` extracts just the final part of the path for cleaner labels
* Tooltip maintains the full path for context when needed
* Limiting to top 10 focuses on the most widely used panels
* Truncating displayed names to 15 characters ensures consistent visual presentation
* Horizontal bars work better than vertical for comparing values with text labels

### Device Type Count Component (Interactive Table)
**Design Decision:** Create a searchable, sortable, paginated table for detailed exploration.

**Data Analysis:**
* The complete device type list has 200+ entries - too many for a single view
* Users may need to find specific devices or sort them by different criteria
* The data object format needs transformation for table display and filtering

**Data Manipulation:**
```javascript
// Convert object to array for sorting and filtering
const filteredData = Object.entries(data)
    .filter(([name]) => 
        name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
        if (sortField === 'name') {
            return sortDirection === 'asc' 
                ? a[0].localeCompare(b[0]) 
                : b[0].localeCompare(a[0]);
        } else {
            return sortDirection === 'asc' 
                ? a[1] - b[1] 
                : b[1] - a[1];
        }
    });
// Paginate the data
const totalPages = Math.ceil(filteredData.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
```

**Rationale:**
* Searchability: The filter based on `toLowerCase().includes()` provides case-insensitive search
* Sorting: The custom sort function allows toggling between name and count, and between ascending and descending order
* Pagination: Using `slice()` with calculated start/end indices shows a manageable subset of data
   * Formula `(currentPage - 1) * itemsPerPage` calculates the starting index for each page
   * `Math.ceil(filteredData.length / itemsPerPage)` ensures proper page count even with partial pages
* The combined approach allows users to:
   * Find specific devices by name with search
   * Identify patterns by sorting (highest/lowest counts, alphabetical)
   * Browse through large datasets without performance issues via pagination
* State management for search term, sort field/direction, and current page ensures UI stays responsive and maintains context

## Technical Implementation Decisions

### Use of React Hooks

**State Management:**
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [sortField, setSortField] = useState<'name' | 'count'>('count');
const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
```

**Rationale:**
* Separating concerns with individual state variables improves code readability
* TypeScript types (`'name' | 'count'` and `'asc' | 'desc'`) prevent invalid values
* Default values (e.g., sort by count descending) show the most important information first
* Reset to first page when searching prevents showing empty results pages

### Chart Rendering with ApexCharts

**Implementation:**
```javascript
useEffect(() => {
    // Chart configuration setup
    const options = { /* chart options */ };

    if (chartRef.current && chartRef.current.innerHTML === '') {
        const chart = new ApexCharts(chartRef.current, options);
        chart.render();

        return () => {
            chart.destroy();
        };
    }
}, [data]);
```

**Rationale:**
* Using `useRef` and checking for empty content prevents duplicate charts on re-renders
* Proper cleanup with `chart.destroy()` in the effect cleanup function prevents memory leaks
* Effect dependency on `[data]` ensures chart updates if data changes
* Options configured based on data analysis (e.g., horizontal orientation for long labels)

### Responsive Design Considerations

**Implementation:**
```javascript
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
    {/* Components */}
</div>
```

**Rationale:**
* Single column layout on smaller screens ensures readability
* Two-column layout on larger screens (`xl:grid-cols-2`) uses space efficiently
* Consistent spacing with `gap-6` and `mb-6` creates visual harmony
* Chart configurations include responsive breakpoints for smaller screens

## Conclusion

The dashboard components were designed based on careful analysis of the broadcast system data structure. By focusing on meaningful data transformations and appropriate visualization techniques, the components provide both high-level insights and detailed exploration capabilities.

Each component addresses specific aspects of the data through tailored manipulation techniques:
* Summary Cards: Simple counts and object key enumeration for high-level metrics
* Top Device Types: Object-to-array conversion, sorting, and slicing for focused visualization
* Top Workstation Panels: Filtering, path extraction, and consistent labeling
* Device Type Count: Comprehensive search, sort, and pagination for detailed exploration

Together, these components create a dashboard that effectively communicates the scale and composition of the broadcast system while providing tools for deeper analysis.
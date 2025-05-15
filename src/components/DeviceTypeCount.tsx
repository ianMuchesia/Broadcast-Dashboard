import { useState } from 'react';
import IconSearch from './Icon/IconSearch';


interface DeviceTypeCountProps {
    data: Record<string, number>;
}

const DeviceTypeCount = ({ data }: DeviceTypeCountProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<'name' | 'count'>('count');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    
    const itemsPerPage = 10;
    
    const handleSort = (field: 'name' | 'count') => {
        if (field === sortField) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };
    
    // Filter and sort the data
    //object.entries(data) returns an array of key-value pairs
    //filter the array based on the search term
    //sort the array based on the selected field and direction
    const filteredData = Object.entries(data)
        .filter(([name]) => 
            name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortField === 'name') {
                return sortDirection === 'asc'
                //localeCompare is used to compare strings in a locale-sensitive manner 
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
    
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="relative max-w-xs mb-4 sm:mb-0">
                    <input
                        type="text"
                        placeholder="Search devices..."
                        className="form-input w-full pl-10"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // Reset to first page when searching
                        }}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        <IconSearch className="w-4 h-4" />
                    </span>
                </div>
                <div className="text-sm text-gray-500">
                    Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} entries
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 dark:bg-gray-700">
                            <th 
                                className="px-4 py-3 cursor-pointer" 
                                onClick={() => handleSort('name')}
                            >
                                <div className="flex items-center">
                                    Device Type
                                    {sortField === 'name' && (
                                        <span className="ml-1">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                            <th 
                                className="px-4 py-3 cursor-pointer"
                                onClick={() => handleSort('count')}
                            >
                                <div className="flex items-center justify-end">
                                    Count
                                    {sortField === 'count' && (
                                        <span className="ml-1">
                                            {sortDirection === 'asc' ? '↑' : '↓'}
                                        </span>
                                    )}
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map(([name, count], index) => (
                                <tr 
                                    key={name} 
                                    className={`${
                                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-700/50'
                                    } border-b border-gray-200 dark:border-gray-700`}
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">{name}</td>
                                    <td className="px-4 py-3 text-right">{count.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-center">
                                    No matching devices found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <nav className="flex space-x-1">
                        <button
                            className={`px-3 py-1 rounded-md ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(page => 
                                page === 1 || 
                                page === totalPages || 
                                (page >= currentPage - 1 && page <= currentPage + 1)
                            )
                            .map((page, index, array) => (
                                <div key={page}>
                                    {index > 0 && array[index - 1] !== page - 1 && (
                                        <span className="px-3 py-1">...</span>
                                    )}
                                    <button
                                        className={`px-3 py-1 rounded-md ${
                                            currentPage === page
                                                ? 'bg-primary text-white'
                                                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </div>
                            ))}
                            
                        <button
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default DeviceTypeCount;
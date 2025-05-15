import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface DeviceTypeDistributionProps {
    data: Record<string, number>;
}

const DeviceTypeDistribution = ({ data }: DeviceTypeDistributionProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get top 8 device types by count
        const topDevices = Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
        
        // Calculate "Others" category
        const topSum = topDevices.reduce((sum, [_, count]) => sum + count, 0);
        const total = Object.values(data).reduce((sum, count) => sum + count, 0);
        const others = total - topSum;

        // Add "Others" to the data
        const categories = [...topDevices.map(([name]) => name), 'Others'];
        const series = [...topDevices.map(([_, count]) => count), others];

        const options: ApexCharts.ApexOptions = {
            series: series,
            chart: {
                type: 'pie',
                height: 380,
            },
            labels: categories,
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 300,
                        },
                        legend: {
                            position: 'bottom',
                        },
                    },
                },
            ],
            colors: ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3', '#3b3f5c', '#1e1e1e', '#888ea8'],
            legend: {
                position: 'right',
                offsetY: 50,
                formatter: function(seriesName, opts) {
                    return `${seriesName}: ${opts.w.globals.series[opts.seriesIndex]}`;
                }
            },
            tooltip: {
                y: {
                    formatter: function(value) {
                        return `${value} devices (${((value / total) * 100).toFixed(1)}%)`;
                    }
                }
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '50%',
                    },
                },
            },
        };

        if (chartRef.current && chartRef.current.innerHTML === '') {
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();

            return () => {
                chart.destroy();
            };
        }
    }, [data]);

    return <div ref={chartRef} className="h-[400px]"></div>;
};

export default DeviceTypeDistribution;
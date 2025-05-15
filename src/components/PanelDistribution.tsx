import { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface PanelDistributionProps {
    data: Record<string, number>;
}

const PanelDistribution = ({ data }: PanelDistributionProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Get top 8 panels by count
        const topPanels = Object.entries(data)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8);
        
        // Calculate "Others" category
        const topSum = topPanels.reduce((sum, [_, count]) => sum + count, 0);
        const total = Object.values(data).reduce((sum, count) => sum + count, 0);
        const others = total - topSum;

        const categories = [...topPanels.map(([name]) => {
            // Truncate long panel names
            const shortName = name.split('/').pop() || name;
            return shortName.length > 20 ? shortName.substring(0, 20) + '...' : shortName;
        }), 'Others'];
        
        const series = [...topPanels.map(([_, count]) => count), others];

        const options: ApexCharts.ApexOptions = {
            series: series,
            chart: {
                type: 'donut',
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
                        return `${value} instances (${((value / total) * 100).toFixed(1)}%)`;
                    }
                }
            },
            dataLabels: {
                enabled: false,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
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

export default PanelDistribution;
import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface TopDeviceTypesProps {
  data: Record<string, number>;
}

const TopDeviceTypes = ({ data }: TopDeviceTypesProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get top 10 device types by count
    const topDevices = Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const categories = topDevices.map(([name]) => name);
    const series = [
      {
        name: "Device Count",
        data: topDevices.map(([_, count]) => count),
      },
    ];

    const options: ApexCharts.ApexOptions = {
      series: series,
      chart: {
        type: "bar",
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4,
          barHeight: "70%",
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: categories,
        labels: {
          formatter: function (val) {
            return val.toString();
          },
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
          },
          formatter: (value) => {
            const stringValue = String(value);
            // Truncate long panel names
            return stringValue.length > 15
              ? stringValue.substring(0, 15) + "..."
              : stringValue;
          },
        },
      },
      colors: ["#4361ee"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString() + " devices";
          },
        },
      },
      grid: {
        borderColor: "#e0e6ed",
        strokeDashArray: 5,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
        padding: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
    };

    if (chartRef.current && chartRef.current.innerHTML === "") {
      const chart = new ApexCharts(chartRef.current, options);
      chart.render();

      return () => {
        chart.destroy();
      };
    }
  }, [data]);

  return <div ref={chartRef} className="h-[350px]"></div>;
};

export default TopDeviceTypes;

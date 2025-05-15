import { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";

interface TopWorkstationPanelsProps {
  data: Record<string, number>;
}

const TopWorkstationPanels = ({ data }: TopWorkstationPanelsProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Get top 10 panels by count, filtering out empty string key
    // object.entries return an array of key-value pairs
    // remove the empty string key was throwing an error
    // sort the array by value in descending order
    const topPanels = Object.entries(data)
      .filter(([name]) => name !== "")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const categories = topPanels.map(([name]) => {
      // Extract the panel name from the path
      // || name to handle cases where name is undefined
      const panelName = name.split("/").pop() || name;
      return panelName;
    });

    const series = [
      {
        name: "Workstation Count",
        data: topPanels.map(([_, count]) => count),
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
            // Truncate long panel names
            const stringValue = String(value);
            // Truncate long panel names
            return stringValue.length > 15
              ? stringValue.substring(0, 15) + "..."
              : stringValue;
          },
        },
      },
      colors: ["#00ab55"],
      tooltip: {
        y: {
          formatter: function (val) {
            return val.toString() + " workstations";
          },
        },
        x: {
          formatter: function (value) {
            // Find the original full path for this panel
            const original =
              topPanels.find(
                ([_, __], index) => index === value - 1
              )?.[0] || "";
            return original;
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

export default TopWorkstationPanels;

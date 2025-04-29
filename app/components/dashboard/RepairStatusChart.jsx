"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { REPAIR_STATUS } from "@/app/components/repair/RepairStatus";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function RepairStatusChart({ data, loading, error }) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [timeRange, setTimeRange] = useState('month'); // 'day', 'month', 'year'

  const handleTimeRangeChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeRange(newValue);
    }
  };

  useEffect(() => {
    if (!data) return;

    // Format date based on selected time range
    const getDateKey = (date) => {
      switch (timeRange) {
        case 'day':
          return format(date, 'yyyy-MM-dd');
        case 'month':
          return format(date, 'yyyy-MM');
        case 'year':
          return format(date, 'yyyy');
        default:
          return format(date, 'yyyy-MM');
      }
    };

    // Get formatted label
    const getLabel = (dateKey) => {
      const date = new Date(dateKey);
      switch (timeRange) {
        case 'day':
          return format(date, 'd MMM yyyy', { locale: th });
        case 'month':
          return format(date, 'MMMM yyyy', { locale: th });
        case 'year':
          return format(date, 'yyyy', { locale: th });
        default:
          return dateKey;
      }
    };

    // Group data by selected time range and status
    const groupedData = data.reduce((acc, repair) => {
      const date = new Date(repair.request_date);
      const dateKey = getDateKey(date);

      if (!acc[dateKey]) {
        acc[dateKey] = {};
        REPAIR_STATUS.forEach((status) => {
          acc[dateKey][status.id] = 0;
        });
      }

      acc[dateKey][repair.request_status]++;
      return acc;
    }, {});

    // Sort dates
    const sortedDates = Object.keys(groupedData).sort();

    // Create datasets for each status
    const datasets = REPAIR_STATUS.map((status) => ({
      label: status.name,
      data: sortedDates.map((date) => groupedData[date][status.id]),
      backgroundColor: getStatusColor(status.id),
      borderColor: getStatusColor(status.id),
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 20,
    }));

    setChartData({
      labels: sortedDates.map(getLabel),
      datasets,
    });
  }, [data, timeRange]);

  // Helper function to convert Tailwind colors to chart colors
  const getStatusColor = (statusId) => {
    const colorMap = {
      0: "rgb(253, 224, 71)", // yellow-300
      1: "rgb(96, 165, 250)", // blue-400
      2: "rgb(34, 197, 94)", // green-500
      3: "rgb(239, 68, 68)", // red-500
      4: "rgb(249, 115, 22)", // orange-500
      5: "rgb(156, 163, 175)", // gray-400
      6: "rgb(168, 85, 247)", // purple-500
      7: "rgb(20, 184, 166)", // teal-500
      8: "rgb(236, 72, 153)", // pink-500
    };
    return colorMap[statusId] || "rgb(156, 163, 175)"; // Default gray
  };

  // Update options for better display
  const options = {
    responsive: true,
    //maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: timeRange === 'day' ? 'วัน' : timeRange === 'month' ? 'เดือน' : 'ปี',
          font: {
            family: "Sarabun",
          },
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "จำนวนงานซ่อม",
          font: {
            family: "Sarabun",
          },
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          font: {
            family: "Sarabun",
          },
        },
      },
      title: {
        display: true,
        text: "สถิติการซ่อมแยกตามสถานะ",
        font: {
          family: "Sarabun",
          size: 16,
        },
      },
    },
  };

  if (loading) {
    return (
      <Card sx={{ height: "400px", width: "100%" }}>
        <CardHeader title="กำลังโหลดข้อมูล..." />
        <CardContent>Loading...</CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: "100%", width: "100%" }}>
        <CardHeader title="เกิดข้อผิดพลาด" />
        <CardContent>{error}</CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: "100%", width: "100%" }}>
      <CardHeader 
        title="สถิติการซ่อม"
        action={
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            size="small"
          >
            <ToggleButton value="day">รายวัน</ToggleButton>
            <ToggleButton value="month">รายเดือน</ToggleButton>
            <ToggleButton value="year">รายปี</ToggleButton>
          </ToggleButtonGroup>
        }
      />
      <CardContent>
        <Box sx={{ height: "calc(100% - 70px)", width: "100%" }}>
          <Bar data={chartData} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
}

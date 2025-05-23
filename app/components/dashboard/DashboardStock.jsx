"use client";
import { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, TextField } from "@mui/material";
import { API_ENDPOINTS } from "@/app/config/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { format } from 'date-fns';
import { th } from 'date-fns/locale';
import StockUsageChart from './StockUsageChart';
import { getAuthHeaders } from '@/app/utils/auth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  return format(new Date(dateString), 'dd MMMM yyyy', { locale: th });
};

export default function DashboardStock() {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usageData, setUsageData] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // First API call - stock data
        const stockResponse = await fetch(`${API_ENDPOINTS.stock_levels.getAll}`, {
          headers: getAuthHeaders()
        });

        if (!stockResponse.ok) {
          throw new Error(`Stock API error: ${stockResponse.status}`);
        }

        const stockResult = await stockResponse.json();

        // Only proceed to second API if first one succeeds
        if (stockResult.status === 200) {
          // Handle nested array structure
          const flattenedData = Array.isArray(stockResult.data) 
            ? stockResult.data.map(item => Array.isArray(item) ? item[0] : item)
            : [];
          setStockData(flattenedData);

          // Second API call - usage data
          const usageResponse = await fetch(`${API_ENDPOINTS.stock_levels.getStockUse}`, {
            headers: getAuthHeaders()
          });

          if (!usageResponse.ok) {
            throw new Error(`Usage API error: ${usageResponse.status}`);
          }

          const usageResult = await usageResponse.json();
          if (usageResult.status === 200) {
            setUsageData(usageResult.data || []);
          } else {
            console.error('Failed to fetch usage data:', usageResult.message);
          }
        } else {
          setError(stockResult.message || "Failed to fetch stock data");
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Get summary data
  const getSummaryData = () => {
    if (!stockData.length) return {
      totalItems: 0,
      totalValue: 0,
      totalStockIn: 0,
      totalStockOut: 0
    };

    return {
      totalItems: stockData.length,
      totalValue: stockData.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0),
      totalStockIn: stockData.reduce((sum, item) => sum + (item.stock_in || 0), 0),
      totalStockOut: stockData.reduce((sum, item) => sum + (item.stock_out || 0), 0)
    };
  };

  // Process data for category chart
  const processCategoryData = () => {
    const categoryCounts = stockData.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(categoryCounts),
      datasets: [{
        label: 'จำนวนรายการ',
        data: Object.values(categoryCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      }]
    };
  };

  // Process data for stock levels
  const processStockLevels = () => {
    return {
      labels: stockData.map(item => item.item_name),
      datasets: [
        {
          label: 'จำนวนคงเหลือ',
          data: stockData.map(item => item.quantity),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
        },
        {
          label: 'จำนวนเบิกออก',
          data: stockData.map(item => item.stock_out),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Sarabun'
          }
        }
      }
    }
  };

  const barChartOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: [
          'สถิติการใช้งานอะไหล่',
          dateRange.startDate && dateRange.endDate ? 
            `ช่วงวันที่ ${formatDateForDisplay(dateRange.startDate)} ถึง ${formatDateForDisplay(dateRange.endDate)}` :
            'แสดงข้อมูลทั้งหมด'
        ],
        font: {
          family: 'Sarabun',
          size: 14,
          weight: 'bold'
        },
        padding: 20
      }
    }
  };

  if (loading) return <Box>กำลังโหลดข้อมูล...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  จำนวนรายการทั้งหมด
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().totalItems} รายการ
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  มูลค่ารวม
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().totalValue.toLocaleString()} บาท
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  จำนวนรับเข้าทั้งหมด
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().totalStockIn} ชิ้น
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  จำนวนเบิกออกทั้งหมด
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().totalStockOut} ชิ้น
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, width: 900, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                สถิติตามหมวดหมู่
                {/* {dateRange.startDate && dateRange.endDate && (
                  <Typography variant="body2" color="textSecondary">
                    ช่วงวันที่ {formatDateForDisplay(dateRange.startDate)} ถึง {formatDateForDisplay(dateRange.endDate)}
                  </Typography>
                )} */}
              </Typography>
              <Pie data={processCategoryData()} options={chartOptions} />
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, width: 900, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                สถิติการเบิก-จ่าย
                {/* {dateRange.startDate && dateRange.endDate && (
                  <Typography variant="body2" color="textSecondary">
                    ช่วงวันที่ {formatDateForDisplay(dateRange.startDate)} ถึง {formatDateForDisplay(dateRange.endDate)}
                  </Typography>
                )} */}
              </Typography>
              <Bar data={processStockLevels()} options={barChartOptions} />
            </Box>
          </Grid>
        </Grid>

        {/* Date Range Controls */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                เลือกช่วงเวลา
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="date"
                  label="วันที่เริ่มต้น"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({
                    ...prev,
                    startDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="วันที่สิ้นสุด"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({
                    ...prev,
                    endDate: e.target.value
                  }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>
          </Grid>
        </Grid>

        
        {/* Stock Usage Chart */}
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Box sx={{ height: 400, width: 900, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                การใช้งานอะไหล่
                {dateRange.startDate && dateRange.endDate && (
                  <Typography variant="body2" color="textSecondary">
                    ช่วงวันที่ {formatDateForDisplay(dateRange.startDate)} ถึง {formatDateForDisplay(dateRange.endDate)}
                  </Typography>
                )}
              </Typography>
              <StockUsageChart 
                data={usageData} 
                dateRange={dateRange}
              />
            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}
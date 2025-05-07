"use client";
import { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, TextField, ToggleButton } from "@mui/material";
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardAssets() {
  const [assetsData, setAssetsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [selectedTimelines, setSelectedTimelines] = useState({
    assets_in: true,
    purchase_date: true,
    warranty: true
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.assets.getRange}/0/0`);
        const result = await response.json();

        if (result.status === 200) {
          setAssetsData(result.data);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching assets data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get summary data
  const getSummaryData = () => {
    if (!assetsData.length) return {
      total: 0,
      totalValue: 0,
      lastUpdated: null,
      typesCount: 0
    };

    const totalValue = assetsData.reduce((sum, asset) => sum + (asset.price || 0), 0);
    const lastUpdated = assetsData.reduce((latest, asset) => {
      const updateDate = new Date(asset.updated_at);
      return latest ? (updateDate > new Date(latest.updated_at) ? asset : latest) : asset;
    }, null);

    const uniqueTypes = new Set(assetsData.map(asset => asset.assetstypes_name));

    return {
      total: assetsData.length,
      totalValue,
      lastUpdated,
      typesCount: uniqueTypes.size
    };
  };

  // Process data for department chart
  const processDepartmentData = () => {
    const deptCounts = assetsData.reduce((acc, asset) => {
      acc[asset.departments_name] = (acc[asset.departments_name] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(deptCounts),
      datasets: [{
        label: 'จำนวนครุภัณฑ์',
        data: Object.values(deptCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      }]
    };
  };

  // Process data for types chart
  const processTypesData = () => {
    const typesCounts = assetsData.reduce((acc, asset) => {
      acc[asset.assetstypes_name] = (acc[asset.assetstypes_name] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(typesCounts),
      datasets: [{
        label: 'ประเภทครุภัณฑ์',
        data: Object.values(typesCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      }]
    };
  };

  // Process data for brands chart
  const processBrandsData = () => {
    const brandCounts = assetsData.reduce((acc, asset) => {
      acc[asset.assetbrand_name] = (acc[asset.assetbrand_name] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(brandCounts),
      datasets: [{
        label: 'ยี่ห้อครุภัณฑ์',
        data: Object.values(brandCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
      }]
    };
  };

  // Process data for timeline chart
  const processTimelineData = () => {
    const timelineData = {
      assets_in: {},
      purchase_date: {},
      warranty: {}
    };

    const startDate = dateRange.startDate ? new Date(dateRange.startDate) : null;
    const endDate = dateRange.endDate ? new Date(dateRange.endDate) : null;

    assetsData.forEach(asset => {
      // Only process selected timelines
      if (selectedTimelines.assets_in) {
        const assetsInDate = new Date(asset.assets_in);
        if ((!startDate || assetsInDate >= startDate) && 
            (!endDate || assetsInDate <= endDate)) {
          const dateKey = format(assetsInDate, 'yyyy-MM', { locale: th });
          timelineData.assets_in[dateKey] = (timelineData.assets_in[dateKey] || 0) + 1;
        }
      }

      if (selectedTimelines.purchase_date) {
        const purchaseDate = new Date(asset.purchase_date);
        if ((!startDate || purchaseDate >= startDate) && 
            (!endDate || purchaseDate <= endDate)) {
          const dateKey = format(purchaseDate, 'yyyy-MM', { locale: th });
          timelineData.purchase_date[dateKey] = (timelineData.purchase_date[dateKey] || 0) + 1;
        }
      }

      if (selectedTimelines.warranty) {
        const warrantyDate = new Date(asset.warranty);
        if ((!startDate || warrantyDate >= startDate) && 
            (!endDate || warrantyDate <= endDate)) {
          const dateKey = format(warrantyDate, 'yyyy-MM', { locale: th });
          timelineData.warranty[dateKey] = (timelineData.warranty[dateKey] || 0) + 1;
        }
      }
    });

    // Get all unique dates within range
    const allDates = [...new Set([
      ...Object.keys(timelineData.assets_in),
      ...Object.keys(timelineData.purchase_date),
      ...Object.keys(timelineData.warranty)
    ])].sort();

    return {
      labels: allDates,
      datasets: [
        selectedTimelines.assets_in && {
          label: 'วันที่รับเข้า',
          data: allDates.map(date => timelineData.assets_in[date] || 0),
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        selectedTimelines.purchase_date && {
          label: 'วันที่ซื้อ',
          data: allDates.map(date => timelineData.purchase_date[date] || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        selectedTimelines.warranty && {
          label: 'วันหมดประกัน',
          data: allDates.map(date => timelineData.warranty[date] || 0),
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ].filter(Boolean)
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
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'เดือน-ปี',
          font: {
            family: 'Sarabun',
            size: 14
          }
        },
        ticks: {
          font: {
            family: 'Sarabun'
          }
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'จำนวนรายการ',
          font: {
            family: 'Sarabun',
            size: 14
          }
        },
        ticks: {
          font: {
            family: 'Sarabun'
          }
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: 'Sarabun',
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'สถิติครุภัณฑ์ตามช่วงเวลา',
        font: {
          family: 'Sarabun',
          size: 16,
          weight: 'bold'
        }
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
                  จำนวนครุภัณฑ์ทั้งหมด
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().total} รายการ
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
            <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  จำนวนประเภทครุภัณฑ์
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().typesCount} ประเภท
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  อัพเดทล่าสุด
                </Typography>
                {getSummaryData().lastUpdated && (
                  <Box>
                    <Typography variant="body1">
                      {getSummaryData().lastUpdated.assets_name}
                    </Typography>
                    <Typography variant="body2">
                      {format(
                        new Date(getSummaryData().lastUpdated.updated_at),
                        'dd MMMM yyyy HH:mm',
                        { locale: th }
                      )}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>สถิติครุภัณฑ์ตามแผนก</h3>
              <Pie data={processDepartmentData()} options={chartOptions} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>สถิติครุภัณฑ์ตามประเภท</h3>
              <Pie data={processTypesData()} options={chartOptions} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>สถิติครุภัณฑ์ตามยี่ห้อ</h3>
              <Pie data={processBrandsData()} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>

        {/* Date Range and Timeline Selection */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                เลือกช่วงเวลา
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  type="date"
                  label="วันที่เริ่มต้น"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="วันที่สิ้นสุด"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                เลือกข้อมูลที่ต้องการแสดง
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {Object.entries({
                  assets_in: 'วันที่รับเข้า',
                  purchase_date: 'วันที่ซื้อ',
                  warranty: 'วันที่หมดประกัน'
                }).map(([key, label]) => (
                  <ToggleButton
                    key={key}
                    selected={selectedTimelines[key]}
                    onChange={() => {
                      setSelectedTimelines(prev => ({
                        ...prev,
                        [key]: !prev[key]
                      }));
                    }}
                    sx={{ flex: 1 }}
                  >
                    {label}
                  </ToggleButton>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Timeline Chart */}
        <Grid container sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <Box sx={{ height: 400,width: 900, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <Bar data={processTimelineData()} options={barChartOptions} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
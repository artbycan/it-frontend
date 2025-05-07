"use client";
import { useState, useEffect } from "react";
import { Box, Container, Grid, TextField, Card, CardContent, Typography } from "@mui/material";
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
import { USER_ROLES } from "@/app/components/users/SearchSelectUserRole";
import { USER_STATUSES } from "@/app/components/users/SearchSelectUserStatus";
import { GENDER_OPTIONS } from "@/app/components/users/SearchSelectGender";
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

export default function DashboardUser() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.users.getAll);
        const result = await response.json();

        if (result.status === 200) {
          setUserData(result.data);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching user data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add new processing functions for summary data
  const getSummaryData = () => {
    if (!userData.length) return {
      total: 0,
      todayUsers: 0,
      lastUpdated: null
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = userData.filter(user => {
      const createdDate = new Date(user.created_at);
      createdDate.setHours(0, 0, 0, 0);
      return createdDate.getTime() === today.getTime();
    }).length;

    const lastUpdated = userData.reduce((latest, user) => {
      const updateDate = new Date(user.updated_at);
      return latest ? (updateDate > new Date(latest.updated_at) ? user : latest) : user;
    }, null);

    return {
      total: userData.length,
      todayUsers,
      lastUpdated
    };
  };

  // Process data for charts
  const processDepartmentData = () => {
    const deptCounts = userData.reduce((acc, user) => {
      acc[user.departments_name] = (acc[user.departments_name] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(deptCounts),
      datasets: [{
        data: Object.values(deptCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
      }]
    };
  };

  const processRoleData = () => {
    const roleCounts = userData.reduce((acc, user) => {
      const roleName = USER_ROLES.find(r => r.id == parseInt(user.role))?.name || 'ไม่ระบุ';
      acc[roleName] = (acc[roleName] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(roleCounts),
      datasets: [{
        data: Object.values(roleCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
      }]
    };
  };

  const processStatusData = () => {
    const statusCounts = userData.reduce((acc, user) => {
      const statusName = USER_STATUSES.find(s => s.id == parseInt(user.status))?.name || 'ไม่ระบุ';
      acc[statusName] = (acc[statusName] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      }]
    };
  };

  const processGenderData = () => {
    const genderCounts = userData.reduce((acc, user) => {
      const genderName = GENDER_OPTIONS.find(g => g.id === user.gender)?.name || 'ไม่ระบุ';
      acc[genderName] = (acc[genderName] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(genderCounts),
      datasets: [{
        data: Object.values(genderCounts),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
        ],
      }]
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

  if (loading) return <Box>Loading...</Box>;
  if (error) return <Box>Error: {error}</Box>;

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  จำนวนผู้ใช้งานทั้งหมด
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().total} คน
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ผู้ใช้งานที่สร้างวันนี้
                </Typography>
                <Typography variant="h4">
                  {getSummaryData().todayUsers} คน
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  อัพเดทล่าสุด
                </Typography>
                {getSummaryData().lastUpdated && (
                  <Box>
                    <Typography variant="body1">
                      {getSummaryData().lastUpdated.f_name} {getSummaryData().lastUpdated.l_name}
                    </Typography>
                    <Typography variant="body2">
                      {format(new Date(getSummaryData().lastUpdated.updated_at), 'dd MMMM yyyy HH:mm', { locale: th })}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Existing Charts */}
        <Grid container spacing={3}>
          {/* Department Chart */}
          <Grid item xs={12} md={12}>
            <Box sx={{ height: 600, width: 850, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>แสดงผลผู้ใช้งานตามแผนก</h3>
              <Bar data={processDepartmentData()} options={chartOptions} />
            </Box>
          </Grid>

          {/* Role Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>แสดงผลผู้ใช้งานตามบทบาท</h3>
              <Pie data={processRoleData()} options={chartOptions} />
            </Box>
          </Grid>

          {/* Status Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>แสดงผลผู้ใช้งานตามสถานะ</h3>
              <Pie data={processStatusData()} options={chartOptions} />
            </Box>
          </Grid>

          {/* Gender Chart */}
          <Grid item xs={12} md={6}>
            <Box sx={{ height: 400, p: 2, bgcolor: 'white', borderRadius: 2 }}>
              <h3>แสดงผลผู้ใช้งานตามเพศ</h3>
              <Pie data={processGenderData()} options={chartOptions} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

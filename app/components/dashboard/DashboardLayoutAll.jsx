"use client";
import { useState, useEffect } from "react";
import { Box, Container, Grid, TextField } from "@mui/material";
import { API_ENDPOINTS } from "@/app/config/api";
import StatisticsCard from "./StatisticsCard";
import RepairStatusChart from "./RepairStatusChart";
import RecentRepairs from "./RecentRepairs";
import { getAuthHeaders } from "@/app/utils/auth";

export default function DashboardLayoutAll() {
  const [maintenanceData, setMaintenanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.maintenance.getAll}`, {
          headers: getAuthHeaders(),
        });
        const result = await response.json();

        if (result.status === 200) {
          setMaintenanceData(result.data);
        } else {
          setError(result.message || "Failed to fetch data");
        }
      } catch (error) {
        setError("Error fetching maintenance data");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add date filter effect
  useEffect(() => {
    if (!maintenanceData.length) return;

    const filtered = maintenanceData.filter((item) => {
      if (!dateRange.startDate || !dateRange.endDate) return true;

      const itemDate = new Date(item.request_date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);

      return itemDate >= start && itemDate <= end;
    });

    setFilteredData(filtered);
  }, [maintenanceData, dateRange]);

  // Calculate statistics using filteredData instead of maintenanceData
  const totalJobs = filteredData.length;
  const panDing = filteredData.filter(
    (item) => item.request_status === 0
  ).length;
  const inProgress = filteredData.filter(
    (item) => item.request_status === 1
  ).length;
  const completed = filteredData.filter(
    (item) => item.request_status === 2
  ).length;

  // Handle date changes
  const handleDateChange = (field) => (event) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  // Get latest repair
  const getLatestRepair = (data) => {
    if (!data || data.length === 0) return [];

    // Sort by created_at in descending order and take the first item
    return [
      data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0],
    ];
  };

  return (
    <Box sx={{ py: 8 }} title="DashboardAll">
      <Container maxWidth="xl">
        {/* Add Date Range Filters */}
        <Box sx={{ mb: 4, display: "flex", gap: 2, justifyContent: "center" }}>
          <TextField
            type="date"
            label="วันที่เริ่มต้น"
            value={dateRange.startDate}
            onChange={handleDateChange("startDate")}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            type="date"
            label="วันที่สิ้นสุด"
            value={dateRange.endDate}
            onChange={handleDateChange("endDate")}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <Grid container spacing={3}>
          {/* Statistics Cards */}
          <Grid item xs={12} md={3}>
            <StatisticsCard
              title="งานซ่อมทั้งหมด"
              stats={totalJobs.toString()}
              icon="mdi:wrench"
              color="secondary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatisticsCard
              title="รอดำเนินการ"
              stats={panDing.toString()}
              icon="mdi:clock-time-four-outline"
              color="warning"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatisticsCard
              title="กำลังดำเนินการ"
              stats={inProgress.toString()}
              icon="mdi:progress-wrench"
              color="primary"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatisticsCard
              title="เสร็จสิ้น"
              stats={completed.toString()}
              icon="mdi:check-circle"
              color="success"
            />
          </Grid>

          {/* Charts */}
          <Grid item xs={12} lg={12}>
            <Box sx={{ height: "100%", width: "900px" }}>
              <RepairStatusChart
                data={filteredData}
                loading={loading}
                error={error}
              />
            </Box>
          </Grid>

          <Grid item xs={12} lg={12}>
            <Box sx={{ height: "100%", width: "900px" }}>
              <RecentRepairs
                data={getLatestRepair(filteredData)}
                loading={loading}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

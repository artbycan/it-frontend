"use client";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import DashboardLayout from "@/app/components/dashboard/DashboardLayout";
import AdminLayout from "@/app/components/AdminLayout";
import DashboardLayoutAll from "../../components/dashboard/DashboardLayoutAll";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [view, setView] = useState("technician"); // 'technician' or 'all'

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="dashboard view"
          >
            <ToggleButton value="technician" aria-label="technician view">
              การแจ้งซ่อมมุมมองช่างเทคนิค
            </ToggleButton>
            <ToggleButton value="all" aria-label="all view">
              การแจ้งซ่อมมุมมองผู้ดูแลระบบ
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* <Typography variant="h5" align="center" sx={{ mb: 4 }}>
          {view === "technician"
            ? "Dashboard แสดงผลของช่างเทคนิค"
            : "Dashboard แสดงผลของผู้ดูแลระบบ"}
        </Typography> */}
        {view === "technician" ? <DashboardLayout /> : <DashboardLayoutAll />}
      </Box>
    </AdminLayout>
  );
}

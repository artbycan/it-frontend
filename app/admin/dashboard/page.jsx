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
import DashboardLayoutAll from "@/app/components/dashboard/DashboardLayoutAll";
import DashboardUser from "@/app/components/dashboard/DashboardUser";
import DashboardAssets from "@/app/components/dashboard/DashboardAssets";
import DashboardStock from "@/app/components/dashboard/DashboardStock";

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
            <ToggleButton value="assets" aria-label="assets view">
              สรุปข้อมูลครุภัณฑ์
            </ToggleButton>
            <ToggleButton value="stock" aria-label="stock view">
              สต๊อกอะไหล่
            </ToggleButton>
            <ToggleButton value="user" aria-label="user view">
              สรุปข้อมูลผู้ใช้งาน
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Render dashboard based on selected view */}
        {(() => {
          switch(view) {
            case 'technician':
              return <DashboardLayout />;
            case 'all':
              return <DashboardLayoutAll />;
            case 'user':
              return <DashboardUser />;
            case 'assets':
              return <DashboardAssets />; // Placeholder for assets view
            case 'stock':
              return <DashboardStock />; // Placeholder for stock view
            default:
              return <DashboardLayout />;
          }
        })()}
      </Box>
    </AdminLayout>
  );
}

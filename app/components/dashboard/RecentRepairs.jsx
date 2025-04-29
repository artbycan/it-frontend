import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { REPAIR_STATUS } from "@/app/components/repair/RepairStatus";

export default function RecentRepairs({ data, loading }) {
  // Get status label
  const getStatusLabel = (statusId) => {
    const status = REPAIR_STATUS.find((s) => s.id == statusId);
    return status ? status.name : "ไม่ระบุสถานะ";
  };

  // Get status color
  const getStatusColor = (statusId) => {
    switch (statusId) {
      case 0:
        return "warning"; // รอดำเนินการ
      case 1:
        return "info"; // กำลังดำเนินการ
      case 2:
        return "success"; // เสร็จสิ้น
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader title="งานซ่อมล่าสุด" />
        <CardContent>
          <Box component="div">กำลังโหลดข้อมูล...</Box>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader title="งานซ่อมล่าสุด" />
        <CardContent>
          <Box component="div">ไม่พบข้อมูลการซ่อม</Box>
        </CardContent>
      </Card>
    );
  }

  const latestRepair = data[0];

  return (
    <Card>
      <CardHeader title="งานซ่อมล่าสุด" />
      <CardContent>
        <List>
          <ListItem>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography 
                  component="div" 
                  variant="subtitle1" 
                  sx={{ fontWeight: "bold" }}
                >
                  {latestRepair.assets_name}
                </Typography>
                <Chip
                  label={getStatusLabel(latestRepair.request_status)}
                  color={getStatusColor(latestRepair.request_status)}
                  size="small"
                />
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Typography component="div" variant="body2">
                  รหัสครุภัณฑ์: {latestRepair.assets_num}
                </Typography>
                <Typography component="div" variant="body2">
                  ผู้แจ้ง: {latestRepair.user_fname} {latestRepair.user_lname}
                </Typography>
                <Typography component="div" variant="body2">
                  รายละเอียด: {latestRepair.problem_detail}
                </Typography>
                <Typography component="div" variant="body2">
                  ช่างเทคนิค: {latestRepair.technician_fname}{" "}
                  {latestRepair.technician_lname}
                </Typography>
                <Typography component="div" variant="body2" color="text.secondary">
                  วันที่แจ้ง:{" "}
                  {new Date(latestRepair.created_at).toLocaleDateString("th-TH")}
                </Typography>
              </Box>
            </Box>
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
}

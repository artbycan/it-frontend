"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
import AdminLayout from "@/app/components/AdminLayout";
import MaintenanceLogList from "@/app/components/repair/MaintenanceLogList";

export default function MaintenanceLogHistory() {
  const params = useParams();
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.maintenance_log.getByRequest}/${params.request_id}`,
          {
            headers: getAuthHeaders(),
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setLogs(result.data);
        } else {
          setError("ไม่สามารถดึงข้อมูลประวัติการดำเนินการได้");
        }
      } catch (error) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
      } finally {
        setLoading(false);
      }
    };

    if (params.request_id) {
      fetchLogs();
    }
  }, [params.request_id]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 relative">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Close Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ปิด
          </button>

          <h1 className="text-2xl font-bold mb-6">
            ประวัติการดำเนินการ #{params.request_id}
          </h1>

          {loading ? (
            <div className="text-center py-4">กำลังโหลด...</div>
          ) : error ? (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
              {error}
            </div>
          ) : (
            <MaintenanceLogList logs={logs} />
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
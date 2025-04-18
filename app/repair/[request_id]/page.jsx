"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
//import Image from "next/image";
import Link from 'next/link';
import RepairStatus from "@/app/components/repair/RepairStatus";
import RepairPriority from "@/app/components/repair/RepairPriority";
import ImageDisplay from "@/app/components/ImageDisplay";
import UserLayout from "@/app/components/UserLayout";
import MaintenanceLogList from "@/app/components/repair/MaintenanceLogList";

export default function RepairDetail() {
  const params = useParams();
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogPopup, setShowLogPopup] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [logError, setLogError] = useState(null);

  useEffect(() => {
    const fetchRepairDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_ENDPOINTS.maintenance.getById}/${params.request_id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();
        if (result.status === 200) {
          setRepair(result.data);
        } else {
          setError(result.message || "ไม่สามารถดึงข้อมูลการแจ้งซ่อมได้");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.request_id) {
      fetchRepairDetail();
    }
  }, [params.request_id]);

  const fetchMaintenanceLogs = async () => {
    try {
      setLoadingLogs(true);
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
        setLogError("ไม่สามารถดึงข้อมูลประวัติการดำเนินการได้");
      }
    } catch (error) {
      setLogError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoadingLogs(false);
    }
  };

  if (loading) return <div className="text-center p-8">กำลังโหลด...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (!repair)
    return <div className="text-center p-8">ไม่พบข้อมูลการแจ้งซ่อม</div>;

  return (
    <UserLayout title="รายละเอียดการแจ้งซ่อม" backLink="/repair">
      <div className="container mx-auto p-6 relative" >

        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Close Button */}
          <button
            onClick={() => window.history.back()}
            className="absolute top-12 right-14 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ปิด
          </button>

          <h1 className="text-2xl font-bold mb-6">
            รายละเอียดการแจ้งซ่อม #{repair.request_id}
          </h1>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Asset Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">ข้อมูลครุภัณฑ์</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">ชื่อครุภัณฑ์</p>
                  <p className="font-medium">{repair.assets_name}</p>
                </div>
                <div>
                  <p className="text-gray-600">หมายเลขครุภัณฑ์</p>
                  <p className="font-medium">{repair.assets_num}</p>
                </div>
                <div>
                  <p className="text-gray-600">Serial Number</p>
                  <p className="font-medium">{repair.serial_number}</p>
                </div>
              </div>
            </div>

            {/* Repair Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">ข้อมูลการแจ้งซ่อม</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">วันที่แจ้งซ่อม</p>
                  <p className="font-medium">
                    {new Date(repair.request_date).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">สถานะ</p>
                  <RepairStatus value={repair.request_status} />
                </div>
                <div>
                  <p className="text-gray-600">ความเร่งด่วน</p>
                  <RepairPriority value={repair.priority} />
                </div>
              </div>
            </div>

            {/* Problem Details */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">รายละเอียดปัญหา</h2>
              <p className="bg-gray-50 p-4 rounded">{repair.problem_detail}</p>
            </div>

            {/* Technician Information */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-semibold">ข้อมูลช่างซ่อม</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-600">ชื่อ-นามสกุล</p>
                  <p className="font-medium">
                    {repair.technician_fname} {repair.technician_lname}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">ชื่อผู้ใช้</p>
                  <p className="font-medium">{repair.technician_username}</p>
                </div>
                <div>
                  <p className="text-gray-600">เบอร์โทรศัพท์</p>
                  <p className="font-medium">{repair.technician_phone}</p>
                </div>
              </div>
            </div>

            {/* Images */}
            {repair.img_url && (
              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold">รูปภาพ</h2>
                <div>
                  <ImageDisplay
                    urls={repair.img_url}
                    // เปิดปิดส่วนแสดงภาพลบภาพ {true} เปิด ด
                    showDelete={false}
                  />
                </div>
              </div>
            )}

            {/* Maintenance Logs */}
            <div className="md:col-span-2 mt-6">
              <button
                onClick={() => {
                  setShowLogPopup(true);
                  fetchMaintenanceLogs();
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 flex items-center gap-2"
              >
                ▶️ ประวัติการดำเนินการ
              </button>
            </div>

          </div>
        </div>

        {showLogPopup && (
          <MaintenanceLogList
            logs={logs}
            loading={loadingLogs}
            error={logError}
            onClose={() => setShowLogPopup(false)}
          />
        )}

      </div>
    </UserLayout>
  );
}

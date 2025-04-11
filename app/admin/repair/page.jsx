"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
import RepairStatus, {
  REPAIR_STATUS,
} from "@/app/components/repair/RepairStatus";
import RepairPriority from "@/app/components/repair/RepairPriority";
import AdminLayout from "@/app/components/AdminLayout";
import MaintenanceLog from "@/app/components/repair/MaintenanceLog";

export default function RepairDashboard() {
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedRepairId, setSelectedRepairId] = useState(null);
  const [logError, setLogError] = useState(null);
  const [sessionData, setSessionData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchRepairs = async () => {
      try {
        setLoading(true);
        // Get session from API route
        const sessionResponse = await fetch("/api/auth/get-session");
        const sessionResult = await sessionResponse.json();

        if (sessionResult.status !== 200 || !sessionResult.user?.id) {
          throw new Error("กรุณาเข้าสู่ระบบใหม่อีกครั้ง");
        }

        // Store session data
        setSessionData(sessionResult);

        const response = await fetch(
          `${API_ENDPOINTS.maintenance.getByTechnician}/${sessionResult.user.id}`,
          {
            headers: getAuthHeaders(),
          }
        );

        const result = await response.json();
        if (result.status === 200) {
          const validData = result.data.flat().filter((item) => item !== null);
          setRepairs(validData);
        } else {
          setError(result.message || "ไม่สามารถดึงข้อมูลการแจ้งซ่อมได้");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  const handleAcceptJob = async (repair_id) => {
    setSelectedRepairId(repair_id);
    setShowLogForm(true);
  };

  const handleLogCreated = async (logId) => {
    try {
      const response = await fetch(API_ENDPOINTS.maintenance.update, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          request_id: selectedRepairId,
          request_status: 1,
        }),
      });

      const result = await response.json();
      if (result.status === 200) {
        setRepairs(
          repairs.map((repair) =>
            repair.request_id === selectedRepairId
              ? { ...repair, request_status: 1 }
              : repair
          )
        );
        setShowLogForm(false);
        router.push(`/admin/repair/${selectedRepairId}`);
      } else {
        setLogError("ไม่สามารถรับงานได้");
      }
    } catch (error) {
      setLogError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  const handleViewDetail = (repair_id) => {
    router.push(`/admin/repair/${repair_id}`);
  };

  const handleEditRepair = (repair_id) => {
    router.push(`/admin/repair/edit/${repair_id}`);
  };

  // Filter repairs based on search term and status
  const filteredRepairs = repairs
    .filter((repair) => {
      if (!repair) return false;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        repair.request_id?.toString().includes(searchLower) ||
        repair.problem_detail?.toLowerCase().includes(searchLower) ||
        repair.assets_name?.toLowerCase().includes(searchLower) ||
        repair.assets_num?.toLowerCase().includes(searchLower);

      // Apply status filter
      const matchesStatus =
        statusFilter === "all" ||
        repair.request_status.toString() === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by status first, then by request_id in descending order
      if (a.request_status === b.request_status) {
        return b.request_id - a.request_id;
      }
      return a.request_status - b.request_status;
    });

  // Calculate pagination
  const totalItems = filteredRepairs.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredRepairs.slice(startIndex, endIndex);

  // Calculate number of pending tasks (status = 0)
  const pendingTasks = repairs.filter(
    (repair) => repair.request_status === 0
  ).length;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          รายการแจ้งซ่อมที่ได้รับมอบหมาย
        </h1>
        {/* <div className="mb-4 flex justify-between items-center">{pendingTasks}</div> */}

        {/* แสดงการแจ้งเตือนเมื่อมีงานใหม่ได้รับมอบหมาย */}
        {pendingTasks > 0 && (
          <div
            className="mb-4 p-4 bg-red-900 text-pink-100 rounded-lg"
            fontSize="xl"
          >
            <span className="text-xl">⚠️</span>
            <p>คุณมี {pendingTasks} รายการที่รอดำเนินการ</p>
          </div>
        )}

        {/* Search, Status Filter, and Page Size Controls */}
        <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="all">สถานะทั้งหมด</option>
              {REPAIR_STATUS.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.name}
                </option>
              ))}
            </select>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="px-3 py-2 border rounded-lg"
            >
              <option value={5}>5 รายการ</option>
              <option value={10}>10 รายการ</option>
              <option value={20}>20 รายการ</option>
              <option value={50}>50 รายการ</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            แสดง {startIndex + 1} ถึง {Math.min(endIndex, totalItems)} จาก{" "}
            {totalItems} รายการ
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">กำลังโหลด...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    รหัสแจ้งซ่อม
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    วันที่แจ้ง
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    รายละเอียดปัญหา
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ความเร่งด่วน
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((repair) => (
                  <tr key={repair.request_id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {repair.request_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(repair.request_date).toLocaleDateString(
                        "th-TH"
                      )}
                    </td>
                    <td className="px-6 py-4">{repair.problem_detail}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RepairPriority value={repair.priority} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RepairStatus value={repair.request_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {repair.request_status === 0 ? (
                        <button
                          onClick={() => handleAcceptJob(repair.request_id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mr-2"
                          title="รับงาน"
                        >
                          ✓ รับงาน
                        </button>
                      ) : null}
                      <button
                        onClick={() => handleViewDetail(repair.request_id)}
                        className="text-blue-600 hover:text-blue-800 mr-2"
                        title="ดูรายละเอียด"
                      >
                        ℹ️
                      </button>
                      <button
                        onClick={() => handleEditRepair(repair.request_id)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="แก้ไข"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-4 flex justify-end items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ก่อนหน้า
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === page
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            ถัดไป
          </button>
        </div>

        {showLogForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">บันทึกการรับงาน</h3>
                <button
                  onClick={() => setShowLogForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              {logError && <div className="mb-4 text-red-500">{logError}</div>}
              {/* Only render MaintenanceLog if we have session data */}
              {sessionData?.user?.id && (
                <MaintenanceLog
                  requestId={selectedRepairId}
                  technicianId={sessionData.user.id}
                  onLogCreated={handleLogCreated}
                  onError={setLogError}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

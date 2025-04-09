"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import UserLayout from "@/app/components/UserLayout";
import { API_ENDPOINTS } from "@/app/config/api";
import UploadFile from "@/app/components/UploadFile";
import ImageDisplay from "@/app/components/ImageDisplay";
import {
  REPAIR_PRIORITY,
  getPriorityColor,
} from "@/app/components/repair/RepairPriority";
import {
  REPAIR_STATUS,
  getStatusColor,
} from "@/app/components/repair/RepairStatus";
import TechnicianAssignment from "@/app/components/repair/TechnicianAssignment";
import SearchSelectAssets from "@/app/components/repair/SearchSelectAssets";

export default function AddRepair() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    asset_id: "",
    img_url: "noimg.jpg",
    priority: "1",
    problem_detail: "",
    request_date: "",
    request_status: "0",
    technician_id: "",
    user_id: "", // Initialize without localStorage
    username: "",
    user_fullname: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Add useEffect to set user_id after mount
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    const userName = localStorage.getItem("username");
    const userFullname = localStorage.getItem("user_fullname");
    if ((userId, userName, userFullname)) {
      setFormData((prev) => ({
        ...prev,
        user_id: userId,
        username: userName,
        user_fullname: userFullname,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(API_ENDPOINTS.maintenance.add, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.status === 200) {
        setSuccess(result.message);
        setTimeout(() => {
          router.push("/repair"); // Redirect to repair list
        }, 2000);
      } else {
        setError(result.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล");
      }
    } catch (err) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout title="เพิ่มการแจ้งซ่อมใหม่" backLink="/repair">
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">เพิ่มการแจ้งซ่อมใหม่</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รูปภาพครุภัณฑ์
              </label>
              <ImageDisplay
                urls={formData.img_url}
                // เปิดปิดส่วนแสดงภาพลบภาพ {true} เปิด ด
                showDelete={true}
                onDelete={(newUrls) => {
                  setFormData((prev) => ({
                    ...prev,
                    img_url: newUrls,
                  }));
                }}
              />

              <UploadFile
                apiUrl={`${API_ENDPOINTS.files.upLoad}`}
                onUploadSuccess={(urls) => {
                  setFormData((prev) => ({
                    ...prev,
                    img_url: prev.img_url
                      ? `${prev.img_url},${urls.join(",")}`
                      : urls.join(","),
                  }));
                }}
                maxFiles={5}
                acceptedFileTypes="image/*"
              />
              <div>{formData.img_url}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
                <div>{formData.asset_id}</div>
              <SearchSelectAssets
                onAssetSelected={(asset) => {
                  if (asset) {
                    setFormData((prev) => ({
                      ...prev,
                      asset_id: asset.asset_id,
                      //img_url: asset.img_url || 'noimg.jpg'
                    }));
                  }
                }}
              />
            </div>
            <div>
              <label className="block text-gray-700">ผู้แจ้งซ่อม</label>
              <div>
                {formData.user_id +
                  formData.username +
                  " : " +
                  formData.user_fullname}
              </div>
            </div>
            <div>
              <label className="block text-gray-700">ความเร่งด่วน</label>
              <div className="flex items-center mb-2">{formData.priority}</div>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">เลือกความเร่งด่วน</option>
                {REPAIR_PRIORITY.map((priority) => (
                  <option
                    key={priority.id}
                    value={priority.id}
                    className={`${getPriorityColor(priority.id)}`}
                  >
                    {priority.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="flex items-center mb-2">
                {formData.request_status}
              </div>
              <label className="block text-gray-700">สถานะ</label>
              <select
                name="request_status"
                value={formData.request_status}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="">เลือกสถานะ</option>
                {REPAIR_STATUS.map((status) => (
                  <option
                    key={status.id}
                    value={status.id}
                    className={`${getStatusColor(status.id)}`}
                  >
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700">รายละเอียดปัญหา</label>
              <textarea
                name="problem_detail"
                value={formData.problem_detail}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">วันที่แจ้ง</label>
              <input
                type="date"
                name="request_date"
                value={formData.request_date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="col-span-2">
              <div>{formData.technician_id}</div>
              {/* <TechnicianAssignment 
                onTechnicianAssigned={(tech) => {
                  setFormData(prev => ({
                    ...prev,
                    technician_id: tech.user_id,
                    technician_username: tech.username,
                    technician_name: `${tech.f_name} ${tech.l_name}`
                  }))
                }}
              /> */}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {success && <p className="text-green-500 mt-2">{success}</p>}
        </form>
      </div>
    </UserLayout>
  );
}

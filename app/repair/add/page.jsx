"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import UserLayout from "@/app/components/UserLayout";
import { API_ENDPOINTS } from "@/app/config/api";
import { REPAIR_PRIORITY, getPriorityColor } from "@/app/components/repair/RepairPriority";
import { REPAIR_STATUS, getStatusColor } from "@/app/components/repair/RepairStatus";

export default function AddRepair() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        asset_id: "",
        img_url: "",
        priority: "",
        problem_detail: "",
        request_date: "",
        request_status: "",
        technician_id: "",
        user_id: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">รหัสครุภัณฑ์</label>
                            <input
                                type="number"
                                name="asset_id"
                                value={formData.asset_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">URL รูปภาพ (คั่นด้วย ,)</label>
                            <input
                                type="text"
                                name="img_url"
                                value={formData.img_url}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">ความเร่งด่วน</label>
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
                        <div>
                            <label className="block text-gray-700">รหัสช่างซ่อม</label>
                            <input
                                type="number"
                                name="technician_id"
                                value={formData.technician_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">รหัสผู้ใช้</label>
                            <input
                                type="number"
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border rounded-lg"
                                required
                            />
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
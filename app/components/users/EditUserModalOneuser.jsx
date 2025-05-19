"use client";
import { useState } from "react";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
import SearchSelectDepartments from "@/app/components/users/SearchSelectDepartments";
import SearchSelectGender from "@/app/components/users/SearchSelectGender";

export default function EditUserModal({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    user_id: user.user_id,
    username: user.username,
    f_name: user.f_name,
    l_name: user.l_name,
    email: user.email,
    departments_id: user.departments_id || "",
    gender: user.gender || "",
    date_of_birth: user.date_of_birth || "",
    phone_number: user.phone_number || "",
    address: user.address || "",
    role: user.role || "",
    status: user.status || "",
    line_id: user.line_id || "",
    line_token: user.line_token || "",
    created_at: user.created_at,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    //console.log(password)
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{10,}$/;
    //console.log("Password validation regex:", regex.test(password));
    return regex.test(password);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPasswordError("");

    if (!validatePassword(passwordData.newPassword)) {
      setPasswordError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 10 ตัว และประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่ไม่ตรงกัน");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.users.update}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          password: passwordData.newPassword,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        setShowPasswordChange(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        });
        onSuccess({ ...user, message: "เปลี่ยนรหัสผ่านสำเร็จ" });
      } else {
        setPasswordError(result.message || "รหัสผ่านปัจจุบันไม่ถูกต้อง");
      }
    } catch (err) {
      setPasswordError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_ENDPOINTS.users.update}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 200) {
        onSuccess(result.data);
        onClose();
      } else {
        setError(result.message || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  const renderPasswordChangeForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">เปลี่ยนรหัสผ่าน</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่านปัจจุบัน
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({
                ...passwordData,
                currentPassword: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่านใหม่
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({
                ...passwordData,
                newPassword: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ยืนยันรหัสผ่านใหม่
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({
                ...passwordData,
                confirmPassword: e.target.value
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          {passwordError && (
            <div className="text-red-500 text-sm">{passwordError}</div>
          )}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setShowPasswordChange(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">แก้ไขข้อมูลผู้ใช้</h2>
          <div className="space-x-2">
            <button
              onClick={() => setShowPasswordChange(true)}
              className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            >
              เปลี่ยนรหัสผ่าน
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-800 text-gray-100 rounded hover:bg-red-300"
            >
              ปิด
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                รหัสผู้ใช้
              </label>
              <p className="mt-1">{formData.user_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ชื่อ
              </label>
              <input
                type="text"
                value={formData.f_name}
                onChange={(e) =>
                  setFormData({ ...formData, f_name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                นามสกุล
              </label>
              <input
                type="text"
                value={formData.l_name}
                onChange={(e) =>
                  setFormData({ ...formData, l_name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                อีเมล
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                แผนก departments_id: {formData.departments_id}
              </label>
              <SearchSelectDepartments
                value={formData.departments_id}
                onChange={(departmentsId) =>
                  setFormData({ ...formData, departments_id: departmentsId})
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                เพศ gender value: {formData.gender}
              </label>
              <SearchSelectGender
                value={formData.gender}
                onChange={(genderId) =>
                  setFormData({ ...formData, gender: genderId })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                วันเกิด date_of_birth:{formData.date_of_birth}
              </label>
              <input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                เบอร์โทร
              </label>
              <input
                type="number"
                value={formData.phone_number}
                onChange={(e) =>
                  setFormData({ ...formData, phone_number: e.target.value })
                }
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="0901221114"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                ที่อยู่
              </label>
              <textarea
                rows="5"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-800 text-gray-100 rounded hover:bg-red-300"
              disabled={loading}
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "กำลังบันทึก..." : "บันทึก"}
            </button>
          </div>
        </form>

        {showPasswordChange && renderPasswordChangeForm()}
      </div>
    </div>
  );
}

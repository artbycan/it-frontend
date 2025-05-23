"use client";
import DepartmentDetails from "@/app/components/departments/DepartmentDetails";
import SearchSelectGender from "@/app/components/users/SearchSelectGender";
import SearchSelectUserRole from "@/app/components/users/SearchSelectUserRole";
import SearchSelectUserStatus from "@/app/components/users/SearchSelectUserStatus";

export default function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">รายละเอียดผู้ใช้งาน</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-800 text-gray-100 rounded hover:bg-red-300"
          >
            ปิด
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-sm font-medium text-gray-500">รหัสผู้ใช้</p>
            <p className="mt-1">{user.user_id}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">ชื่อผู้ใช้</p>
            <p className="mt-1">{user.username}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ชื่อ-นามสกุล</p>
            <p className="mt-1">{`${user.f_name} ${user.l_name}`}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">อีเมล</p>
            <p className="mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เพศ</p>
            <SearchSelectGender value={user.gender} type="show" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันเกิด</p>
            <p className="mt-1">{user.date_of_birth || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">เบอร์โทรศัพท์</p>
            <p className="mt-1">{user.phone_number || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">LINE ID</p>
            <p className="mt-1">{user.line_id || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">แผนก</p>
            <div className="mt-1">
              <DepartmentDetails departmentId={user.departments_id} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">สถานะ</p>
            <SearchSelectUserStatus value={user.status} type="show" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">บทบาท</p>
            <SearchSelectUserRole value={user.role} type="show" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันที่สร้าง</p>
            <p className="mt-1">
              {user.created_at
                ? new Date(user.created_at).toLocaleString("th-TH")
                : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">วันที่แก้ไข</p>
            <p className="mt-1">
              {user.updated_at
                ? new Date(user.updated_at).toLocaleString("th-TH")
                : "-"}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium text-gray-500">ที่อยู่</p>
            <p className="mt-1">{user.address || "-"}</p>
          </div>
        </div>

      </div>
    </div>
  );
}

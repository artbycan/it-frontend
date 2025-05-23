"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/app/config/api";

import SearchSelectDepartments from "@/app/components/users/SearchSelectDepartments";
import SearchSelectGender from "@/app/components/users/SearchSelectGender";
// Reuse LINE authentication functions
const getLineAccessToken = async (code) => {
  // ...copy from callback/page.jsx...
};

const getLineProfile = async (accessToken) => {
  // ...copy from callback/page.jsx...
};

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lineProfile, setLineProfile] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    f_name: "",
    l_name: "",
    gender: "",
    date_of_birth: "",
    address: "",
    phone_number: "",
    departments_id: 1,
    role: "3", // Default user role
    status: "0", // Default active status
    line_id: "",
    line_token: "",
  });

  useEffect(() => {
    // Handle LINE data from callback
    const line_id = searchParams.get("line_id");
    const line_token = searchParams.get("line_token");
    const display_name = searchParams.get("display_name");

    if (line_id && line_token) {
      setLineProfile({ userId: line_id, displayName: display_name });
      setFormData((prev) => ({
        ...prev,
        line_id,
        line_token,
        f_name: display_name || prev.f_name,
      }));
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.auth.signup, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        // Store user data and redirect
        localStorage.setItem("username", result.data.username);
        localStorage.setItem(
          "user_fullname",
          `${result.data.f_name} ${result.data.l_name}`
        );
        localStorage.setItem("user_id", result.data.user_id);
        router.push("/repair");
      } else {
        setError(result.message || "การลงทะเบียนไม่สำเร็จ");
      }
    } catch (error) {
      setError("เกิดข้อผิดพลาดในการลงทะเบียน");
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  };

  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_LINE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_LINE_SIGNUP_REDIRECT_URI}&state=signup&scope=profile`;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            ลงทะเบียนผู้ใช้งาน
          </h2>
        </div>

        {!lineProfile && (
          <div className="text-center mb-8">
            <a
              href={lineLoginUrl}
              className="inline-flex items-center px-4 py-2 bg-[#00B900] text-white rounded-md hover:bg-[#009900]"
            >
              <img src="/line-icon.png" alt="LINE" className="w-5 h-5 mr-2" />
              เชื่อมต่อกับ LINE
            </a>
          </div>
        )}

        {lineProfile && (
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-lg shadow"
          >
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
              />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">
                    รหัสผ่าน
                </label>
                <input
                    type="password"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                    }
                />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <input
                type="email"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ที่อยู่
              </label>
              <input
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
              />
            </div>

            {/* Add other form fields... */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อ
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.f_name}
                  onChange={(e) =>
                    setFormData({ ...formData, f_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  นามสกุล
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.l_name}
                  onChange={(e) =>
                    setFormData({ ...formData, l_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  กลุ่มงาน/แผนก
                </label>
                <SearchSelectDepartments
                  value={formData.departments_id}
                  required
                  onChange={(value) =>
                    setFormData({ ...formData, departments_id: value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เพศ
                </label>
                <SearchSelectGender
                  required
                  value={formData.gender}
                  onChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  วันเกิด
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData({ ...formData, date_of_birth: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="phone"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    placeholder="xxx-xxx-xxxx"
                  required
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, phone_number: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Add remaining form fields following the same pattern */}

            <button
              type="submit"
              disabled={loading}
              //onMouseOver={console.log(formData)}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

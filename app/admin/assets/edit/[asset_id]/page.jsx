"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
import SearchSelectUser from "@/app/components/users/SearchSelectUser";
import SearchSelectDepartments from "@/app/components/users/SearchSelectDepartments";
import SearchSelectAssettypes from "@/app/components/assets/SearchSelectAssettypes";
import SearchSelectAssetbrands from "@/app/components/assets/SearchSelectAssetbrands";
import SearchSelectAssetmodels from "@/app/components/assets/SearchSelectAssetmodels";
import AssetStatus from "@/app/components/assets/AssetStatus";
import UploadFile from "@/app/components/UploadFile";
import ImageDisplay from "@/app/components/ImageDisplay";

export default function EditAssetPage({ params }) {
  const router = useRouter();
  const assetId = use(params).asset_id; // Properly unwrap params
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isUserSelectOpen, setIsUserSelectOpen] = useState(false);
  const [isDepartmentsSelectOpen, setIsDepartmentsSelectOpen] = useState(false);
  const [isAssettypesSelectOpen, setIsAssettypesSelectOpen] = useState(false);
  const [isAssetbrandsSelectOpen, setIsAssetbrandsSelectOpen] = useState(false);
  const [isAssetmodelsSelectOpen, setIsAssetmodelsSelectOpen] = useState(false);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.assets.getById}/${assetId}`,
          {
            headers: getAuthHeaders(),
          }
        );
        const result = await response.json();

        if (result.status === 200) {
          setAsset(result.data);
          setFormData({
            asset_id: result.data.asset_id,
            assetbrand_id: result.data.assetbrand_id,
            assetbrand_name: result.data.assetbrand_name,
            assetmodel_id: result.data.assetmodel_id,
            assetmodel_name: result.data.assetmodel_name,
            assets_in: result.data.assets_in,
            assets_name: result.data.assets_name,
            assets_num: result.data.assets_num,
            assets_num2: result.data.assets_num2,
            assetstypes_id: result.data.assettypes_id,
            assettypes_name: result.data.assettypes_name,
            departments_id: result.data.departments_id,
            img_url: result.data.img_url,
            note: result.data.note || "ไม่ระบุ",
            price: result.data.price,
            purchase_date: result.data.purchase_date?.split(" ")[0],
            serial_number: result.data.serial_number,
            status: result.data.status,
            user_id: result.data.user_id,
            warranty: result.data.warranty,
            name: `${result.data.f_name}   ${result.data.l_name}`,
            departments_name: result.data.departments_name,
          });
        } else {
          setError("ไม่สามารถดึงข้อมูลครุภัณฑ์ได้");
        }
      } catch (err) {
        setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
      } finally {
        setLoading(false);
      }
    };

    if (assetId) {
      fetchAsset();
    }
  }, [assetId]); // Update dependency array

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch(`${API_ENDPOINTS.assets.update}`, {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.status === 200) {
        router.push("/admin/assets");
      } else {
        setError(result.message || "ไม่สามารถบันทึกข้อมูลได้");
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setSaving(false);
    }
  };

  const handleUserEdit = () => {
    setIsUserSelectOpen(true);
  };

  const handleUserSelect = (userId, userData) => {
    setFormData((prev) => ({
      ...prev,
      user_id: userId,
      name: `${userData.f_name} ${userData.l_name}`,
    }));
    setIsUserSelectOpen(false);
  };

  const handleDepartmentsEdit = () => {
    setIsDepartmentsSelectOpen(true);
  };

  const handleDepartmentsSelect = (departmentsId, departmentsData) => {
    setFormData((prev) => ({
      ...prev,
      departments_id: departmentsId,
      departments_name: departmentsData.departments_name,
    }));
    setIsDepartmentsSelectOpen(false);
  };

  const handleAssettypesEdit = () => {
    setIsAssettypesSelectOpen(true);
  };

  const handleAssettypesSelect = (assettypesId, assettypesData) => {
    setFormData((prev) => ({
      ...prev,
      assetstypes_id: assettypesId,
      assettypes_name: assettypesData.assettypes_name,
    }));
    setIsAssettypesSelectOpen(false);
  };

  const handleAssetbrandsEdit = () => {
    setIsAssetbrandsSelectOpen(true);
  };

  const handleAssetbrandsSelect = (assetbrandsId, assetbrandsData) => {
    setFormData((prev) => ({
      ...prev,
      assetbrand_id: assetbrandsId,
      assetbrand_name: assetbrandsData.assetbrand_name,
    }));
    setIsAssetbrandsSelectOpen(false);
  };

  const handleAssetmodelsEdit = () => {
    setIsAssetmodelsSelectOpen(true);
  };

  const handleAssetmodelsSelect = (assetmodelsId, assetmodelsData) => {
    setFormData((prev) => ({
      ...prev,
      assetmodel_id: assetmodelsId,
      assetmodel_name: assetmodelsData.assetmodel_name,
    }));
    setIsAssetmodelsSelectOpen(false);
  };

  if (loading)
    return (
      <AdminLayout>
        <div className="p-4">กำลังโหลด...</div>
      </AdminLayout>
    );
  if (error)
    return (
      <AdminLayout>
        <div className="p-4 text-red-600">{error}</div>
      </AdminLayout>
    );
  if (!asset)
    return (
      <AdminLayout>
        <div className="p-4">ไม่พบข้อมูลครุภัณฑ์</div>
      </AdminLayout>
    );

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">แก้ไขข้อมูลครุภัณฑ์</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
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
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ชื่อครุภัณฑ์
                </label>
                <input
                  type="text"
                  value={formData.assets_name}
                  onChange={(e) =>
                    setFormData({ ...formData, assets_name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  หมายเลขครุภัณฑ์
                </label>
                <input
                  type="text"
                  value={formData.assets_num}
                  onChange={(e) =>
                    setFormData({ ...formData, assets_num: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              {/* เลือกประเภทครุภัณฑ์ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ประเภทครุภัณฑ์
                </label>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <span>รหัส: {formData.assetstypes_id}</span>
                    <span>|</span>
                    <span>ชื่อ: {formData.assettypes_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAssettypesEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="เลือกประเภทครุภัณฑ์"
                  >
                    ✏️
                  </button>
                </div>

                {isAssettypesSelectOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          เลือกประเภทครุภัณฑ์
                        </h3>
                        <button
                          onClick={() => setIsAssettypesSelectOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <SearchSelectAssettypes
                        value={formData.assetstypes_id}
                        onChange={(assettypesId, assettypesData) =>
                          handleAssettypesSelect(assettypesId, assettypesData)
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* จบเลือกประเภทครุภัณฑ์ */}

              {/* ยี่ห้อครุภัณฑ์ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ยี่ห้อครุภัณฑ์
                </label>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <span>รหัส: {formData.assetbrand_id}</span>
                    <span>|</span>
                    <span>ชื่อ: {formData.assetbrand_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAssetbrandsEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="เลือกยี่ห้อครุภัณฑ์"
                  >
                    ✏️
                  </button>
                </div>

                {isAssetbrandsSelectOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          เลือกยี่ห้อครุภัณฑ์
                        </h3>
                        <button
                          onClick={() => setIsAssetbrandsSelectOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <SearchSelectAssetbrands
                        value={formData.assetbrand_id}
                        onChange={(assetbrandsId, assetbrandsData) =>
                          handleAssetbrandsSelect(
                            assetbrandsId,
                            assetbrandsData
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* จบยี่ห้อครุภัณฑ์ */}

              {/* รุ่นครุภัณฑ์ */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  รุ่นครุภัณฑ์
                </label>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <span>รหัส: {formData.assetmodel_id}</span>
                    <span>|</span>
                    <span>ชื่อ: {formData.assetmodel_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAssetmodelsEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="เลือกรุ่นครุภัณฑ์"
                  >
                    ✏️
                  </button>
                </div>

                {isAssetmodelsSelectOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          เลือกรุ่นครุภัณฑ์
                        </h3>
                        <button
                          onClick={() => setIsAssetmodelsSelectOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <SearchSelectAssetmodels
                        value={formData.assetmodel_id}
                        onChange={(assetmodelsId, assetmodelsData) =>
                          handleAssetmodelsSelect(
                            assetmodelsId,
                            assetmodelsData
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* จบรุ่นครุภัณฑ์ */}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  วันที่สิ้นสุดการรับประกัน
                </label>
                <input
                  type="date"
                  value={formData.warranty}
                  onChange={(e) =>
                    setFormData({ ...formData, warranty: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ราคา
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: Number(e.target.value) })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  วันที่จัดซื้อ
                </label>
                <input
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) =>
                    setFormData({ ...formData, purchase_date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Serial Number
                </label>
                <input
                  type="text"
                  value={formData.serial_number}
                  onChange={(e) =>
                    setFormData({ ...formData, serial_number: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  สถานะของครุภัณฑ์
                </label>
                <AssetStatus
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                  disAbled={false} // Set to true if you want to disable the select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {/* จบส่วนคุรุภัณฑ์ */}

            <div className="inline-flex items-center justify-center w-full">
              <hr className="w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
              <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900"></span>
            </div>

            {/* เริ่มส่วนผู้ใช้งาน */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  วันที่รับเข้าแผนก/กลุ่มงาน
                </label>
                <input
                  type="date"
                  value={formData.assets_in}
                  onChange={(e) =>
                    setFormData({ ...formData, assets_in: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ผู้รับผิดชอบ
                </label>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <span>รหัส: {formData.user_id}</span>
                    <span>|</span>
                    <span>ชื่อ: {formData.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleUserEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="เลือกผู้รับผิดชอบ"
                  >
                    ✏️
                  </button>
                </div>

                {isUserSelectOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">
                          เลือกผู้รับผิดชอบ
                        </h3>
                        <button
                          onClick={() => setIsUserSelectOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <SearchSelectUser
                        value={formData.user_id}
                        onChange={(userId, userData) =>
                          handleUserSelect(userId, userData)
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                {/* ตัวเลือกแผนก */}
                <label className="block text-sm font-medium text-gray-700">
                  แผนก
                </label>
                <div className="flex items-center justify-between p-2 border rounded-md">
                  <div className="flex items-center space-x-2">
                    <span>รหัส: {formData.departments_id}</span>
                    <span>|</span>
                    <span>ชื่อ: {formData.departments_name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDepartmentsEdit}
                    className="text-blue-600 hover:text-blue-800"
                    title="เลือกแผนก"
                  >
                    ✏️
                  </button>
                </div>

                {isDepartmentsSelectOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg w-96">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium">เลือกแผนก</h3>
                        <button
                          onClick={() => setIsDepartmentsSelectOpen(false)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </button>
                      </div>
                      <SearchSelectDepartments
                        value={formData.departments_id}
                        onChange={(departmentsId, departmentsData) =>
                          handleDepartmentsSelect(
                            departmentsId,
                            departmentsData
                          )
                        }
                        required
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  หมายเหตุ
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {/* <div>{formData.note}</div> */}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push("/admin/assets")}
                className="px-4 py-2 text-gray-100 bg-red-600 rounded-md hover:bg-red-200 hover:text-red-800"
                disabled={saving}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-200 hover:text-blue-900"
                disabled={saving}
              >
                {saving ? "กำลังบันทึก..." : "บันทึก"}
              </button>
              {/* <button
                onClick={console.log(formData)}
                className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-200 hover:text-green-900"
              >
                logfromData
              </button> */}
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}

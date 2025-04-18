"use client";
import { useState, useEffect } from "react";
import SearchSelectAssetbrands from "@/app/components/assets/SearchSelectAssetbrands";
import SearchSelectAssetmodels from "@/app/components/assets/SearchSelectAssetmodels";
import SearchSelectAssettypes from "@/app/components/assets/SearchSelectAssettypes";
import ImageDisplay from "@/app/components/ImageDisplay";
import UploadFile from "@/app/components/UploadFile";
import { API_ENDPOINTS } from "@/app/config/api";

export default function StockForm({
  onSubmit,
  onCancel,
  initialData = null,
  isEditing = false,
}) {
  const [formData, setFormData] = useState({
    item_name: "",
    item_no: Math.floor(Date.now() / 1000).toString(),
    category: "",
    description: "",
    quantity: 0,
    unit: "อัน",
    assetbrand_id: "",
    assetbrand_name: "",
    assetmodel_id: "",
    assetmodel_name: "",
    assettypes_id: "",
    assettypes_name: "",
    image_url: "",
    created_by: "",
    stock_in: 0,
    stock_out: 0,
    price: 0,
    email: "-",
  });

  const [isAssettypesSelectOpen, setIsAssettypesSelectOpen] = useState(false);
  const [isAssetbrandsSelectOpen, setIsAssetbrandsSelectOpen] = useState(false);
  const [isAssetmodelsSelectOpen, setIsAssetmodelsSelectOpen] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      quantity: Number(prev.stock_in) - Number(prev.stock_out),
    }));
  }, [formData.stock_in, formData.stock_out]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = (urls) => {
    setFormData((prev) => ({
      ...prev,
      image_url: prev.image_url
        ? `${prev.image_url},${urls.join(",")}`
        : urls.join(","),
    }));
  };

  const handleAssettypesEdit = () => {
    setIsAssettypesSelectOpen(true);
  };

  const handleAssettypesSelect = (assettypesId, assettypesData) => {
    setFormData((prev) => ({
      ...prev,
      assettypes_id: assettypesId,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            รหัสอะไหล่
          </label>
          <input
            type="number"
            min="0"
            disabled
            readOnly
            value={formData.item_no}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, item_no: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ชื่ออะไหล่
          </label>
          <input
            type="text"
            placeholder="โปรดกรอกชื่ออะไหล่"
            value={formData.item_name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, item_name: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {/* ประเภทอะไหล่ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ประเภทอะไหล่
          </label>
          <div className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center space-x-2">
              <span>รหัส: {formData.assettypes_id}</span>
              <span>|</span>
              <span>ชื่อ: {formData.assettypes_name}</span>
            </div>
            <button
              type="button"
              onClick={handleAssettypesEdit}
              className="text-blue-600 hover:text-blue-800"
              title="เลือกประเภทอะไหล่"
            >
              ✏️
            </button>
          </div>

          {isAssettypesSelectOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">เลือกประเภทอะไหล่</h3>
                  <button
                    onClick={() => setIsAssettypesSelectOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <SearchSelectAssettypes
                  value={formData.assettypes_id}
                  onChange={handleAssettypesSelect}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* ยี่ห้อ */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            ยี่ห้อ
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
              title="เลือกยี่ห้อ"
            >
              ✏️
            </button>
          </div>

          {isAssetbrandsSelectOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">เลือกยี่ห้อ</h3>
                  <button
                    onClick={() => setIsAssetbrandsSelectOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <SearchSelectAssetbrands
                  value={formData.assetbrand_id}
                  onChange={handleAssetbrandsSelect}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* รุ่น */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            รุ่น
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
              title="เลือกรุ่น"
            >
              ✏️
            </button>
          </div>

          {isAssetmodelsSelectOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-4 rounded-lg w-96">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">เลือกรุ่น</h3>
                  <button
                    onClick={() => setIsAssetmodelsSelectOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <SearchSelectAssetmodels
                  value={formData.assetmodel_id}
                  onChange={handleAssetmodelsSelect}
                  required
                />
              </div>
            </div>
          )}
        </div>

        {/* Continue with other fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            หมวดหมู่
          </label>
          <input
            type="text"
            placeholder="โปรดกรอกหมวดหมู่ เช่น แรม, ฮาร์ดดิสก์"
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            หน่วย
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, unit: e.target.value }))
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
            min="0"
            value={formData.price}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                price: Number(e.target.value),
              }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนรับเข้า
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock_in}
            onChange={(e) => {
              const value = Number(e.target.value);
              setFormData((prev) => ({
                ...prev,
                stock_in: value,
                quantity: value - prev.stock_out,
              }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนจ่ายออก
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock_out}
            onChange={(e) => {
              const value = Number(e.target.value);
              setFormData((prev) => ({
                ...prev,
                stock_out: value,
                quantity: prev.stock_in - value,
              }));
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            จำนวนรวม
            <span className="text-red-500"> (จำนวนรับเข้า - จำนวนจ่ายออก)</span>
          </label>
          <input
            type="number"
            value={formData.quantity}
            disabled
            readOnly
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-gray-50"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ผู้บันทึก
          </label>
          <input
            type="text"
            placeholder="โปรดกรอกชื่อผู้บันทึก"
            value={formData.created_by}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, created_by: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            รายละเอียดเพิ่มเติม
          </label>
          <textarea
            value={formData.description}
            placeholder="โปรดกรอกรายละเอียดเพิ่มเติม"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            รูปภาพ
          </label>
          {formData.image_url && formData.image_url !== "noimg.jpg" && (
            <div className="mb-4">
              <ImageDisplay 
              urls={formData.image_url} 
              showDelete={true}
              onDelete={(newUrls) => {
                setFormData((prev) => ({
                  ...prev,
                  image_url: newUrls,
                }));
              }}
              />
            </div>
          )}
          <UploadFile
            onUploadSuccess={handleImageUpload}
            apiUrl={`${API_ENDPOINTS.files.upLoad}`}
            maxFiles={5}
            acceptedFileTypes="image/*"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          {isEditing ? "บันทึกการแก้ไข" : "เพิ่มอะไหล่"}
        </button>
      </div>
    </form>
  );
}

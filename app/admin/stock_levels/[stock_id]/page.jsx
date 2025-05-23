"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AdminLayout from "@/app/components/AdminLayout";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";
import ImageDisplay from "@/app/components/ImageDisplay";


export default function StockDetail() {
  const params = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockDetail = async () => {
      try {
        const response = await fetch(
          `${API_ENDPOINTS.stock_levels.getById}/${params.stock_id}`,
          {
            headers: getAuthHeaders(),
          }
        );
        const result = await response.json();
        if (result.status === 200) {
          setStock(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    if (params.stock_id) {
      fetchStockDetail();
    }
  }, [params.stock_id]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <button
            onClick={() => window.history.back()}
            className="absolute top-44 right-14 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            ปิด
          </button>

          <h1 className="text-2xl font-bold mb-6">
            รายละเอียดสต๊อคอะไหล่ #{stock?.stock_id}
          </h1>

          {loading ? (
            <div>กำลังโหลด...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : stock ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">ข้อมูลสต๊อคอะไหล่</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">รหัสสต๊อคอะไหล่</p>
                    <p className="font-medium">{stock.item_no}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ชื่อสต๊อคอะไหล่</p>
                    <p className="font-medium">{stock.item_name}</p>
                  </div>
                  {/* <div>
                    <p className="text-gray-600">หมวดหมู่</p>
                    <p className="font-medium">{stock.category}</p>
                  </div> */}
                  <div>
                    <p className="text-gray-600">หน่วย</p>
                    <p className="font-medium">{stock.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">ประเภท</p>
                    <p className="font-medium">{stock.assettypes_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">แบรนด์</p>
                    <p className="font-medium">{stock.assetbrand_name}</p>
                    </div>
                  <div>
                    <p className="text-gray-600">รุ่น</p>
                    <p className="font-medium">{stock.assetmodel_name}</p>
                    </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">ข้อมูลสต็อก</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">จำนวนคงเหลือ</p>
                    <p className="font-medium">
                      {stock.quantity} {stock.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">ราคา</p>
                    <p className="font-medium">{stock.price} บาท</p>
                  </div>
                  <div>
                    <p className="text-gray-600">รับเข้า</p>
                    <p className="font-medium">
                      {stock.stock_in} {stock.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">จ่ายออก</p>
                    <p className="font-medium">
                      {stock.stock_out} {stock.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">วันที่รับเข้า</p>
                    <p className="font-medium">
                      {new Date(stock.created_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">วันที่แก้ไขล่าสุด</p>
                    <p className="font-medium">
                      {new Date(stock.updated_at).toLocaleDateString("th-TH")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xl font-semibold">รายละเอียดเพิ่มเติม</h2>
                <p className="bg-gray-50 p-4 rounded">{stock.description}</p>
              </div>

              {stock.image_url && stock.image_url !== "noimg.jpg" && (
                <div className="md:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold">รูปภาพ</h2>
                  <ImageDisplay urls={stock.image_url} showDelete={false} />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </AdminLayout>
  );
}

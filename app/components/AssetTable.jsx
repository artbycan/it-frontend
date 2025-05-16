"use server";
import { API_ENDPOINTS } from "../config/api";
import AssetStatus from "@/app/components/assets/AssetStatus";
import { getAuthHeaders } from "@/app/utils/auth";

async function getAssets() {
  try {
    const response = await fetch(`${API_ENDPOINTS.assets.getRange}/0/0`,
                      {
                        headers: getAuthHeaders(),
                      });
    const result = await response.json();
    if (result.status === 200) {
      return result.data;
    }
    throw new Error("Failed to fetch data");
  } catch (err) {
    throw new Error(`Error: ${err.message}`);
  }
}

export default async function AssetTable() {
  const assets = await getAssets();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">รายการครุภัณฑ์</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">รหัสครุภัณฑ์</th>
              <th className="px-4 py-2 border">ชื่อครุภัณฑ์</th>
              <th className="px-4 py-2 border">หมายเลขครุภัณฑ์</th>
              <th className="px-4 py-2 border">ประเภท</th>
              <th className="px-4 py-2 border">แผนก</th>
              <th className="px-4 py-2 border">ผู้รับผิดชอบ</th>
              <th className="px-4 py-2 border">สถานะ</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.asset_id}>
                <td className="px-4 py-2 border">{asset.asset_id}</td>
                <td className="px-4 py-2 border">{asset.assets_name}</td>
                <td className="px-4 py-2 border">{asset.assets_num}</td>
                <td className="px-4 py-2 border">{asset.assetstypes_name}</td>
                <td className="px-4 py-2 border">{asset.departments_name}</td>
                <td className="px-4 py-2 border">{`${asset.f_name} ${asset.l_name}`}</td>
                <td className="px-4 py-2 border">
                  <AssetStatus 
                  value={asset.status}
                  disAbled={true}
                  Type="show"
                  ></AssetStatus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

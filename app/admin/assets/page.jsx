"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/app/components/AdminLayout";
import AssetsDetailsModal from "@/app/components/assets/AssetsDetailsModal";
import AddAssetForm from "@/app/components/assets/AddAssetForm";
import EditAssetForm from "@/app/components/assets/EditAssetForm";
import AssetStatus from "@/app/components/assets/AssetStatus";
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app//utils/auth";
import Link from "next/link";

const formatAssetId = (id) => {
  return `A${String(id).padStart(10, "0")}`;
};

export default function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState(null);

  const fetchTotalCount = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.assets.getCount, {
        headers: getAuthHeaders(),
      });
      const result = await response.json();
      
      if (result.status === 200) {
        console.log(result.data);
        return result.data || 0; // Ensure this returns a number
      } else {
        console.error('Failed to fetch total count');
      }
    } catch (error) {
      console.error('Error fetching total count:', error);
    }
  };
  //totalCount = fetchTotalCount(); // For testing purposes, remove this line in production

  const totalPages = Math.ceil(totalCount / pageSize);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      //totalCount =  7;
      const min = (currentPage - 1) * pageSize;
      const max = min + pageSize;
      //console.log(`Total Count : ${totalCount}`);

      const response = await fetch(`${API_ENDPOINTS.assets.getRange}/${min}/${max}`, {
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      if (result.status === 200) {
        setAssets(result.data || []);
        setTotalCount(result.total || 0); // Make sure your API returns total count
      } else {
        setError("Failed to fetch assets");
      }
    } catch (error) {
      setError("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetails = (asset) => {
    setSelectedAsset(asset);
    setIsDetailsModalOpen(true);
  };

  const handleAssetCreated = () => {
    fetchAssets();
  };

  const handleEditSuccess = (updatedAsset) => {
    setAssets(
      assets.map((asset) =>
        asset.asset_id === updatedAsset.asset_id ? updatedAsset : asset
      )
    );
  };

  useEffect(() => {
    //fetchTotalCount();
    fetchAssets();
  }, [currentPage]);

  const filteredAssets = assets
    .filter((asset) => {
      if (!asset) return false;
      const searchLower = searchTerm.toLowerCase();
      return (
        asset.assets_name.toLowerCase().includes(searchLower) ||
        asset.assets_num.toLowerCase().includes(searchLower) ||
        asset.departments_name.toLowerCase().includes(searchLower) ||
        `${asset.f_name} ${asset.l_name}`.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => b.asset_id - a.asset_id);

  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            แสดง {(currentPage - 1) * pageSize + 1} ถึง{" "}
            {Math.min(currentPage * pageSize, totalCount)} จากทั้งหมด {totalCount} รายการ
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ««
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            «
          </button>

          {pageNumbers.map(number => (
            <button
              key={number}
              onClick={() => setCurrentPage(number)}
              className={`px-3 py-1 rounded ${
                currentPage === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            »
          </button>

          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            »»
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">จัดการครุภัณฑ์</h1>
          <div className="flex items-center space-x-4">
            {/* <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              เพิ่มครุภัณฑ์
            </button> */}
            <Link href="/admin/assets/add">
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                + เพิ่มครุภัณฑ์
              </button>
            </Link>
            <input
              type="text"
              placeholder="ค้นหา..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded px-3 py-1 w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">กำลังโหลด...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    รหัสครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ชื่อครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    หมายเลขครุภัณฑ์
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    แผนก
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    ผู้รับผิดชอบ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    สถานะ
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.map((asset) => (
                  <tr key={asset.asset_id}>
                    <td className="px-6 py-4">
                      {formatAssetId(asset.asset_id)}
                    </td>
                    <td className="px-6 py-4">{asset.assets_name}</td>
                    <td className="px-6 py-4">{asset.assets_num}</td>
                    <td className="px-6 py-4">{asset.departments_name}</td>
                    <td className="px-6 py-4">{`${asset.f_name} ${asset.l_name}`}</td>
                    <td className="px-6 py-4">
                      <AssetStatus
                        value={asset.status}
                        disAbled={true}
                        className="text-xs font-semibold text-gray-700 uppercase"
                        id={`status-${asset.asset_id}`}
                        Type="show"
                      ></AssetStatus>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleShowDetails(asset)}
                          className="text-blue-600 hover:text-blue-800"
                          title="ดูรายละเอียด"
                        >
                          ℹ️
                        </button>
                        <Link href={`/admin/assets/edit/${asset.asset_id}`}>
                          <button
                            className="text-yellow-600 hover:text-yellow-800"
                            title="แก้ไข"
                          >
                            ✏️
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination />
          </div>
        )}

        {isDetailsModalOpen && (
          <AssetsDetailsModal
            asset={selectedAsset}
            onClose={() => setIsDetailsModalOpen(false)}
          />
        )}

        {isAddModalOpen && (
          <AddAssetForm
            onClose={() => setIsAddModalOpen(false)}
            onSuccess={fetchAssets}
          />
        )}

        {isEditModalOpen && selectedAssetForEdit && (
          <EditAssetForm
            asset={selectedAssetForEdit}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedAssetForEdit(null);
            }}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </AdminLayout>
  );
}

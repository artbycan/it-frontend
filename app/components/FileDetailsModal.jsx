'use client'
import { useState } from 'react';
import {API_ENDPOINTS} from '@/app/config/api';

export default function FileDetailsModal({ file, onClose }) {
  const [imageError, setImageError] = useState(false);

  if (!file) return null;

  // Check if file is an image
  const isImage = file.file_name.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  // Generate image URL
  const imageUrl = `${API_ENDPOINTS.main}/file/${encodeURIComponent(file.file_name)}`;
  //console.log('imageUrl:', imageUrl);

  // Add the same helper function
  const formatFileId = (id) => {
    return `F${String(id).padStart(10, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">รายละเอียดไฟล์</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          {isImage && (
            <div className="flex flex-col items-center mb-4">
              {!imageError ? (
                <img
                  src={imageUrl}
                  alt={file.file_name}
                  className="w-[200px] h-[200px] object-cover rounded-lg border border-gray-200"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-[200px] h-[200px] flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
                  <div className="text-center p-4">
                    <span className="text-red-500 block mb-2">⚠️</span>
                    <p className="text-sm text-gray-500">ไม่สามารถแสดงรูปภาพได้</p>
                    <p className="text-xs text-gray-400 mt-1">{file.file_name}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">รหัสไฟล์</p>
              <p className="mt-1">{formatFileId(file.file_id)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ชื่อไฟล์</p>
              <p className="mt-1">{file.file_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ประเภทไฟล์</p>
              <p className="mt-1">{isImage ? 'รูปภาพ' : 'เอกสาร'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ดูไฟล์</p>
              <p className="mt-1">
                <a 
                  href={imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  เปิดไฟล์
                </a>
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">วันที่สร้าง</p>
              <p className="mt-1">
                {new Date(file.created_at).toLocaleString('th-TH')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">วันที่แก้ไข</p>
              <p className="mt-1">
                {new Date(file.updated_at).toLocaleString('th-TH')}
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
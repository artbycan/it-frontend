"use client";
import ImageDisplay from "@/app/components/ImageDisplay";
import AssetStatus from "@/app/components/assets/AssetStatus";

const formatAssetId = (id) => {
  return `A${String(id).padStart(10, "0")}`;
};

export default function AssetsDetailsModal({ asset, onClose }) {
  if (!asset) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">รายละเอียดครุภัณฑ์</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4">
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-800 text-gray-100 rounded hover:bg-red-300"
            >
              ปิด
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">รูปภาพ</p>
              {/* <p className="mt-1">{asset.img_url}</p> */}
              <ImageDisplay urls={asset.img_url} showDelete={false} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">รหัสครุภัณฑ์</p>
              <p className="mt-1">{formatAssetId(asset.asset_id)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ชื่อครุภัณฑ์</p>
              <p className="mt-1">{asset.assets_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                หมายเลขครุภัณฑ์
              </p>
              <p className="mt-1">{asset.assets_num}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ประเภท</p>
              <p className="mt-1">{asset.assetstypes_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ราคา</p>
              <p className="mt-1">{asset.price.toLocaleString("th-TH")} บาท</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">แผนก</p>
              <p className="mt-1">{asset.departments_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ผู้รับผิดชอบ</p>
              <p className="mt-1">{`${asset.f_name} ${asset.l_name}`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ยี่ห้อ/รุ่น</p>
              <p className="mt-1">{`${asset.assetbrand_name} ${asset.assetmodel_name}`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Serial Number</p>
              <p className="mt-1">{asset.serial_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                ระยะเวลารับประกัน
              </p>
              <p className="mt-1">{asset.warranty}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">วันที่ซื้อ</p>
              <p className="mt-1">
                {new Date(asset.purchase_date).toLocaleDateString("th-TH")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">สถานะ</p>
              <p className="mt-1">
                <AssetStatus value={asset.status} disAbled={true} Type="show" />
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">หมายเหตุ</p>
              <p className="mt-1">{asset.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

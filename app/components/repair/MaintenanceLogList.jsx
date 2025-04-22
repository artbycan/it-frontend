"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import { MAINTENANCE_TYPES } from "./MaintenanceTypes";
import ImageDisplay from "../ImageDisplay";

export default function MaintenanceLogList({ logs = [] }) {
  const [expandedLogs, setExpandedLogs] = useState({});

  // Calculate total cost using useMemo
  const totalCost = useMemo(() => {
    return logs.flat().reduce((sum, log) => sum + (log.cost || 0), 0);
  }, [logs]);

  const toggleLog = (logId) => {
    setExpandedLogs((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  const getActionTypeName = (typeId) => {
    const type = MAINTENANCE_TYPES.find((t) => t.id === parseInt(typeId));
    return type ? type.name : "ไม่ระบุ";
  };

  const shouldShowDetails = (typeAction) => {
    const hideTypes = [0, 4, 5, 6];
    return !hideTypes.includes(Number(typeAction));
  };

  return (
    <div className="space-y-4">
      {/* Add total cost summary at the top */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">ประวัติการดำเนินการ</h2>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg">
          <span className="font-medium">ค่าใช้จ่ายรวม: </span>
          <span className="font-bold">
            {totalCost.toLocaleString("th-TH")} บาท
          </span>
        </div>
      </div>

      {logs.flat().map((log) => (
        <div
          key={log.log_id}
          className="border rounded-lg shadow-sm bg-white overflow-hidden"
        >
          <div
            onClick={() => toggleLog(log.log_id)}
            className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  ครั้งที่ {log.log_no}:{" "}
                  {getActionTypeName(log.type_action)}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString("th-TH")}
                </span>
              </div>
            </div>
            <span
              className="text-gray-400 transition-transform duration-200"
              style={{
                transform: expandedLogs[log.log_id] ? "rotate(180deg)" : "",
              }}
            >
              ▼
            </span>
          </div>

          {expandedLogs[log.log_id] && (
            <div className="p-4 border-t bg-gray-50">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">วันที่เริ่มดำเนินการ</p>
                  <p>{new Date(log.start_date).toLocaleString("th-TH")}</p>
                </div>
                <div>
                  <p className="text-gray-600">วันที่แล้วเสร็จ</p>
                  <p>{new Date(log.end_date).toLocaleString("th-TH")}</p>
                </div>

                {shouldShowDetails(log.type_action) && (
                  <>
                    <div className="md:col-span-2">
                      <p className="text-gray-600">การดำเนินการ</p>
                      <p className="bg-white p-2 rounded">{log.action_taken}</p>
                    </div>

                    {log.spare_parts !== "-" && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600">อะไหล่ที่ใช้</p>
                        {(() => {
                          try {
                            const spareData = JSON.parse(log.spare_parts);
                            return (
                              <div className="bg-white p-2 rounded">
                                <p className="font-medium">
                                  {spareData.item_name}
                                </p>
                                <div className="text-sm text-gray-600">
                                  <p>รหัส: {spareData.item_no}</p>
                                  <p>หมวดหมู่: {spareData.category}</p>
                                  <p>
                                    จำนวนคงเหลือหลังเบิก: {spareData.quantity}{" "}
                                    {spareData.unit}
                                  </p>
                                  <p>
                                    ราคา:{" "}
                                    {spareData.price.toLocaleString("th-TH")}{" "}
                                    บาท
                                  </p>
                                  {spareData.description && (
                                    <p>
                                      รายละเอียด: {spareData.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          } catch (error) {
                            // Fallback to display raw data if JSON parsing fails
                            return (
                              <p className="bg-white p-2 rounded">
                                {log.spare_parts}
                              </p>
                            );
                          }
                        })()}
                      </div>
                    )}

                    <div>
                      <p className="text-gray-600">ค่าใช้จ่าย</p>
                      <p>{log.cost.toLocaleString("th-TH")} บาท</p>
                    </div>

                    {log.note !== "-" && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600">หมายเหตุ</p>
                        <p className="bg-white p-2 rounded">{log.note}</p>
                      </div>
                    )}
                  </>
                )}

                {log.img_url && log.img_url !== "noimg.jpg" && (
                  <div className="md:col-span-2">
                    <p className="text-gray-600 mb-2">รูปภาพ</p>
                    <ImageDisplay urls={log.img_url} showDelete={false} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

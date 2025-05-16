"use client";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
//import CloseIcon from '@mui/icons-material/Close';
import { API_ENDPOINTS } from "@/app/config/api";
import { getAuthHeaders } from "@/app/utils/auth";

interface MaintenanceRequest {
  request_id: number;
  assets_name: string;
  assets_num: string;
  user_username: string;
  user_fname: string;
  user_lname: string;
  technician_username: string;
  technician_fname: string;
  technician_lname: string;
  request_date: string;
  request_status: number;
  priority: number;
  problem_detail: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: MaintenanceRequest;
}

export default function Home() {
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMaintenanceData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.maintenance.getAll}`,
                  {
                    headers: getAuthHeaders(),
                  });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        if (result.status === 200) {
          setMaintenanceData(result.data);
        } else {
          setError(result.message);
        }
      } catch (error) {
        setError('Failed to fetch maintenance data');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, []);

  const getPriorityColor = (priority: number): { bg: string; border: string; text: string } => {
    switch (priority) {
      case 1: return { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' };
      case 2: return { bg: '#FFF7ED', border: '#F97316', text: '#9A3412' };
      case 3: return { bg: '#FEFCE8', border: '#EAB308', text: '#854D0E' };
      case 4: return { bg: '#F0FDF4', border: '#22C55E', text: '#166534' };
      default: return { bg: '#F9FAFB', border: '#9CA3AF', text: '#374151' };
    }
  };

  const events: CalendarEvent[] = maintenanceData.map(request => {
    const colors = getPriorityColor(request.priority);
    return {
      id: request.request_id.toString(),
      title: `${request.assets_name} (${request.user_fname})`,
      start: request.request_date,
      backgroundColor: colors.bg,
      borderColor: colors.border,
      textColor: colors.text,
      extendedProps: request
    };
  });

  const handleEventClick = (info: any) => {
    setSelectedEvent(info.event.extendedProps);
    setIsModalOpen(true);
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">ปฏิทินการดำเนินงาน</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          locale="th"
          events={events}
          eventClick={handleEventClick}
          height="auto"
          buttonText={{
            today: 'วันนี้',
            month: 'เดือน',
            week: 'สัปดาห์',
            day: 'วัน'
          }}
        />
      </div>

      <Dialog 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle className="flex justify-between items-center">
          <span>รายละเอียดการแจ้งซ่อม</span>
          <IconButton onClick={() => setIsModalOpen(false)}>
            ปิด
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedEvent && (
            <div className="grid gap-4 p-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">ข้อมูลครุภัณฑ์</h3>
                  <p className="text-sm">
                    ชื่อ: {selectedEvent.assets_name}<br />
                    รหัส: {selectedEvent.assets_num}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">ผู้แจ้ง</h3>
                  <p className="text-sm">
                    Username: {selectedEvent.user_username}<br />
                    ชื่อ-สกุล: {selectedEvent.user_fname} {selectedEvent.user_lname}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">ช่างผู้ดูแล</h3>
                  <p className="text-sm">
                    Username: {selectedEvent.technician_username}<br />
                    ชื่อ-สกุล: {selectedEvent.technician_fname} {selectedEvent.technician_lname}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">สถานะ</h3>
                  <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                    selectedEvent.request_status === 2 ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                  }`}>
                    {selectedEvent.request_status === 2 ? 'เสร็จสิ้น' : 'กำลังดำเนินการ'}
                  </span>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">รายละเอียดปัญหา</h3>
                  <p className="text-sm">{selectedEvent.problem_detail}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

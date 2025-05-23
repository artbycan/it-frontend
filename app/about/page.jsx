'use server'
// import { delay } from '@/app/utils/delay'
import Image from 'next/image'

export default async function AboutPage({params}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen flex items-center justify-center p-6">
      <div className="bg-white bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-400">
          ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์ สคร.1 เชียงใหม่
        </h1>
        <p className="mt-4 text-gray-700 text-lg">
          ระบบนี้พัฒนาขึ้นเพื่อให้บริการในการจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์สำนักงานควบคุมป้องกันโรคที่1 จังหวัดเชียงใหม่
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <span className="bg-teal-100 text-teal-800 rounded-full px-3 py-1 text-sm font-semibold">
            Version 1.0.0
          </span>
          <span className="bg-gray-100 text-gray-800 rounded-full px-3 py-1 text-sm font-semibold italic">
            Developed by ทีมพัฒนาระบบ IT สคร.1
          </span>
        </div>
        <div className="mt-8">
          <Image
            src="/odpc1.jpg"
            alt="โลโก้ สคร.1"
            width={250}
            height={250}
            className="rounded-full mx-auto shadow-lg"
          />
        </div>
      </div>
    </div>
  )
}

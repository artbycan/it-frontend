'use server'
import { delay } from '@/app/utils/delay'
import Image from 'next/image'

export default async function AboutPage({params}) {
  //await delay(3000) // Wait for 3 seconds
  return (
    <div className="min-h-screen items-center justify-center">
      <h1 className="text-4xl font-bold">ระบบจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์สำนักงานควบคุมป้องกันโรคที่1 จังหวัดเชียงใหม่</h1>
      <h2 className="mt-4 text-lg">ระบบนี้พัฒนาขึ้นเพื่อให้บริการในการจัดการข้อมูลการแจ้งซ่อมครุภัณฑ์สำนักงานควบคุมป้องกันโรคที่1 จังหวัดเชียงใหม่</h2>
      <h2 className="mt-4 text-lg">Version 1.0.0</h2>
      <h2 className="mt-4 text-lg">Developed by: ทีมพัฒนาระบบ IT สคร.1</h2>
      <img src="public/odpc1.jpg" alt="Logo" className="mt-4" width={200} height={200} />
    </div>
  )
}
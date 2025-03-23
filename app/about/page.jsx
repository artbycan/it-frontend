'use server'
import { delay } from '@/app/utils/delay'

export default async function AboutPage({params}) {
  await delay(3000) // Wait for 3 seconds
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">About</h1>
    </div>
  )
}
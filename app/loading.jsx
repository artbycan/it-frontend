export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin inline-block w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"></div>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-4xl font-bold text-gray-700">Loading</span>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          </div>
        </div>
        <p className="mt-4 text-lg text-gray-600">กรุณารอสักครู่หน้าเว็บกำลังโหลด</p>
      </div>
    </div>
  )
}
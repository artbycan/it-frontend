"use client";
import { useState } from "react";
import Image from "next/image";
import { API_ENDPOINTS } from '@/app/config/api'

export default function ImageDisplay({ urls }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const imagesPerPage = 5;

  if (!urls) return null;
  let imageUrls = urls.split(",").filter(url => url); // Remove empty strings

  if (imageUrls.length === 0) return null;

  // Calculate pagination
  const totalPages = Math.ceil(imageUrls.length / imagesPerPage);
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = imageUrls.slice(indexOfFirstImage, indexOfLastImage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4">
      {/* Main large image display */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 z-10"
            >
              ✕
            </button>
            <Image
              src={`${API_ENDPOINTS.files.get}/${selectedImage}`}
              alt={`Asset${selectedImage}`}
              width={800}
              height={600}
              className="object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}

      {/* Thumbnail grid */}
      <div className="grid grid-cols-5 gap-4">
        {currentImages.map((url, index) => (
          <div
            key={index}
            className="relative aspect-square border rounded-lg overflow-hidden cursor-pointer hover:opacity-75"
            onClick={() => setSelectedImage(url)}
          >
            <Image
              src={`${API_ENDPOINTS.files.get}/${url}`}
              alt={`img-${indexOfFirstImage + index + 1}`}
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-80 text-white text-sm p-0.2 text-center">
              รูปที่ {indexOfFirstImage + index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            ←
          </button>
          
          {/* {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          ))} */}
          
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            →
          </button>
        </div>
      )}

      {/* Image counter */}
      <div className="text-center text-sm text-gray-500">
        แสดง {indexOfFirstImage + 1} - {Math.min(indexOfLastImage, imageUrls.length)} จาก {imageUrls.length} รูป
      </div>
    </div>
  );
}

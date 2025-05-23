'use client'
import { useState } from 'react'

export default function UploadFile({ 
  apiUrl,
  onUploadSuccess,
  maxFiles = 10,
  acceptedFileTypes = "image/*",
  required = false 
}) {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedUrls, setUploadedUrls] = useState([])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length + files.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files in total`)
      return
    }
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    setError(null)
  }

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
  }

  const removeUploadedFile = (indexToRemove) => {
    setUploadedUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove))
    if (onUploadSuccess) {
      onUploadSuccess(uploadedUrls.filter((_, index) => index !== indexToRemove))
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (files.length === 0) {
      setError('Please select at least one file')
      return
    }

    setIsLoading(true)
    setError(null)
    
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'accept': 'application/json'
        },
        body: formData
      })

      const result = await response.json()

      if (result.status === 200) {
        // Assuming the API returns an array of URLs in result.data
        const newUrls = Array.isArray(result.data) ? result.data : [result.data]
        const updatedUrls = [...uploadedUrls, ...newUrls]
        setUploadedUrls(updatedUrls)
        setFiles([])
        if (onUploadSuccess) {
          onUploadSuccess(updatedUrls)
        }
      } else {
        setError(result.message || 'Upload failed')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileChange}
          className="w-full"
          required={required && uploadedUrls.length === 0}
          disabled={isLoading}
        />
        
        {files.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Selected files:</p>
            <ul className="list-disc list-inside">
              {files.map((file, index) => (
                <li key={index} className="text-sm flex items-center justify-between">
                  <span>{file.name} ({Math.round(file.size / 1024)} KB)</span>
                  <button 
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {uploadedUrls.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-green-600">Uploaded files:</p>
            <ul className="list-disc list-inside">
              {uploadedUrls.map((url, index) => (
                <li key={index} className="text-sm flex items-center justify-between">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    {url.split('/').pop()}
                  </a>
                  <button 
                    onClick={() => removeUploadedFile(index)}
                    className="text-red-500 hover:text-red-700 ml-2"
                    disabled={isLoading}
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isLoading || files.length === 0}
          className={`mt-4 px-4 py-2 rounded ${
            isLoading || files.length === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  )
}
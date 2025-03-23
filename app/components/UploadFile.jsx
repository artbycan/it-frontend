'use client'
import { useState } from 'react'

export default function UploadFile({ 
  apiUrl = 'http://localhost:8087/uploadfiles/',
  onUploadSuccess,
  maxFiles = 5,
  acceptedFileTypes = "image/*",
  required = false 
}) {
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    if (selectedFiles.length > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files at once`)
      return
    }
    setFiles(prevFiles => [...prevFiles, ...selectedFiles])
    setError(null)
  }

  const removeFile = (indexToRemove) => {
    setFiles(prevFiles => prevFiles.filter((_, index) => index !== indexToRemove))
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
        const newFiles = result.data
        setUploadedFiles(prev => [...prev, ...newFiles])
        setFiles([])
        if (onUploadSuccess) {
          onUploadSuccess(newFiles.join(','))
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
          required={required && uploadedFiles.length === 0}
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
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {uploadedFiles.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-green-600">Uploaded files:</p>
            <p className="text-sm">{uploadedFiles.join(', ')}</p>
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
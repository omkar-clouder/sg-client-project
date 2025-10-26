import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiDownload, FiFile, FiCheckCircle, FiXCircle, FiTrash2, FiEdit3, FiEye, FiDatabase, FiRefreshCw } from 'react-icons/fi'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import './App.css'

const API_URL = 'http://localhost:3000/api'

function App() {
  const [data, setData] = useState([])
  const [headers, setHeaders] = useState([])
  const [fileName, setFileName] = useState('')
  const [fileType, setFileType] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [editMode, setEditMode] = useState({ row: null, col: null })
  const [editValue, setEditValue] = useState('')
  const [savedDataId, setSavedDataId] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setFileName(file.name)
    const fileExtension = file.name.split('.').pop().toLowerCase()
    setFileType(fileExtension)
    setSavedDataId(null)

    if (fileExtension === 'csv') {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          setData(results.data)
          setHeaders(Object.keys(results.data[0] || []))
          setShowPreview(true)
        }
      })
    } else if (fileExtension === 'json') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const json = JSON.parse(e.target.result)
        setData(Array.isArray(json) ? json : [json])
        if (Array.isArray(json) && json.length > 0) {
          setHeaders(Object.keys(json[0]))
        }
        setShowPreview(true)
      }
      reader.readAsText(file)
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json(worksheet)
        setData(json)
        if (json.length > 0) {
          setHeaders(Object.keys(json[0]))
        }
        setShowPreview(true)
      }
      reader.readAsBinaryString(file)
    }
  }

  // Save data to backend
  const saveToBackend = async () => {
    if (data.length === 0) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, fileName, fileType })
      })
      const result = await response.json()
      if (result.success) {
        setSavedDataId(result.id)
        alert('✅ Data saved to database successfully!')
      }
    } catch (error) {
      console.error('Error saving data:', error)
      alert('❌ Failed to save data. Make sure backend is running.')
    }
    setLoading(false)
  }

  // Update saved data in backend
  const updateBackend = async () => {
    if (!savedDataId || data.length === 0) return
    
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/data/${savedDataId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, fileName, fileType })
      })
      const result = await response.json()
      if (result.success) {
        alert('✅ Data updated in database successfully!')
      }
    } catch (error) {
      console.error('Error updating data:', error)
      alert('❌ Failed to update data.')
    }
    setLoading(false)
  }

  const exportToCSV = () => {
    if (data.length === 0) return
    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv' })
    downloadFile(blob, 'export.csv', 'text/csv')
  }

  const exportToJSON = () => {
    if (data.length === 0) return
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    downloadFile(blob, 'export.json', 'application/json')
  }

  const exportToExcel = () => {
    if (data.length === 0) return
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, 'export.xlsx')
  }

  const downloadFile = (blob, filename, type) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteRow = (index) => {
    setData(data.filter((_, i) => i !== index))
  }

  const handleEdit = (row, col) => {
    setEditMode({ row, col })
    setEditValue(data[row][col] || '')
  }

  const saveEdit = () => {
    if (editMode.row !== null && editMode.col !== null) {
      const newData = [...data]
      newData[editMode.row][editMode.col] = editValue
      setData(newData)
    }
    setEditMode({ row: null, col: null })
    setEditValue('')
  }

  const cancelEdit = () => {
    setEditMode({ row: null, col: null })
    setEditValue('')
  }

  return (
    <div className="min-h-screen animated-gradient">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Import & Export Hub
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Upload, edit, and export your data with ease
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Import Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-500 rounded-xl">
                <FiUpload className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Import Data</h2>
            </div>
            
            <div className="space-y-4">
              <label className="block">
                <input
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <div className="flex items-center justify-center p-8 border-3 border-dashed border-white/50 rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300">
                  <div className="text-center">
                    <FiFile className="text-4xl mx-auto mb-3 text-white" />
                    <p className="text-white font-semibold">Click to upload</p>
                    <p className="text-white/70 text-sm mt-2">CSV, JSON, or Excel files</p>
                  </div>
                </div>
              </label>
              
              {fileName && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-between p-4 bg-white/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FiCheckCircle className="text-green-400 text-xl" />
                    <span className="text-white font-medium">{fileName}</span>
                  </div>
                  <span className="text-white/70 text-sm">{data.length} rows</span>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Export Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="glass rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-500 rounded-xl">
                <FiDownload className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Export Data</h2>
            </div>

            <div className="space-y-3">
              {savedDataId ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={updateBackend}
                  disabled={data.length === 0 || loading}
                  className="w-full p-4 bg-green-500 hover:bg-green-600 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? <FiRefreshCw className="animate-spin" /> : <FiDatabase />}
                  {loading ? 'Updating...' : 'Update in Database'}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={saveToBackend}
                  disabled={data.length === 0 || loading}
                  className="w-full p-4 bg-blue-500 hover:bg-blue-600 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {loading ? <FiRefreshCw className="animate-spin" /> : <FiDatabase />}
                  {loading ? 'Saving...' : 'Save to Database'}
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToCSV}
                disabled={data.length === 0}
                className="w-full p-4 bg-white hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FiDownload />
                Export as CSV
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToJSON}
                disabled={data.length === 0}
                className="w-full p-4 bg-white hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FiDownload />
                Export as JSON
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportToExcel}
                disabled={data.length === 0}
                className="w-full p-4 bg-white hover:bg-gray-100 rounded-xl font-semibold text-gray-800 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                <FiDownload />
                Export as Excel
              </motion.button>
            </div>

            {data.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 p-4 bg-white/10 rounded-xl"
              >
                <p className="text-white font-semibold mb-2">Data Statistics</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-white/80 text-sm">Rows: <span className="font-bold">{data.length}</span></div>
                  <div className="text-white/80 text-sm">Columns: <span className="font-bold">{headers.length}</span></div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="glass rounded-3xl p-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-500 rounded-xl">
                <FiEye className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-white">Features</h2>
            </div>

            <div className="space-y-3 text-white/90">
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <p>Multi-format support (CSV, JSON, Excel)</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <p>Edit data inline</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <p>Delete rows functionality</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <p>Multiple export options</p>
              </div>
              <div className="flex items-start gap-3">
                <FiCheckCircle className="text-green-400 mt-1 flex-shrink-0" />
                <p>Beautiful animated UI</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Data Preview Table */}
        {showPreview && data.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 glass rounded-3xl p-6 shadow-2xl overflow-hidden"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Data Preview</h3>
            <div className="overflow-x-auto max-h-96 overflow-y-auto rounded-xl">
              <table className="w-full bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden">
                <thead className="bg-white/20 sticky top-0">
                  <tr>
                    {headers.map((header, idx) => (
                      <th key={idx} className="px-4 py-3 text-left text-white font-semibold">
                        {header}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-left text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIdx) => (
                    <tr key={rowIdx} className="border-b border-white/10 hover:bg-white/10 transition-colors">
                      {headers.map((header, colIdx) => (
                        <td key={colIdx} className="px-4 py-3 text-white">
                          {editMode.row === rowIdx && editMode.col === colIdx ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 px-2 py-1 rounded text-gray-800"
                                autoFocus
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEdit()
                                  if (e.key === 'Escape') cancelEdit()
                                }}
                              />
                              <button
                                onClick={saveEdit}
                                className="px-3 py-1 bg-green-500 rounded text-white"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span>{row[header]}</span>
                          )}
                        </td>
                      ))}
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleEdit(rowIdx, headers[0])}
                            className="p-2 bg-blue-500 rounded hover:bg-blue-600 text-white"
                            title="Edit"
                          >
                            <FiEdit3 />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => deleteRow(rowIdx)}
                            className="p-2 bg-red-500 rounded hover:bg-red-600 text-white"
                            title="Delete"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default App


import React, { useState, useEffect, useRef } from 'react'
import {
  Camera,
  UserPlus,
  ClipboardList,
  Users,
  Trash2,
  CheckCircle,
  AlertCircle,
  Info,
  LogOut,
  User,
  RefreshCw,
  Trash
} from 'lucide-react'
import './index.css'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

function App() {
  const [activeTab, setActiveTab] = useState('attendance')
  const [attendance, setAttendance] = useState([])
  const [users, setUsers] = useState([])
  const [isCapturing, setIsCapturing] = useState(false)
  const [statusMsg, setStatusMsg] = useState({ text: '', type: '' })
  const [enrollName, setEnrollName] = useState('')
  const [loading, setLoading] = useState(false)

  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    fetchAttendance()
    fetchUsers()
  }, [])

  useEffect(() => {
    if (activeTab !== 'attendance' && activeTab !== 'enroll') {
      stopCamera()
    }
  }, [activeTab])

  const fetchAttendance = async () => {
    try {
      const res = await fetch(`${API_BASE}/attendance`)
      const data = await res.json()
      setAttendance(data)
    } catch (err) {
      console.error("Failed to fetch attendance", err)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/users`)
      const data = await res.json()
      setUsers(data)
    } catch (err) {
      console.error("Failed to fetch users", err)
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCapturing(true)
      }
    } catch (err) {
      showStatus("Camera access denied", "error")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsCapturing(false)
  }

  const showStatus = (text, type) => {
    setStatusMsg({ text, type })
    setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000)
  }

  const captureAndRecognize = async () => {
    if (!videoRef.current || loading) return
    setLoading(true)

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('file', blob, 'capture.jpg')

      try {
        const res = await fetch(`${API_BASE}/recognize`, {
          method: 'POST',
          body: formData
        })
        const data = await res.json()

        if (data.matches && data.matches.length > 0) {
          showStatus(`Welcome, ${data.matches.join(', ')}!`, "success")
          fetchAttendance()
        } else {
          showStatus("Identity not recognized", "info")
        }
      } catch (err) {
        showStatus("Recognition system error", "error")
      } finally {
        setLoading(false)
      }
    }, 'image/jpeg')
  }

  const handleEnroll = async (e) => {
    e.preventDefault()
    if (!enrollName) return showStatus("Please enter a name", "error")
    if (!videoRef.current) return showStatus("Start camera first", "error")
    setLoading(true)

    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)

    canvas.toBlob(async (blob) => {
      const formData = new FormData()
      formData.append('file', blob, 'enroll.jpg')
      formData.append('name', enrollName)

      try {
        const res = await fetch(`${API_BASE}/enroll`, {
          method: 'POST',
          body: formData
        })
        const data = await res.json()
        if (res.ok) {
          showStatus("User enrolled successfully", "success")
          setEnrollName('')
          fetchUsers()
          setActiveTab('users')
        } else {
          showStatus(data.detail || "Enrollment failed", "error")
        }
      } catch (err) {
        showStatus("Enrollment failed", "error")
      } finally {
        setLoading(false)
      }
    }, 'image/jpeg')
  }

  const deleteAttendance = async (logId) => {
    try {
      const res = await fetch(`${API_BASE}/attendance/${logId}`, { method: 'DELETE' })
      if (res.ok) {
        fetchAttendance()
        showStatus("Record deleted", "success")
      }
    } catch (err) {
      showStatus("Delete failed", "error")
    }
  }

  const deleteUser = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchUsers()
        showStatus("Identity removed from system", "success")
      } else {
        const data = await res.json()
        showStatus(data.detail || "Delete failed", "error")
      }
    } catch (err) {
      showStatus("Network error during delete", "error")
    }
  }

  return (
    <div className="container">
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title-gradient" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Vision Attendance</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: 500 }}>
          Professional Face Recognition Attendance System
        </p>
      </header>

      <center>
        <nav className="nav">
          <div
            className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            <Camera size={18} /> Attendance
          </div>
          <div
            className={`nav-item ${activeTab === 'enroll' ? 'active' : ''}`}
            onClick={() => setActiveTab('enroll')}
          >
            <UserPlus size={18} /> Enroll User
          </div>
          <div
            className={`nav-item ${activeTab === 'records' ? 'active' : ''}`}
            onClick={() => setActiveTab('records')}
          >
            <ClipboardList size={18} /> History
          </div>
          <div
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={18} /> Directory
          </div>
        </nav>
      </center>

      <main className="fade-in">
        {statusMsg.text && (
          <div className={`status-toast status-${statusMsg.type}`}>
            {statusMsg.type === 'success' && <CheckCircle size={20} />}
            {statusMsg.type === 'error' && <AlertCircle size={20} />}
            {statusMsg.type === 'info' && <Info size={20} />}
            <span style={{ fontWeight: 600 }}>{statusMsg.text}</span>
          </div>
        )}

        {(activeTab === 'attendance' || activeTab === 'enroll') && (
          <div className="glass-card" style={{ maxWidth: '840px', margin: '0 auto' }}>
            <div className="webcam-outer">
              <div className="webcam-container">
                <div className="webcam-shimmer" />
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: isCapturing ? 'block' : 'none' }}
                />
                {!isCapturing && (
                  <div style={{ textAlign: 'center' }}>
                    <div className="user-avatar" style={{ marginBottom: '1.5rem', opacity: 0.5 }}>
                      <Camera size={32} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Camera system is offline</p>
                  </div>
                )}
                {isCapturing && (
                  <>
                    <div className="scanning-line" />
                    <div className="webcam-overlay">
                      <div className="face-guide" />
                    </div>
                  </>
                )}
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
              {!isCapturing ? (
                <button onClick={startCamera}>
                  <Camera size={20} /> Initialize Camera
                </button>
              ) : (
                <button className="secondary" onClick={stopCamera}>
                  <LogOut size={20} /> Deactivate
                </button>
              )}

              {activeTab === 'attendance' && isCapturing && (
                <button onClick={captureAndRecognize} disabled={loading}>
                  {loading ? <RefreshCw size={20} className="spin" /> : <User size={20} />}
                  {loading ? 'Processing...' : 'Identify Face'}
                </button>
              )}
            </div>

            {activeTab === 'enroll' && isCapturing && (
              <form onSubmit={handleEnroll} style={{ marginTop: '2.5rem', maxWidth: '400px', margin: '2.5rem auto 0' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Full Name / Employee ID"
                    value={enrollName}
                    onChange={(e) => setEnrollName(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" style={{ width: '100%' }} disabled={loading}>
                  {loading ? <RefreshCw size={20} className="spin" /> : <CheckCircle size={20} />}
                  {loading ? 'Saving to Cloud...' : 'Register Identity'}
                </button>
              </form>
            )}
          </div>
        )}

        {activeTab === 'records' && (
          <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div className="records-card-header" style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ marginBottom: 0, fontSize: '1.5rem' }}>Attendance History</h3>
              <div style={{ background: 'var(--glass)', padding: '0.5rem 1rem', borderRadius: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Total Records: {attendance.length}
              </div>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Individual</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                        No records found in database
                      </td>
                    </tr>
                  ) : (
                    attendance.map((log) => (
                      <tr key={log.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="user-avatar" style={{ margin: 0, width: '32px', height: '32px', fontSize: '0.8rem' }}>
                              {log.user_name[0]}
                            </div>
                            <span style={{ fontWeight: 600 }}>{log.user_name}</span>
                          </div>
                        </td>
                        <td>{new Date(log.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>{new Date(log.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                        <td>
                          <button
                            className="secondary"
                            style={{ padding: '0.5rem', borderRadius: '10px', color: '#ef4444' }}
                            onClick={() => deleteAttendance(log.id)}
                            title="Delete entry"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="user-grid">
            {users.length === 0 ? (
              <div className="glass-card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem' }}>
                <p style={{ color: 'var(--text-muted)' }}>No users registered yet</p>
              </div>
            ) : (
              users.map(u => (
                <div key={u.id} className="glass-card user-card">
                  <div className="user-avatar">{u.name[0]}</div>
                  <h3 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>{u.name}</h3>
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>ID: #{u.id.toString().padStart(4, '0')}</p>
                  <button
                    className="secondary"
                    style={{ width: '100%', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                    onClick={() => deleteUser(u.id)}
                  >
                    <Trash size={16} /> Delete Identity
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{
        __html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}} />
    </div>
  )
}

export default App

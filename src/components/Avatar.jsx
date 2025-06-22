import { useEffect, useState } from 'react'
import { supabase } from '../supabase/supabase-client'

export default function Avatar({ url, size, onUpload }) {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  const downloadImage = async (path) => {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setAvatarUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  const uploadAvatar = async (event) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(event, filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="position-relative d-inline-block">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="rounded-circle border border-3 border-primary shadow"
          style={{ 
            height: size, 
            width: size, 
            objectFit: 'cover',
            cursor: 'pointer'
          }}
        />
      ) : (
        <div 
          className="rounded-circle bg-gradient border border-3 border-secondary d-flex align-items-center justify-content-center shadow"
          style={{ 
            height: size, 
            width: size,
            background: 'linear-gradient(45deg, #6c757d, #495057)',
            cursor: 'pointer'
          }}
        >
          <i className="fas fa-user text-white" style={{ fontSize: size * 0.4 }}></i>
        </div>
      )}
      
      {/* Upload overlay */}
      <div className="position-absolute top-0 start-0 w-100 h-100 rounded-circle d-flex align-items-center justify-content-center"
           style={{ 
             background: 'rgba(0,0,0,0.5)', 
             opacity: 0,
             transition: 'opacity 0.3s',
             cursor: 'pointer'
           }}
           onMouseEnter={(e) => e.target.style.opacity = 1}
           onMouseLeave={(e) => e.target.style.opacity = 0}>
        <i className="fas fa-camera text-white" style={{ fontSize: size * 0.2 }}></i>
      </div>

      <input
        type="file"
        id="avatar-upload"
        accept="image/*"
        onChange={uploadAvatar}
        disabled={uploading}
        className="position-absolute top-0 start-0 w-100 h-100 opacity-0"
        style={{ cursor: 'pointer' }}
      />
      
      {uploading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Caricamento...</span>
          </div>
        </div>
      )}
    </div>
  )
}
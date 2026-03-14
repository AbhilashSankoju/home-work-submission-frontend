import { useState, useRef } from 'react'
import { UploadCloud, FileText, X, CheckCircle2 } from 'lucide-react'

export default function FileUpload({ onFile }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile]         = useState(null)
  const ref = useRef()

  const handle = f => { if (!f) return; setFile(f); onFile(f) }
  const onDrop  = e => { e.preventDefault(); setDragging(false); handle(e.dataTransfer.files[0]) }
  const clear   = e => { e.stopPropagation(); setFile(null); onFile(null); ref.current.value = '' }

  return (
    <div className={`drop-zone ${dragging ? 'dragging' : ''}`}
      onClick={() => !file && ref.current.click()}
      onDragOver={e => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)} onDrop={onDrop}>
      <input ref={ref} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handle(e.target.files[0])} style={{ display: 'none' }} />
      {file ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', background: 'rgba(26,107,74,0.06)', border: '1px solid rgba(26,107,74,0.2)', borderRadius: '0.875rem', padding: '0.875rem 1rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: '0.75rem', background: 'rgba(26,107,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FileText style={{ width: 20, height: 20, color: '#1a6b4a' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.875rem', color: '#1a2332', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</p>
            <p style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#8a9ab0', marginTop: 2 }}>{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <CheckCircle2 style={{ width: 18, height: 18, color: '#1a6b4a', flexShrink: 0 }} />
          <button onClick={clear} style={{ width: 28, height: 28, border: '1px solid #e8e0d5', borderRadius: '0.5rem', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8a9ab0', flexShrink: 0 }}>
            <X style={{ width: 13, height: 13 }} />
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.875rem', padding: '0.5rem 0' }}>
          <div style={{ width: 56, height: 56, borderRadius: '1rem', background: 'rgba(26,107,74,0.08)', border: '1px solid rgba(26,107,74,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UploadCloud style={{ width: 26, height: 26, color: '#2d9068' }} />
          </div>
          <div>
            <p style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '0.9rem', color: '#334155' }}>
              Drop your file or <span style={{ color: '#1a6b4a', textDecoration: 'underline', cursor: 'pointer' }}>browse</span>
            </p>
            <p style={{ fontFamily: 'Lato', fontSize: '0.8rem', color: '#8a9ab0', marginTop: 4 }}>PDF, DOC, DOCX — max 20 MB</p>
          </div>
        </div>
      )}
    </div>
  )
}

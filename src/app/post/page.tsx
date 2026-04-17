'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const CATS = [
  { id: 1, name: 'Ul hodloh', icon: '🏠' },
  { id: 2, name: 'Teevriyn heregsel', icon: '🚗' },
  { id: 3, name: 'Ajil', icon: '💼' },
  { id: 4, name: 'Elektron', icon: '📱' },
  { id: 5, name: 'Huvtsas', icon: '👗' },
  { id: 6, name: 'Mal', icon: '🐄' },
  { id: 7, name: 'Huns', icon: '🥩' },
  { id: 8, name: 'Uilchilgee', icon: '🔧' },
  { id: 9, name: 'Busad', icon: '📦' },
]

export default function PostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [loc, setLoc] = useState('Ulaangom')
  const [phone, setPhone] = useState('')
  const [catId, setCatId] = useState(1)

  async function handleSubmit() {
    if (!title || !phone) {
      alert('Garchig bolон utasny dugaarыg boglono uu')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('listings').insert({
      title,
      description: desc,
      price: price ? parseInt(price) : null,
      location: loc,
      phone,
      category_id: catId,
      status: 'active',
      is_anonymous: true,
    })
    setLoading(false)
    if (error) { alert('Aldaa: ' + error.message); return }
    alert('Zar niitlegdlee!')
    router.push('/')
  }

  const inp = {
    width: '100%', padding: '11px 14px', borderRadius: 10,
    border: '1px solid #ddd', fontSize: 15,
    boxSizing: 'border-box' as const, marginTop: 6,
    fontFamily: 'sans-serif', background: '#fff'
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Zar nemeh</div>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>Angilal songoh</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {CATS.map(c => (
              <button key={c.id} onClick={() => setCatId(c.id)}
                style={{ padding: '10px 6px', borderRadius: 10, border: catId === c.id ? '2px solid #1D9E75' : '1px solid #ddd', background: catId === c.id ? '#E1F5EE' : '#fff', cursor: 'pointer', fontSize: 12, color: catId === c.id ? '#0F6E56' : '#555' }}>
                <div style={{ fontSize: 22 }}>{c.icon}</div>
                {c.name}
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Garchig *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="jnh: iPhone 13 zarna" style={inp} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Une</label><input value={price} onChange={e => setPrice(e.target.value)} placeholder="0 = Une tohoroltsono" style={inp} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Bairshil</label><input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Ulaangom" style={inp} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Tailbar</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Delgerenguui medeelel..." rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Utasny dugaar *</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9999 9999" style={inp} type="tel" /></div>
        </div>
        <button onClick={handleSubmit} disabled={loading}
          style={{ background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Niitlejj baina...' : 'Zar niitleh'}
        </button>
      </div>
    </main>
  )
}
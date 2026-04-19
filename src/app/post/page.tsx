'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const CATS = [
  { id: 1, name: 'Үл хөдлөх', icon: '🏠' },
  { id: 2, name: 'Тээврийн хэрэгсэл', icon: '🚗' },
  { id: 3, name: 'Ажил', icon: '💼' },
  { id: 4, name: 'Электрон бараа', icon: '📱' },
  { id: 5, name: 'Хувцас', icon: '👗' },
  { id: 6, name: 'Мал амьтан', icon: '🐄' },
  { id: 7, name: 'Хүнс', icon: '🥩' },
  { id: 8, name: 'Үйлчилгээ', icon: '🔧' },
  { id: 9, name: 'Бусад', icon: '📦' },
]

export default function PostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [catId, setCatId] = useState<number|null>(null)
  const [sellRent, setSellRent] = useState('')
  const [propType, setPropType] = useState('')
  const [rooms, setRooms] = useState('')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [loc, setLoc] = useState('Улаангом')
  const [phone, setPhone] = useState('')

  const inp = { width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid #ddd', fontSize: 15, boxSizing: 'border-box' as const, marginTop: 6, fontFamily: 'sans-serif', background: '#fff' }
  const btn = (active: boolean) => ({ padding: '14px', borderRadius: 12, border: active ? '2px solid #1D9E75' : '1px solid #ddd', background: active ? '#E1F5EE' : '#fff', cursor: 'pointer', fontSize: 15, color: active ? '#0F6E56' : '#333', width: '100%', textAlign: 'left' as const, marginBottom: 8 })

  async function submit() {
    if (!title || !phone) { alert('Гарчиг болон утасны дугаарыг бөглөнө үү'); return }
    setLoading(true)
    const { error } = await supabase.from('listings').insert({ title, description: desc, price: price ? parseInt(price) : null, location: loc, phone, category_id: catId, status: 'active', is_anonymous: true })
    setLoading(false)
    if (error) { alert('Алдаа: ' + error.message); return }
    alert('Зар нийтлэгдлээ!')
    router.push('/')
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => {
  if (step === 5 && propType !== 'Орон сууц') setStep(3)
  else if (step > 1) setStep(step - 1)
  else router.back()
}} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>
          {step === 1 && 'Ангилал сонгох'}
          {step === 2 && 'Зарах эсвэл түрээс'}
          {step === 3 && 'Төрөл сонгох'}
          {step === 4 && 'Өрөөний тоо'}
          {step === 5 && 'Мэдээлэл бөглөх'}
        </div>
      </div>

      <div style={{ padding: 16 }}>

        {step === 1 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {CATS.map(c => (
                <button key={c.id} onClick={() => { setCatId(c.id); if (c.id === 1) setStep(2); else setStep(5) }}
                  style={{ padding: '10px 6px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#555' }}>
                  <div style={{ fontSize: 22 }}>{c.icon}</div>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <button onClick={() => { setSellRent('Зарах'); setStep(3) }} style={btn(sellRent === 'Зарах')}>🏷️ Зарах</button>
            <button onClick={() => { setSellRent('Түрээслэх'); setStep(3) }} style={btn(sellRent === 'Түрээслэх')}>🔑 Түрээслэх</button>
          </div>
        )}

        {step === 3 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <button onClick={() => { setPropType('Орон сууц'); setStep(4) }} style={btn(propType === 'Орон сууц')}>🏢 Орон сууц</button>
            <button onClick={() => { setPropType('Хашаа байшин'); setStep(5) }} style={btn(propType === 'Хашаа байшин')}>🏠 Хашаа байшин</button>
            <button onClick={() => { setPropType('Газар'); setStep(5) }} style={btn(propType === 'Газар')}>🌿 Газар</button>
            <button onClick={() => { setPropType('Объект'); setStep(5) }} style={btn(propType === 'Объект')}>🏗️ Объект</button>
            <button onClick={() => { setPropType('Оффис талбай'); setStep(5) }} style={btn(propType === 'Оффис талбай')}>🏢 Оффис талбай</button>
          </div>
        )}

        {step === 4 && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <button onClick={() => { setRooms('1 өрөө'); setStep(5) }} style={btn(rooms === '1 өрөө')}>1 өрөө</button>
            <button onClick={() => { setRooms('2 өрөө'); setStep(5) }} style={btn(rooms === '2 өрөө')}>2 өрөө</button>
            <button onClick={() => { setRooms('3 өрөө'); setStep(5) }} style={btn(rooms === '3 өрөө')}>3 өрөө</button>
            <button onClick={() => { setRooms('4+ өрөө'); setStep(5) }} style={btn(rooms === '4+ өрөө')}>4+ өрөө</button>
          </div>
        )}

        {step === 5 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(sellRent || propType || rooms) && (
              <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 12, fontSize: 13, color: '#0F6E56' }}>
                ✓ {CATS.find(c => c.id === catId)?.name}{sellRent ? ' → ' + sellRent : ''}{propType ? ' → ' + propType : ''}{rooms ? ' → ' + rooms : ''}
              </div>
            )}
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Гарчиг *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Дэлгэрэнгүй мэдээлэл..." style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Үнэ</label><input value={price} onChange={e => setPrice(e.target.value)} placeholder="0 = Үнэ тохиролцоно" style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Байршил</label><input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Улаангом" style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Тайлбар</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Дэлгэрэнгүй мэдээлэл..." rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Утасны дугаар *</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9999 9999" style={inp} type="tel" /></div>
            </div>
            <button onClick={submit} disabled={loading} style={{ background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Нийтэлж байна...' : 'Зар нийтлэх'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
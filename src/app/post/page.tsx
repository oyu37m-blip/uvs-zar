'use client'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

const STEPS = {
  CATEGORY: 1,
  SUBCATEGORY: 2,
  DETAIL_TYPE: 3,
  ROOM: 4,
  FORM: 5,
}

const MAIN_CATS = [
  { id: 1, name: 'Үл хөдлөх', icon: '🏠' },
  { id: 2, name: 'Тээврийн хэрэгсэл', icon: '🚗' },
  { id: 3, name: 'Ажлын зар', icon: '💼' },
  { id: 4, name: 'Гар утас, цахилгаан бараа', icon: '📱' },
  { id: 5, name: 'Хувцас хэрэгсэл', icon: '👗' },
  { id: 6, name: 'Мал', icon: '🐄' },
  { id: 7, name: 'Гэр ахуйн бараа', icon: '🥩' },
  { id: 8, name: 'Үйлчилгээ', icon: '🔧' },
  { id: 9, name: 'Бусад', icon: '📦' },
]

const SELL_RENT = [
  { id: 'sell', name: 'Зарах' },
  { id: 'rent', name: 'Түрээслүүлэх' },
]

const PROPERTY_TYPES = [
  { id: 'apartment', name: 'Орон сууц' },
  { id: 'house', name: 'Хашаа байшин' },
  { id: 'land', name: 'Газар' },
  { id: 'object', name: 'Обьект' },
  { id: 'office', name: 'Оффис талбай' },
]

const ROOMS = [
  { id: '1', name: '1 өрөө' },
  { id: '2', name: '2 өрөө' },
  { id: '3', name: '3 өрөө' },
  { id: '4+', name: '4+ өрөө' },
]

export default function PostPage() {
  const router = useRouter()
  const [step, setStep] = useState(STEPS.CATEGORY)
  const [loading, setLoading] = useState(false)
  const [catId, setCatId] = useState<number|null>(null)
  const [sellRent, setSellRent] = useState<string|null>(null)
  const [propType, setPropType] = useState<string|null>(null)
  const [rooms, setRooms] = useState<string|null>(null)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [price, setPrice] = useState('')
  const [loc, setLoc] = useState('Ulaangom')
  const [phone, setPhone] = useState('')

  function selectCat(id: number) {
    setCatId(id)
    if (id === 1) setStep(STEPS.SUBCATEGORY)
    else setStep(STEPS.FORM)
  }

  function selectSellRent(val: string) {
    setSellRent(val)
    setStep(STEPS.DETAIL_TYPE)
  }

  function selectPropType(val: string) {
    setPropType(val)
    if (val === 'apartment') setStep(STEPS.ROOM)
    else setStep(STEPS.FORM)
  }

  function selectRoom(val: string) {
    setRooms(val)
    setStep(STEPS.FORM)
  }

  async function handleSubmit() {
    if (!title || !phone) {
      alert('Гарчиг болон утасны дугаарыг бөглөнө үү')
      return
    }
    setLoading(true)
     const fullTitle = title

    const { error } = await supabase.from('listings').insert({
      title: fullTitle,
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

  const btnStyle = (active: boolean) => ({
    padding: '14px', borderRadius: 12,
    border: active ? '2px solid #1D9E75' : '1px solid #ddd',
    background: active ? '#E1F5EE' : '#fff',
    cursor: 'pointer', fontSize: 15,
    color: active ? '#0F6E56' : '#333',
    fontWeight: active ? 600 : 400,
    textAlign: 'left' as const, width: '100%'
  })

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => step > 1 ? setStep(step - 1) : router.back()} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>
          {step === STEPS.CATEGORY && 'Ангилал сонгох'}
          {step === STEPS.SUBCATEGORY && 'Зар/Түрээс сонгох'}
          {step === STEPS.DETAIL_TYPE && 'Төрөл сонгох'}
          {step === STEPS.ROOM && 'Өрөөний тоо'}
          {step === STEPS.FORM && 'Мэдээлэл бөглөх'}
        </div>
      </div>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>

        {step === STEPS.CATEGORY && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {MAIN_CATS.map(c => (
                <button key={c.id} onClick={() => selectCat(c.id)}
                  style={{ padding: '10px 6px', borderRadius: 10, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 12, color: '#555' }}>
                  <div style={{ fontSize: 22 }}>{c.icon}</div>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === STEPS.SUBCATEGORY && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SELL_RENT.map(s => (
              <button key={s.id} onClick={() => selectSellRent(s.id)} style={btnStyle(sellRent === s.id)}>
                {s.id === 'sell' ? '🏷️' : '🔑'} {s.name}
              </button>
            ))}
          </div>
        )}

        {step === STEPS.DETAIL_TYPE && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PROPERTY_TYPES.map(p => (
              <button key={p.id} onClick={() => selectPropType(p.id)} style={btnStyle(propType === p.id)}>
                {p.name}
              </button>
            ))}
          </div>
        )}

        {step === STEPS.ROOM && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ROOMS.map(r => (
              <button key={r.id} onClick={() => selectRoom(r.id)} style={btnStyle(rooms === r.id)}>
                {r.name}
              </button>
            ))}
          </div>
        )}

        {step === STEPS.FORM && (
          <>
            <div style={{ background: '#E1F5EE', borderRadius: 12, padding: 12, fontSize: 13, color: '#0F6E56' }}>
              ✓ {MAIN_CATS.find(c => c.id === catId)?.name}
              {sellRent && ` → ${sellRent === 'sell' ? 'Zarах' : 'Tureesleh'}`}
              {propType && ` → ${PROPERTY_TYPES.find(p => p.id === propType)?.name}`}
              {rooms && ` → ${rooms} uruu`}
            </div>
            <div style={{ background: '#fff', borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Гарчиг *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Нэмэлт мэдээлэл..." style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Үнэ</label><input value={price} onChange={e => setPrice(e.target.value)} placeholder="0 = Үнэ тохиролцоно" style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Байршил</label><input value={loc} onChange={e => setLoc(e.target.value)} placeholder="Улаангом" style={inp} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Тайлбар</label><textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Дэлгэрэнгүй мэдээлэл..." rows={4} style={{ ...inp, resize: 'vertical' }} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#555' }}>Утасны дугаар *</label><input value={phone} onChange={e => setPhone(e.target.value)} placeholder="9999 9999" style={inp} type="tel" /></div>
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ background: loading ? '#aaa' : '#1D9E75', color: '#fff', border: 'none', borderRadius: 12, padding: 15, fontSize: 16, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Нийтэлж байна...' : 'Зар нийтлэх'}
            </button>
          </>
        )}
      </div>
    </main>
  )
}
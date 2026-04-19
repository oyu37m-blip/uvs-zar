'use client'
import { useEffect, useState } from 'react'
import { supabase } from 
'../lib/supabase'
import Link from 'next/link'

const CATEGORIES = [
  { slug: 'all', name: 'Бүгд', icon: '🗂' },
  { slug: 'real-estate', name: 'Үл хөдлөх', icon: '🏠' },
  { slug: 'vehicles', name: 'Автомашин', icon: '🚗' },
  { slug: 'jobs', name: 'Ажлын зар', icon: '💼' },
  { slug: 'electronics', name: 'Цахилгаан бараа', icon: '📱' },
  { slug: 'clothing', name: 'Хувцас', icon: '👗' },
  { slug: 'animals', name: 'Мал амьтан', icon: '🐄' },
  { slug: 'food', name: 'Гэр ахуй', icon: '🥩' },
  { slug: 'services', name: 'Үйлчилгээ', icon: '🔧' },
  { slug: 'other', name: 'Бусад', icon: '📦' },
]

export default function Home() {
  const [listings, setListings] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListings()
  }, [category])

  async function fetchListings() {
    setLoading(true)
    let query = supabase
      .from('listings')
      .select('*, categories(name, icon, slug)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })

    if (category !== 'all') {
      const { data: catData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .single()
      if (catData) query = query.eq('category_id', catData.id)
    }

    const { data } = await query
    setListings(data || [])
    setLoading(false)
  }

  const filtered = listings.filter(l =>
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    (l.location || '').toLowerCase().includes(search.toLowerCase())
  )
  
  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: 20, fontWeight: 700 }}>UVS <span style={{ color: '#1D9E75' }}>ZAR</span></div>
        <Link href="/post" style={{ background: '#1D9E75', color: '#fff', padding: '7px 16px', borderRadius: 8, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>+ Зар нэмэх</Link>
      </div>

      <div style={{ background: '#fff', padding: '10px 16px', borderBottom: '1px solid #eee' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Хайх..."
          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #ddd', fontSize: 15, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ background: '#fff', padding: '10px 16px', display: 'flex', gap: 8, overflowX: 'auto', borderBottom: '1px solid #eee' }}>
        {CATEGORIES.map(c => (
          <button key={c.slug} onClick={() => setCategory(c.slug)}
            style={{ border: category === c.slug ? '2px solid #1D9E75' : '1px solid #ddd', borderRadius: 20, padding: '6px 14px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', background: category === c.slug ? '#E1F5EE' : '#fff', color: category === c.slug ? '#0F6E56' : '#555' }}>
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div style={{ padding: '10px 16px', fontSize: 13, color: '#888' }}>
        {loading ? 'Уншиж байна...' : filtered.length + ' зар олдлоо'}
      </div><div style={{ padding: '0 16px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Unshij baina...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>Зар олдсонгүй</div>
        ) : filtered.map(l => (
          <Link key={l.id} href={'/listing/' + l.id} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden', border: '1px solid #eee' }}>
              {l.images && l.images[0] ? (
                <img src={l.images[0]} alt={l.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: 140, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>
                  {l.categories ? l.categories.icon : '📦'}
                </div>
              )}
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#1D9E75' }}>
                  {l.price ? ('₮' + l.price.toLocaleString()) : 'Үнэ тохиролцоно'}
                </div>
                <div style={{ fontSize: 15, color: '#222', marginTop: 2 }}>{l.title}</div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>📍 {l.location}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
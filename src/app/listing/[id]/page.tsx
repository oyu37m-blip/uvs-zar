'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function ListingPage() {
  const router = useRouter()
  const params = useParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('listings')
        .select('*, categories(name, icon)')
        .eq('id', params.id)
        .single()
      setListing(data)
      setLoading(false)
    }
    load()
  }, [params.id])

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Уншиж байна...</div>
  if (!listing) return <div style={{ padding: 40, textAlign: 'center' }}>Зар олдсонгүй</div>

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', fontFamily: 'sans-serif', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #eee', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>←</button>
        <div style={{ fontSize: 17, fontWeight: 700 }}>Дэлгэрэнгүй</div>
      </div>
      {listing.images && listing.images[0] ? (
        <img src={listing.images[0]} style={{ width: '100%', height: 240, objectFit: 'cover' }} />
      ) : (
        <div style={{ width: '100%', height: 200, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 60 }}>
          {listing.categories?.icon || '📦'}
        </div>
      )}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1D9E75' }}>
            {listing.price ? '₮' + listing.price.toLocaleString() : 'Үнэ тохиролцоно'}
          </div>
          <div style={{ fontSize: 18, color: '#222', marginTop: 6 }}>{listing.title}</div>
          <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>📍 {listing.location}</div>
          <div style={{ fontSize: 13, color: '#aaa', marginTop: 4 }}>{listing.categories?.icon} {listing.categories?.name}</div>
        </div>
        {listing.description && (
          <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Тайлбар</div>
            <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>{listing.description}</div>
          </div>
        )}
        <div style={{ background: '#fff', borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Холбоо барих</div>
          <div style={{ fontSize: 16, color: '#555' }}>📞 {listing.phone}</div>
        </div>
        <a href={'tel:' + listing.phone}
          style={{ background: '#1D9E75', color: '#fff', borderRadius: 12, padding: 15, fontSize: 16, fontWeight: 700, textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          📞 Утсаар залгах
        </a>
      </div>
    </main>
  )
}
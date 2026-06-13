import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, getUserStats } from '../../api/auth'
import { getOrders } from '../../api/orders'

export default function Dashboard() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [stats, setStats] = useState(null)
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, statsRes, ordersRes] = await Promise.all([
                    getProfile(),
                    getUserStats(),
                    getOrders(),
                ])
                setProfile(profileRes.data)
                setStats(statsRes.data)
                setOrders(ordersRes.data)
            } catch {
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        navigate('/login')
    }

    const formatPrice = (price) => {
        return Number(price).toLocaleString('fa-IR') + ' تومان'
    }

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh', background: '#0d0818',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ color: '#c9a84c', fontSize: '16px' }}>در حال بارگذاری...</div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d0818 0%, #1a0a2e 100%)' }}>
            {/* glow */}
            <div style={{
                position: 'fixed', width: '500px', height: '500px',
                background: 'radial-gradient(circle, #7c3aed10, transparent)',
                borderRadius: '50%', top: '-100px', right: '-100px', pointerEvents: 'none'
            }} />

            {/* Header */}
            <header className="luxury-header">
                <div className="luxury-logo">نیک پی ساخت و ساز</div>
                <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <span
              onClick={() => navigate('/projects')}
              style={{ fontSize: '13px', color: '#7c5fa0', cursor: 'pointer' }}
          >
            پروژه‌ها
          </span>
                    <span
                        onClick={() => navigate('/orders')}
                        style={{ fontSize: '13px', color: '#7c5fa0', cursor: 'pointer' }}
                    >
            سفارش‌ها
          </span>
                    <span
                        onClick={() => navigate('/profile')}
                        style={{
                            fontSize: '13px', color: '#e8d5ff', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
            {profile?.first_name} {profile?.last_name}
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '50%',
                            background: '#7c3aed22', border: '1px solid #c9a84c44',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', color: '#c9a84c'
                        }}>
              {profile?.first_name?.[0]}
            </div>
          </span>
                    <button
                        onClick={logout}
                        className="btn-outline"
                        style={{ padding: '6px 14px', fontSize: '12px' }}
                    >
                        خروج
                    </button>
                </nav>
            </header>

            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
                {/* welcome */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ fontSize: '13px', color: '#7c5fa0', marginBottom: '4px' }}>خوش آمدید</div>
                    <div style={{ fontSize: '24px', fontWeight: '600', color: '#e8d5ff' }}>
                        {profile?.first_name} {profile?.last_name}
                        <span style={{ color: '#c9a84c', marginRight: '8px' }}>✦</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                    {[
                        { label: 'سرمایه‌گذاری کل', value: formatPrice(stats?.total_investment || 0), color: '#e8d5ff' },
                        { label: 'ارزش به روز', value: formatPrice(stats?.total_current_value || 0), color: '#c9a84c' },
                        { label: 'سود کل', value: formatPrice(stats?.total_profit || 0), color: '#4caf82' },
                        { label: 'اعتبار', value: formatPrice(profile?.credit || 0), color: '#a78bfa' },
                    ].map((item, i) => (
                        <div key={i} className="luxury-card">
                            <div style={{ fontSize: '11px', color: '#7c5fa0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                                {item.label}
                            </div>
                            <div style={{ fontSize: '18px', fontWeight: '600', color: item.color }}>
                                {item.value}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {/* پروژه‌ها */}
                    <div className="luxury-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '500', color: '#e8d5ff' }}>پروژه‌ها</div>
                            <button
                                className="btn-outline"
                                style={{ padding: '5px 14px', fontSize: '12px' }}
                                onClick={() => navigate('/projects')}
                            >
                                مشاهده همه
                            </button>
                        </div>
                        <div style={{
                            padding: '20px', background: '#7c3aed11', border: '0.5px dashed #c9a84c33',
                            borderRadius: '12px', textAlign: 'center', cursor: 'pointer'
                        }}
                             onClick={() => navigate('/projects')}
                        >
                            <div style={{ fontSize: '28px', marginBottom: '8px' }}>🏗️</div>
                            <div style={{ fontSize: '13px', color: '#7c5fa0' }}>مشاهده و سرمایه‌گذاری در پروژه‌ها</div>
                        </div>
                    </div>

                    {/* سفارش‌ها */}
                    <div className="luxury-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <div style={{ fontSize: '15px', fontWeight: '500', color: '#e8d5ff' }}>سفارش‌های من</div>
                            <button
                                className="btn-outline"
                                style={{ padding: '5px 14px', fontSize: '12px' }}
                                onClick={() => navigate('/orders')}
                            >
                                مشاهده همه
                            </button>
                        </div>
                        {orders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px', color: '#7c5fa0', fontSize: '13px' }}>
                                سفارشی یافت نشد
                            </div>
                        ) : (
                            orders.slice(0, 3).map((order) => (
                                <div key={order.id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 0', borderBottom: '0.5px solid #c9a84c11'
                                }}>
                                    <div>
                                        <div style={{ fontSize: '13px', color: '#e8d5ff' }}>{order.project_name}</div>
                                        <div style={{ fontSize: '11px', color: '#7c5fa0' }}>{order.area} متر</div>
                                    </div>
                                    <div style={{ textAlign: 'left' }}>
                                        <div style={{ fontSize: '13px', color: '#c9a84c' }}>{formatPrice(order.current_value)}</div>
                                        <span className="badge-success">فعال</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
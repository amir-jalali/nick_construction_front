import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../api/auth'

export default function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        phone: '', password: '', first_name: '',
        last_name: '', national_code: '', referrer_code: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await register(formData)
            localStorage.setItem('access_token', res.data.access)
            localStorage.setItem('refresh_token', res.data.refresh)
            navigate('/dashboard')
        } catch (err) {
            const errors = err.response?.data
            if (errors) {
                const messages = Object.values(errors).flat().join(' | ')
                setError(messages)
            } else {
                setError('خطا در ثبت‌نام')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0d0818 0%, #1a0a2e 50%, #0d0818 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px'
        }}>
            {/* glow effects */}
            <div style={{
                position: 'absolute', width: '400px', height: '400px',
                background: 'radial-gradient(circle, #7c3aed15, transparent)',
                borderRadius: '50%', top: '-100px', right: '-100px'
            }} />
            <div style={{
                position: 'absolute', width: '300px', height: '300px',
                background: 'radial-gradient(circle, #c9a84c08, transparent)',
                borderRadius: '50%', bottom: '-50px', left: '-50px'
            }} />

            <div style={{
                width: '100%', maxWidth: '480px',
                position: 'relative', zIndex: 1
            }}>
                {/* لوگو */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        fontSize: '24px', fontWeight: '700',
                        background: 'linear-gradient(90deg, #c9a84c, #f0d080)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                        marginBottom: '8px'
                    }}>
                        نیک پی ساخت و ساز
                    </div>
                    <div style={{ fontSize: '13px', color: '#7c5fa0' }}>
                        پلتفرم سرمایه‌گذاری در ساخت و ساز
                    </div>
                </div>

                {/* کارت */}
                <div className="luxury-card" style={{ padding: '32px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#e8d5ff', marginBottom: '24px', textAlign: 'center' }}>
                        ایجاد حساب کاربری
                    </h2>

                    {error && (
                        <div style={{
                            background: '#ef444422', border: '0.5px solid #ef444444',
                            color: '#ef4444', padding: '12px 16px', borderRadius: '10px',
                            marginBottom: '16px', fontSize: '13px'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div>
                                <label className="luxury-label">نام</label>
                                <input
                                    type="text"
                                    name="first_name"
                                    className="luxury-input"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="luxury-label">نام خانوادگی</label>
                                <input
                                    type="text"
                                    name="last_name"
                                    className="luxury-input"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label className="luxury-label">شماره موبایل</label>
                            <input
                                type="text"
                                name="phone"
                                className="luxury-input"
                                placeholder="09xxxxxxxxx"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label className="luxury-label">کد ملی</label>
                            <input
                                type="text"
                                name="national_code"
                                className="luxury-input"
                                value={formData.national_code}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ marginBottom: '12px' }}>
                            <label className="luxury-label">رمز عبور</label>
                            <input
                                type="password"
                                name="password"
                                className="luxury-input"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label className="luxury-label">کد معرف (اختیاری)</label>
                            <input
                                type="text"
                                name="referrer_code"
                                className="luxury-input"
                                placeholder="شماره موبایل معرف"
                                value={formData.referrer_code}
                                onChange={handleChange}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-gold"
                            disabled={loading}
                            style={{ width: '100%', padding: '14px' }}
                        >
                            {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#7c5fa0' }}>
                        حساب کاربری دارید؟{' '}
                        <Link to="/login" style={{ color: '#c9a84c', textDecoration: 'none' }}>
                            ورود
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
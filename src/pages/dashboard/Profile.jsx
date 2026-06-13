import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProfile, updateProfile } from '../../api/auth'

export default function Profile() {
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        address: '',
        birth_date: '',
    })

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getProfile()
                setProfile(res.data)
                setFormData({
                    first_name: res.data.first_name || '',
                    last_name: res.data.last_name || '',
                    address: res.data.address || '',
                    birth_date: res.data.birth_date || '',
                })
            } catch {
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess('')
        try {
            await updateProfile(formData)
            setSuccess('پروفایل با موفقیت بروزرسانی شد')
        } catch {
            setError('خطا در بروزرسانی پروفایل')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500">در حال بارگذاری...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">نیک بی ساخت و ساز</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        بازگشت به داشبورد
                    </button>
                </div>
            </header>

            <div className="max-w-3xl mx-auto px-4 py-8">
                {/* کارت اطلاعات اصلی */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-3xl">
                            👤
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {profile?.first_name} {profile?.last_name}
                            </h2>
                            <p className="text-gray-500">{profile?.phone}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                                profile?.is_verified
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}>
                {profile?.is_verified ? 'تأیید شده' : 'در انتظار تأیید'}
              </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                            <p className="text-sm text-gray-500">کد ملی</p>
                            <p className="font-medium">{profile?.national_code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">اعتبار</p>
                            <p className="font-medium text-purple-600">
                                {Number(profile?.credit).toLocaleString('fa-IR')} تومان
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">تاریخ عضویت</p>
                            <p className="font-medium">
                                {new Date(profile?.created_at).toLocaleDateString('fa-IR')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* فرم ویرایش */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">ویرایش اطلاعات</h3>

                    {success && (
                        <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
                            {success}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                                <input
                                    type="text"
                                    value={formData.first_name}
                                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                                <input
                                    type="text"
                                    value={formData.last_name}
                                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">آدرس</label>
                            <textarea
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">تاریخ تولد</label>
                            <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {saving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
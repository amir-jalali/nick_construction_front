import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProject } from '../../api/projects'
import { createOrder } from '../../api/orders'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'


export default function ProjectDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [project, setProject] = useState(null)
    const [loading, setLoading] = useState(true)
    const [area, setArea] = useState('')
    const [orderLoading, setOrderLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await getProject(id)
                setProject(res.data)
            } catch {
                navigate('/projects')
            } finally {
                setLoading(false)
            }
        }
        fetchProject()
    }, [id])

    const formatPrice = (price) => {
        return Number(price).toLocaleString('fa-IR') + ' تومان'
    }

    const totalPrice = area && project
        ? Number(area) * Number(project.price_per_meter)
        : 0

    const handleOrder = async () => {
        if (!area || area <= 0) {
            setError('متراژ را وارد کنید')
            return
        }
        setOrderLoading(true)
        setError('')
        try {
            await createOrder({ project: id, area })
            setSuccess('خرید با موفقیت انجام شد!')
            setArea('')
            setTimeout(() => navigate('/dashboard'), 2000)
        } catch (err) {
            const errors = err.response?.data
            if (errors?.error) {
                setError(errors.error)
            } else {
                setError('خطا در ثبت سفارش')
            }
        } finally {
            setOrderLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-gray-500 text-lg">در حال بارگذاری...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100" dir="rtl">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-800">نیک بی ساخت و ساز</h1>
                    <button
                        onClick={() => navigate('/projects')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        بازگشت به پروژه‌ها
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* اطلاعات پروژه */}
                    <div className="md:col-span-2 space-y-6">
                        {/* عکس‌ها */}
                        {project.media && project.media.length > 0 ? (
                            <div className="bg-white rounded-2xl p-4 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-4">تصاویر پروژه</h2>
                                <Swiper
                                    modules={[Navigation, Pagination, Autoplay]}
                                    navigation
                                    pagination={{ clickable: true }}
                                    autoplay={{ delay: 3000 }}
                                    loop={false}
                                    className="rounded-xl overflow-hidden"
                                >
                                    {project.media.map((item) => (
                                        <SwiperSlide key={item.id}>
                                            <div className="relative">
                                                <img
                                                    src={item.image}
                                                    alt={item.caption}
                                                    className="w-full h-64 object-cover"
                                                />
                                                {item.caption && (
                                                    <div className="absolute bottom-0 right-0 left-0 bg-black bg-opacity-40 text-white text-sm p-2 text-center">
                                                        {item.caption}
                                                    </div>
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl p-4 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-4">تصاویر پروژه</h2>
                                <div className="w-full h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-6xl mb-2">🏗️</p>
                                        <p className="text-gray-400">تصویری برای این پروژه ثبت نشده</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* مشخصات */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-gray-800 text-xl mb-4">{project.name}</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">موقعیت</p>
                                    <p className="font-medium">📍 {project.location}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">متراژ کل</p>
                                    <p className="font-medium">{project.area} متر</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">تاریخ شروع</p>
                                    <p className="font-medium">{project.start_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">پیش‌بینی خاتمه</p>
                                    <p className="font-medium">{project.predicted_end_date}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">سرمایه کل</p>
                                    <p className="font-medium text-blue-600">{formatPrice(project.total_capital)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">سود پیش‌بینی</p>
                                    <p className="font-medium text-green-600">{project.predicted_profit}٪</p>
                                </div>
                            </div>
                            {project.description && (
                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 mb-1">توضیحات</p>
                                    <p className="text-gray-700">{project.description}</p>
                                </div>
                            )}
                        </div>

                        {/* پیشرفت */}
                        {project.progress && project.progress.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-4">پیشرفت پروژه</h2>
                                {project.progress.map((p) => (
                                    <div key={p.id} className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-500">{p.date}</span>
                                            <span className="text-gray-600">واقعی: {p.actual}٪ | پیش‌بینی: {p.predicted}٪</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3">
                                            <div
                                                className="bg-blue-500 h-3 rounded-full"
                                                style={{ width: `${p.actual}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* نکته‌ها */}
                        {project.notes && project.notes.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="font-bold text-gray-800 mb-4">نکته‌ها</h2>
                                <ul className="space-y-2">
                                    {project.notes.map((note) => (
                                        <li key={note.id} className="flex gap-2 text-gray-700">
                                            <span>•</span>
                                            <span>{note.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* فرم خرید */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
                            <h2 className="font-bold text-gray-800 text-lg mb-4">خرید متراژ</h2>

                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">قیمت هر متر</p>
                                <p className="text-xl font-bold text-blue-600">
                                    {formatPrice(project.price_per_meter)}
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 text-green-600 p-3 rounded-lg mb-4 text-sm">
                                    {success}
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    متراژ درخواستی (متر)
                                </label>
                                <input
                                    type="number"
                                    value={area}
                                    onChange={(e) => setArea(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="مثلاً 100"
                                />
                            </div>

                            {area > 0 && (
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <p className="text-sm text-gray-500">مبلغ کل</p>
                                    <p className="font-bold text-gray-800">{formatPrice(totalPrice)}</p>
                                </div>
                            )}

                            <button
                                onClick={handleOrder}
                                disabled={orderLoading}
                                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {orderLoading ? 'در حال ثبت...' : 'ثبت سفارش'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
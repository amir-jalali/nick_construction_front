import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects } from '../../api/projects'

export default function Projects() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects()
                setProjects(res.data)
            } catch {
                navigate('/login')
            } finally {
                setLoading(false)
            }
        }
        fetchProjects()
    }, [])

    const formatPrice = (price) => {
        return Number(price).toLocaleString('fa-IR') + ' تومان'
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
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        بازگشت به داشبورد
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">همه پروژه‌ها</h2>

                {projects.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                        <p className="text-gray-500">پروژه‌ای یافت نشد</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                onClick={() => navigate(`/projects/${project.id}`)}
                                className="bg-white rounded-2xl p-6 shadow-sm cursor-pointer hover:shadow-md hover:border-blue-400 border border-transparent transition"
                            >
                                {/* عکس پروژه */}

                                {project.media && project.media.length > 0 ? (
                                    <img
                                        src={project.media[0].image}
                                        alt={project.name}
                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                    />
                                ) : (
                                    <div className="w-full h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center">
                                        <span className="text-gray-400">بدون تصویر</span>
                                    </div>
                                )}

                                <h3 className="font-bold text-gray-800 text-lg mb-2">{project.name}</h3>
                                <p className="text-sm text-gray-500 mb-1">📍 {project.location}</p>
                                <p className="text-sm text-gray-600 mb-1">
                                    قیمت هر متر: <span className="font-medium">{formatPrice(project.price_per_meter)}</span>
                                </p>
                                <p className="text-sm text-gray-600 mb-3">
                                    سرمایه کل: <span className="font-medium">{formatPrice(project.total_capital)}</span>
                                </p>

                                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-medium text-sm">
                    سود پیش‌بینی: {project.predicted_profit}٪
                  </span>
                                    <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full">
                    مشاهده جزئیات
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
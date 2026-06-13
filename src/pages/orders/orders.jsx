import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrders, cancelOrder } from '../../api/orders'

export default function Orders() {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [cancelLoading, setCancelLoading] = useState(null)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const res = await getOrders()
            setOrders(res.data)
        } catch {
            navigate('/login')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (orderId) => {
        if (!window.confirm('آیا از انصراف اطمینان دارید؟ 0.5% کارمزد کسر می‌شود.')) return
        setCancelLoading(orderId)
        setError('')
        setSuccess('')
        try {
            const res = await cancelOrder(orderId)
            setSuccess(`انصراف ثبت شد. مبلغ بازگشتی: ${Number(res.data.total_refund).toLocaleString('fa-IR')} تومان`)
            fetchOrders()
        } catch {
            setError('خطا در ثبت انصراف')
        } finally {
            setCancelLoading(null)
        }
    }

    const formatPrice = (price) => {
        return Number(price).toLocaleString('fa-IR') + ' تومان'
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

            <div className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">سفارش‌های من</h2>

                {success && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-xl mb-6">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 shadow-sm text-center">
                        <p className="text-5xl mb-4">📋</p>
                        <p className="text-gray-500">سفارشی یافت نشد</p>
                        <button
                            onClick={() => navigate('/projects')}
                            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            مشاهده پروژه‌ها
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{order.project_name}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            order.status === 'active' ? 'bg-green-100 text-green-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                        }`}>
                      {order.status === 'active' ? 'فعال' :
                          order.status === 'cancelled' ? 'انصراف داده' : 'فروخته شده'}
                    </span>
                                    </div>
                                    {order.status === 'active' && (
                                        <button
                                            onClick={() => handleCancel(order.id)}
                                            disabled={cancelLoading === order.id}
                                            className="text-red-500 hover:text-red-700 text-sm border border-red-300 px-3 py-1 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                                        >
                                            {cancelLoading === order.id ? 'در حال انصراف...' : 'انصراف'}
                                        </button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">متراژ خریداری شده</p>
                                        <p className="font-medium">{order.area} متر</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">مبلغ خرید</p>
                                        <p className="font-medium">{formatPrice(order.total_price)}</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">ارزش فعلی</p>
                                        <p className="font-medium text-blue-600">{formatPrice(order.current_value)}</p>
                                    </div>
                                    <div className="bg-green-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-500 mb-1">سود</p>
                                        <p className="font-medium text-green-600">{formatPrice(order.profit)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
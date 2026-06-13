import api from './axios'

export const getOrders = () => api.get('/orders/')
export const createOrder = (data) => api.post('/orders/create/', data)
export const getOrder = (id) => api.get(`/orders/${id}/`)
export const cancelOrder = (id) => api.post(`/orders/${id}/cancel/`)
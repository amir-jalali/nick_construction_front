import api from './axios'

export const getTransactions = () => api.get('/wallet/transactions/')
import { createBrowserRouter, redirect } from 'react-router'
import Root from './layouts/Root'
import UserLayout from './layouts/UserLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import TransactionDetail from './pages/TransactionDetail'
import Prediction from './pages/Prediction'
import Analytics from './pages/Analytics'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import UserDashboard from './pages/user/UserDashboard'
import UserTransactions from './pages/user/UserTransactions'
import UserTransactionDetail from './pages/user/UserTransactionDetail'
import NewTransaction from './pages/user/NewTransaction'
import UserProfile from './pages/user/UserProfile'

function requireAdmin() {
  const role = localStorage.getItem('sentinel_auth')
  if (!role) throw redirect('/login')
  if (role !== 'admin') throw redirect('/user/dashboard')
  return null
}

function requireUser() {
  const role = localStorage.getItem('sentinel_auth')
  if (!role) throw redirect('/login')
  if (role !== 'user') throw redirect('/admin/dashboard')
  return null
}

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/admin',
    Component: Root,
    loader: requireAdmin,
    children: [
      { index: true, loader: () => redirect('/admin/dashboard') },
      { path: 'dashboard', Component: Dashboard },
      { path: 'transactions', Component: Transactions },
      { path: 'transactions/:id', Component: TransactionDetail },
      { path: 'predict', Component: Prediction },
      { path: 'analytics', Component: Analytics },
      { path: 'alerts', Component: Alerts },
      { path: 'settings', Component: Settings },
    ],
  },
  {
    path: '/user',
    Component: UserLayout,
    loader: requireUser,
    children: [
      { index: true, loader: () => redirect('/user/dashboard') },
      { path: 'dashboard', Component: UserDashboard },
      { path: 'transactions', Component: UserTransactions },
      { path: 'transactions/:id', Component: UserTransactionDetail },
      { path: 'new-transaction', Component: NewTransaction },
      { path: 'profile', Component: UserProfile },
    ],
  },
  {
    path: '/',
    loader: () => {
      const role = localStorage.getItem('sentinel_auth')
      if (role === 'admin') throw redirect('/admin/dashboard')
      if (role === 'user') throw redirect('/user/dashboard')
      throw redirect('/login')
    },
    Component: () => null,
  },
  {
    path: '*',
    loader: () => redirect('/login'),
    Component: () => null,
  },
])

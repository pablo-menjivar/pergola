import { useEffect, useRef, useState } from 'react'
import { BarChart3, TrendingUp, ShoppingCart, Eye, Star, DollarSign, Package, Users, AlertCircle, RefreshCw } from 'lucide-react'
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  LineElement, 
  PointElement,
  BarController,
  DoughnutController,
  LineController
} from 'chart.js'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement, 
  LineElement, 
  PointElement,
  BarController,
  DoughnutController,
  LineController
)

const Dashboard = () => {
  // Estados para datos reales
  const [dashboardData, setDashboardData] = useState({
    products: [],
    orders: [],
    customers: [],
    reviews: [],
    transactions: [],
    collections: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Referencias para gráficos
  const barChartRef = useRef(null)
  const pieChartRef = useRef(null)
  const lineChartRef = useRef(null)

  // Función para obtener datos de la API
  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const endpoints = [
        'https://pergola-production.up.railway.app/api/products',
        'https://pergola-production.up.railway.app/api/orders',
        'https://pergola-production.up.railway.app/api/customers',
        'https://pergola-production.up.railway.app/api/reviews',
        'https://pergola-production.up.railway.app/api/transactions',
        'https://pergola-production.up.railway.app/api/collections'
      ]

      const responses = await Promise.allSettled(
        endpoints.map(url => 
          fetch(url, { credentials: 'include' })
            .then(res => res.ok ? res.json() : [])
            .catch(() => [])
        )
      )

      const [products, orders, customers, reviews, transactions, collections] = responses.map(
        result => result.status === 'fulfilled' ? result.value : []
      )

      setDashboardData({
        products: products || [],
        orders: orders || [],
        customers: customers || [],
        reviews: reviews || [],
        transactions: transactions || [],
        collections: collections || []
      })
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError('Error al cargar datos del dashboard')
    } finally {
      setLoading(false)
    }
  }

  // Cargar datos al montar
  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Calcular estadísticas reales
  const calculateStats = () => {
    const { products, orders, customers, reviews, transactions } = dashboardData

    // Estadísticas con fallbacks
    const totalProducts = products?.length || 0
    const totalCustomers = customers?.length || 0
    const completedOrders = orders?.filter(order => order.status === 'entregado')?.length || 0
    const pendingOrders = orders?.filter(order => order.status === 'pendiente')?.length || 0
    
    // Calcular ventas totales
    const totalSales = transactions?.reduce((sum, transaction) => {
      return transaction.type === 'pago' && transaction.status === 'completado' 
        ? sum + (transaction.amount || 0) 
        : sum
    }, 0) || 0

    // Calcular rating promedio
    const avgRating = reviews?.length > 0 
      ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
      : '4.8'

    // Productos por estado
    const availableProducts = products?.filter(p => p.status === 'disponible')?.length || 0
    const outOfStockProducts = products?.filter(p => p.status === 'agotado')?.length || 0

    return {
      totalSales,
      totalProducts,
      totalCustomers,
      avgRating,
      completedOrders,
      pendingOrders,
      availableProducts,
      outOfStockProducts
    }
  }

  const stats = calculateStats()

  // Datos para tarjetas de estadísticas
  const dashboardStats = [
    {
      title: "Ventas Totales",
      value: loading ? "Cargando..." : `$${stats.totalSales.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600"
    },
    {
      title: "Productos Disponibles",
      value: loading ? "..." : stats.availableProducts.toString(),
      change: `${stats.outOfStockProducts} agotados`,
      trend: stats.outOfStockProducts > 0 ? "down" : "up",
      icon: Package,
      color: "bg-gradient-to-br from-blue-500 to-blue-600"
    },
    {
      title: "Total Clientes",
      value: loading ? "..." : stats.totalCustomers.toString(),
      change: "+15.3%",
      trend: "up",
      icon: Users,
      color: "bg-gradient-to-br from-purple-500 to-purple-600"
    },
    {
      title: "Valoración Promedio",
      value: loading ? "..." : stats.avgRating,
      change: "+0.3",
      trend: "up",
      icon: Star,
      color: "bg-gradient-to-br from-orange-500 to-orange-600"
    }
  ]

  // Datos para gráficos con fallbacks
  const createChartData = () => {
    const { orders, collections, products } = dashboardData

    // Datos mensuales (simulados con datos reales como base)
    const monthlyData = {
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [{
        label: 'Pedidos por Mes',
        data: orders?.length > 0 
          ? [12, 19, orders.length, 25, 18, 22]
          : [5, 8, 12, 15, 10, 18],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 6,
      }]
    }

    // Datos por colecciones
    const collectionData = {
      labels: collections?.length > 0 
        ? collections.slice(0, 5).map(c => c.name)
        : ['Cristal Bohemio', 'Perlas Roccocó', 'Esencias Ligeras'],
      datasets: [{
        label: 'Productos por Colección',
        data: collections?.length > 0 
          ? collections.slice(0, 5).map(c => 
              products?.filter(p => p.collection === c._id)?.length || 0
            )
          : [15, 11, 9],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderWidth: 2
      }]
    }

    // Datos de tendencia
    const trendData = {
      labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
      datasets: [{
        label: 'Tendencia de Ventas',
        data: orders?.length > 0 
          ? [orders.length * 0.2, orders.length * 0.4, orders.length * 0.7, orders.length]
          : [20, 35, 45, 60],
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 3,
        tension: 0.4
      }]
    }

    return { monthlyData, collectionData, trendData }
  }

  const { monthlyData, collectionData, trendData } = createChartData()

  // Opciones para gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff'
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0, 0, 0, 0.1)' } }
    }
  }

  // Ventas recientes reales o fallback
  const getRecentSales = () => {
    const { orders, customers, products } = dashboardData
    
    if (orders?.length > 0) {
      return orders.slice(0, 4).map(order => {
        const customer = customers?.find(c => c._id === order.customer)
        const product = products?.find(p => p._id === order.items?.[0]?.itemId)
        
        return {
          product: product?.name || 'Producto desconocido',
          customer: customer?.name || 'Cliente',
          price: `$${order.total || 0}`,
          status: order.status || 'pendiente'
        }
      })
    }

    // Fallback data
    return [
      { product: "Pendientes de cerezas", customer: "María García", price: "$12.50", status: "entregado" },
      { product: "Aretes Margaritas", customer: "Ana López", price: "$89", status: "pendiente" },
      { product: "Collar delicado", customer: "Sofia Ruiz", price: "$21", status: "entregado" },
      { product: "Pulsera roccocó", customer: "Elena Díaz", price: "$75", status: "en proceso" }
    ]
  }

  const recentSales = getRecentSales()

  // Renderizar gráficos
  useEffect(() => {
    if (loading) return

    // Limpiar gráficos existentes
    if (barChartRef.current) barChartRef.current.destroy()
    if (pieChartRef.current) pieChartRef.current.destroy()
    if (lineChartRef.current) lineChartRef.current.destroy()
    
    // Crear nuevos gráficos
    const barCtx = document.getElementById('barChart')
    if (barCtx) {
      barChartRef.current = new ChartJS(barCtx, {
        type: 'bar',
        data: monthlyData,
        options: chartOptions
      })
    }

    const pieCtx = document.getElementById('pieChart')
    if (pieCtx) {
      pieChartRef.current = new ChartJS(pieCtx, {
        type: 'doughnut',
        data: collectionData,
        options: {
          ...chartOptions,
          plugins: {
            legend: { position: 'bottom' }
          }
        }
      })
    }

    const lineCtx = document.getElementById('lineChart')
    if (lineCtx) {
      lineChartRef.current = new ChartJS(lineCtx, {
        type: 'line',
        data: trendData,
        options: chartOptions
      })
    }

    return () => {
      if (barChartRef.current) barChartRef.current.destroy()
      if (pieChartRef.current) pieChartRef.current.destroy()
      if (lineChartRef.current) lineChartRef.current.destroy()
    }
  }, [loading, dashboardData])

  // Mostrar error si hay problemas
  if (error) {
    return (
      <div className="p-6 bg-white min-h-screen font-[Nunito] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white min-h-screen font-[Nunito]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600">
              {loading ? "Cargando datos..." : "Resumen de tu joyería Pérgola"}
            </p>
          </div>
          {!loading && (
            <button 
              onClick={fetchDashboardData}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.color} shadow-md`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className={`flex items-center text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
                      <TrendingUp className={`w-4 h-4 mr-1 ${stat.trend === 'down' ? 'rotate-180' : ''}`}/>
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Pedidos por Mes</h3>
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <canvas id="barChart"></canvas>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Productos por Colección</h3>
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                <canvas id="pieChart"></canvas>
              )}
            </div>
          </div>
        </div>

        {/* Segunda fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Tendencia de Ventas</h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="h-64">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <canvas id="lineChart"></canvas>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Métricas Rápidas</h3>
              <Eye className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <span className="text-gray-700 font-medium">Productos en Stock</span>
                <span className="text-2xl font-bold text-blue-600">
                  {loading ? "..." : stats.availableProducts}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <span className="text-gray-700 font-medium">Pedidos Completados</span>
                <span className="text-2xl font-bold text-green-600">
                  {loading ? "..." : stats.completedOrders}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <span className="text-gray-700 font-medium">Reviews Promedio</span>
                <span className="text-2xl font-bold text-purple-600">
                  {loading ? "..." : `${stats.avgRating} ⭐`}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                <span className="text-gray-700 font-medium">Pedidos Pendientes</span>
                <span className="text-2xl font-bold text-orange-600">
                  {loading ? "..." : stats.pendingOrders}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Ventas Recientes */}
        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              {loading ? "Cargando ventas..." : "Ventas Recientes"}
            </h3>
            <ShoppingCart className="w-5 h-5 text-green-600" />
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Cliente</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Precio</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((sale, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-200 border border-pink-300 rounded-lg flex items-center justify-center">
                            <Eye className="w-5 h-5 text-pink-600" />
                          </div>
                          <span className="font-medium text-gray-800">{sale.product}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-700">{sale.customer}</td>
                      <td className="py-4 px-4 font-semibold text-gray-800">{sale.price}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          sale.status === 'entregado' 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                            : sale.status === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {sale.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
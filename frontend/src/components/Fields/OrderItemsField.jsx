// components/FormFields/OrderItemsField.jsx
import { useState, useEffect } from 'react';
import { Plus, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';

const OrderItemsField = ({ 
  value = [], 
  onChange, 
  products = [], 
  disabled = false 
}) => {
  console.log('📋 OrderItemsField - Props recibidas:', {
    value,
    products,
    productsCount: products?.length,
    productNames: products?.map(p => p.name)
  });
  
  const [items, setItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(0);

  // Inicializar items cuando cambia el value
  useEffect(() => {
    if (value && Array.isArray(value)) {
      // Procesar items para asegurar que tengan la estructura correcta
      const processedItems = value.map(item => {
        // Si el item ya tiene la estructura correcta
        if (item.itemId && item.quantity && item.price) {
          // Buscar información del producto para mostrar
          const productInfo = products.find(p => p._id === item.itemId);
          return {
            ...item,
            product: productInfo,
            name: productInfo?.name || 'Producto no encontrado',
            subtotal: item.quantity * item.price
          };
        }
        
        // Si es un objeto simple (caso de edición)
        if (typeof item === 'object' && !item.itemId) {
          const productInfo = products.find(p => p._id === item._id);
          return {
            itemId: item._id,
            product: productInfo,
            quantity: 1,
            price: item.price || 0,
            name: productInfo?.name || item.name || 'Producto',
            subtotal: 1 * (item.price || 0)
          };
        }
        
        // Si es solo un ID string
        if (typeof item === 'string') {
          const productInfo = products.find(p => p._id === item);
          return {
            itemId: item,
            product: productInfo,
            quantity: 1,
            price: productInfo?.price || 0,
            name: productInfo?.name || 'Producto',
            subtotal: 1 * (productInfo?.price || 0)
          };
        }
        
        return item;
      });
      
      setItems(processedItems);
    } else {
      setItems([]);
    }
  }, [value, products]);

  // Notificar cambios al padre
  useEffect(() => {
    // Preparar datos para el backend (solo lo necesario)
    const backendItems = items.map(item => ({
      itemId: item.itemId,
      quantity: item.quantity,
      price: item.price
    }));
    
    onChange(backendItems);
  }, [items, onChange]);

  // Agregar nuevo item
  const addItem = () => {
    if (!selectedProduct || quantity < 1 || price < 0) return;

    const product = products.find(p => p._id === selectedProduct);
    if (!product) return;

    const newItem = {
      itemId: selectedProduct,
      product, // Para mostrar en la UI
      quantity: Number(quantity),
      price: Number(price),
      name: product.name,
      subtotal: Number(quantity) * Number(price)
    };

    setItems(prev => [...prev, newItem]);
    
    // Reset form
    setSelectedProduct('');
    setQuantity(1);
    setPrice(0);
  };

  // Eliminar item
  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Actualizar item existente
  const updateItem = (index, field, newValue) => {
    setItems(prev => prev.map((item, i) => {
      if (i === index) {
        const updated = { 
          ...item, 
          [field]: field === 'quantity' || field === 'price' ? Number(newValue) : newValue 
        };
        
        // Recalcular subtotal si cambia quantity o price
        if (field === 'quantity' || field === 'price') {
          updated.subtotal = updated.quantity * updated.price;
        }
        
        return updated;
      }
      return item;
    }));
  };

  // Calcular total automáticamente
  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  // Cuando seleccionan un producto, auto-completar el precio
  const handleProductSelect = (productId) => {
    setSelectedProduct(productId);
    const product = products.find(p => p._id === productId);
    if (product) {
      setPrice(product.price || 0);
    }
  };

  // Verificar si hay productos disponibles
  if (products.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-medium font-[Quicksand]">No hay productos disponibles</p>
            <p className="text-sm mt-1 font-[Quicksand]">Agrega productos primero para poder crear pedidos.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Formulario para agregar items */}
      <div className="bg-[#E8E1D8] p-4 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-[#3D1609] mb-3 flex items-center gap-2 font-[Quicksand]">
          <ShoppingCart className="w-4 h-4" />
          Agregar Productos al Pedido
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Selector de producto */}
          <div>
            <label className="block text-xs font-medium text-[#5d1700] mb-1 font-[Quicksand]">
              Producto *
            </label>
            <select
              value={selectedProduct}
              onChange={(e) => handleProductSelect(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A73249] focus:border-transparent bg-white font-[Quicksand]"
            >
              <option value="">Seleccionar producto</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-medium text-[#5d1700] mb-1 font-[Quicksand]">
              Cantidad *
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A73249] focus:border-transparent bg-white font-[Quicksand]"
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-xs font-medium text-[#5d1700] mb-1 font-[Quicksand]">
              Precio Unitario *
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A73249] focus:border-transparent bg-white font-[Quicksand]"
            />
          </div>
        </div>

        {/* Botón agregar */}
        <div className="mt-3">
          <button
            type="button"
            onClick={addItem}
            disabled={!selectedProduct || quantity < 1 || price < 0 || disabled}
            className="flex items-center gap-2 px-4 py-2 bg-[#A73249] text-white text-sm rounded-lg hover:bg-[#A73249]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[Quicksand] font-medium"
          >
            <Plus className="w-4 h-4" />
            Agregar Producto
          </button>
        </div>
      </div>

      {/* Lista de items agregados */}
      {items.length > 0 && (
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="bg-[#E8E1D8] px-4 py-3 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-[#3D1609] font-[Quicksand]">
              Productos en el Pedido ({items.length})
            </h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div key={index} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm text-[#3D1609] font-[Quicksand]">
                        {item.name || `Producto ${index + 1}`}
                      </span>
                      <div className="text-xs text-[#5d1700] mt-1 font-[Quicksand]">
                        Cantidad: {item.quantity} × ${item.price?.toFixed(2)} = 
                        <span className="font-semibold text-[#A73249] ml-1">
                          ${item.subtotal?.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {/* Editar cantidad */}
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        disabled={disabled}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A73249] bg-white font-[Quicksand]"
                      />
                      
                      {/* Editar precio */}
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', e.target.value)}
                        disabled={disabled}
                        className="w-24 px-2 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#A73249] bg-white font-[Quicksand]"
                      />
                      
                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={disabled}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="bg-[#E8E1D8] px-4 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#3D1609] font-[Quicksand]">Total del Pedido:</span>
              <span className="text-lg font-bold text-[#A73249] font-[Quicksand]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
          <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-2" />
          <p className="text-sm font-[Quicksand]">No hay productos en el pedido</p>
          <p className="text-xs mt-1 font-[Quicksand]">Agrega productos usando el formulario superior</p>
        </div>
      )}
    </div>
  );
};

export default OrderItemsField;
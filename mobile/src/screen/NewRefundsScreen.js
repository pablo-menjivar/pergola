import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { formatPrice } from './catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const NewRefundScreen = ({ navigation }) => {
  const { user, API, fetchWithAuth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [reason, setReason] = useState('');
  const [comments, setComments] = useState('');
  const [refundMethod, setRefundMethod] = useState('efectivo contra entrega');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    if (user?.id) loadUserOrders();
  }, [user]);

  const loadUserOrders = async () => {
    try {
      console.log('🔄 Cargando pedidos del usuario:', user?.id);
      const response = await fetchWithAuth(`${API}/orders`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Datos de pedidos recibidos:', data);
        
        // Filtrar pedidos del usuario que estén entregados
        const userOrders = Array.isArray(data)
          ? data.filter(order => {
              console.log('🔍 Verificando pedido:', {
                orderId: order._id,
                customerId: order.customer,
                userId: user.id,
                status: order.status
              });
              
              return (order.customer === user.id || order.customer?._id === user.id) &&
                     order.status === 'entregado';
            })
          : [];
          
        console.log('✅ Pedidos filtrados:', userOrders.length);
        setOrders(userOrders);
      } else {
        console.error('❌ Error en respuesta:', response.status);
      }
    } catch (err) {
      console.error('💥 Error loading orders:', err);
      if (err.message !== 'SESSION_EXPIRED') {
        Alert.alert('Error', 'No se pudieron cargar los pedidos');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateRefundCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `REF-${timestamp}-${random}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!selectedOrder) {
      newErrors.order = 'Debes seleccionar un pedido';
    }

    if (selectedItems.length === 0) {
      newErrors.items = 'Debes seleccionar al menos un producto';
    }

    if (!reason.trim() || reason.trim().length < 10) {
      newErrors.reason = 'La razón debe tener al menos 10 caracteres';
    }

    if (reason.trim().length > 200) {
      newErrors.reason = 'La razón no puede exceder los 200 caracteres';
    }

    if (comments && comments.trim().length > 500) {
      newErrors.comments = 'Los comentarios no pueden exceder los 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateRefundAmount = () => {
    if (!selectedOrder || selectedItems.length === 0) return 0;
    
    return selectedItems.reduce((total, itemId) => {
      const orderItem = selectedOrder.items.find(item => item.itemId._id === itemId);
      return total + (orderItem ? orderItem.price * orderItem.quantity : 0);
    }, 0);
  };

  const handleSubmitRefund = async () => {
    if (!validateForm()) {
      Alert.alert('Errores en el formulario', 'Por favor corrige los errores antes de continuar');
      return;
    }

    Alert.alert(
      'Confirmar solicitud',
      `¿Deseas enviar esta solicitud de devolución por ${formatPrice(calculateRefundAmount())}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: submitRefund }
      ]
    );
  };

  const submitRefund = async () => {
    setSubmitting(true);
    
    try {
      const refundCode = generateRefundCode();
      const amount = calculateRefundAmount();

      // CORREGIDO: Estructura de datos mejorada y logging
      const refundData = {
        refundCode,
        order: selectedOrder._id,
        customer: user.id,
        reason: reason.trim(),
        comments: comments.trim() || undefined,
        items: selectedItems, // Array de IDs de productos
        status: 'pendiente',
        amount,
        refundMethod,
        requestDate: new Date().toISOString() // Fecha explícita
      };

      console.log('📤 Enviando datos de reembolso:', JSON.stringify(refundData, null, 2));

      // CORREGIDO: Usar el endpoint correcto según tu backend
      const response = await fetchWithAuth(`${API}/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refundData)
      });

      console.log('📥 Respuesta del servidor:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Reembolso creado exitosamente:', responseData);
        
        Alert.alert(
          'Solicitud enviada',
          `Tu solicitud de devolución ${refundCode} ha sido enviada exitosamente`,
          [
            {
              text: 'Ver devoluciones',
              onPress: () => navigation.navigate('Refunds')
            }
          ]
        );
      } else {
        // CORREGIDO: Mejor manejo de errores
        let errorMessage = 'Error al crear la solicitud';
        
        try {
          const errorData = await response.json();
          console.log('❌ Error del servidor:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          console.log('❌ Error parseando respuesta de error');
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('💥 Error submitting refund:', error);
      
      if (error.message !== 'SESSION_EXPIRED') {
        Alert.alert(
          'Error',
          error.message === 'Failed to fetch' 
            ? 'Error de conexión. Verifica tu internet.'
            : error.message || 'No se pudo procesar la solicitud'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleItemSelection = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.orderItem,
        selectedOrder?._id === item._id && styles.orderItemSelected
      ]}
      onPress={() => {
        console.log('📦 Seleccionando pedido:', item._id, 'con', item.items?.length, 'productos');
        setSelectedOrder(item);
        setSelectedItems([]);
      }}
    >
      <Text style={styles.orderCode}>
        Pedido #{item.orderCode || item._id.slice(-6)}
      </Text>
      <Text style={styles.orderDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-ES') : 'N/A'}
      </Text>
      <Text style={styles.orderTotal}>Total: {formatPrice(item.total)}</Text>
      <Text style={styles.orderItems}>
        {item.items?.length || 0} producto{(item.items?.length || 0) !== 1 ? 's' : ''}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => {
    const isSelected = selectedItems.includes(item.itemId._id);
    
    return (
      <TouchableOpacity
        style={[
          styles.productItem,
          isSelected && styles.productItemSelected
        ]}
        onPress={() => {
          console.log('🛍️ Toggling producto:', item.itemId._id, item.itemId.name);
          toggleItemSelection(item.itemId._id);
        }}
      >
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.itemId.name}</Text>
          <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
          <Text style={styles.productPrice}>
            {formatPrice(item.price)} c/u
          </Text>
        </View>
        <View style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected
        ]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
        <Text style={styles.loadingText}>
          {loading ? 'Cargando pedidos...' : 'Cargando fuentes...'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Nueva Devolución</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seleccionar pedido */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seleccionar Pedido</Text>
          
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                No tienes pedidos entregados elegibles para devolución
              </Text>
              <TouchableOpacity 
                style={styles.refreshButton}
                onPress={loadUserOrders}
              >
                <Text style={styles.refreshButtonText}>Actualizar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.ordersList}
            />
          )}
          
          {errors.order && (
            <Text style={styles.errorText}>{errors.order}</Text>
          )}
        </View>

        {/* Seleccionar productos */}
        {selectedOrder && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Productos a Devolver</Text>
            
            {selectedOrder.items && selectedOrder.items.length > 0 ? (
              <FlatList
                data={selectedOrder.items}
                renderItem={renderProductItem}
                keyExtractor={(item) => item.itemId._id}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.emptyText}>
                Este pedido no tiene productos válidos
              </Text>
            )}
            
            {errors.items && (
              <Text style={styles.errorText}>{errors.items}</Text>
            )}
          </View>
        )}

        {/* Razón de la devolución */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Razón de la Devolución *</Text>
          
          <TextInput
            style={[styles.textArea, errors.reason && styles.inputError]}
            value={reason}
            onChangeText={setReason}
            placeholder="Explica por qué quieres devolver estos productos"
            multiline
            numberOfLines={4}
            maxLength={200}
          />
          
          <Text style={styles.charCount}>{reason.length}/200</Text>
          
          {errors.reason && (
            <Text style={styles.errorText}>{errors.reason}</Text>
          )}
        </View>

        {/* Comentarios adicionales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentarios Adicionales</Text>
          
          <TextInput
            style={[styles.textArea, errors.comments && styles.inputError]}
            value={comments}
            onChangeText={setComments}
            placeholder="Información adicional (opcional)"
            multiline
            numberOfLines={3}
            maxLength={500}
          />
          
          <Text style={styles.charCount}>{comments.length}/500</Text>
          
          {errors.comments && (
            <Text style={styles.errorText}>{errors.comments}</Text>
          )}
        </View>

        {/* Método de reembolso */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Reembolso</Text>
          
          {['efectivo contra entrega', 'transferencia bancaria'].map((method) => (
            <TouchableOpacity
              key={method}
              style={[
                styles.paymentOption,
                refundMethod === method && styles.paymentOptionActive
              ]}
              onPress={() => setRefundMethod(method)}
            >
              <View style={[
                styles.radio,
                refundMethod === method && styles.radioActive
              ]}>
                {refundMethod === method && (
                  <View style={styles.radioDot} />
                )}
              </View>
              <Text style={[
                styles.paymentOptionText,
                refundMethod === method && styles.paymentOptionTextActive
              ]}>
                {method === 'efectivo contra entrega' ? 'Efectivo' : 'Transferencia Bancaria'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Resumen */}
        {selectedItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen</Text>
            
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Productos seleccionados:</Text>
                <Text style={styles.summaryValue}>{selectedItems.length}</Text>
              </View>
              
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Monto a reembolsar:</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(calculateRefundAmount())}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Footer con botón de envío */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton, 
            (submitting || orders.length === 0 || selectedItems.length === 0) && styles.submitButtonDisabled
          ]}
          onPress={handleSubmitRefund}
          disabled={submitting || orders.length === 0 || selectedItems.length === 0}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Enviar Solicitud</Text>
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: statusBarHeight + 10,
    paddingBottom: 16,
    backgroundColor: '#E3C6B8',
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: '#A73249',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
  },
  ordersList: {
    marginBottom: 8,
  },
  orderItem: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 150,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orderItemSelected: {
    backgroundColor: '#FFF5F0',
    borderColor: '#A73249',
  },
  orderCode: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#A73249',
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#3D1609',
    marginBottom: 4,
  },
  orderTotal: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#3D1609',
    marginBottom: 2,
  },
  orderItems: {
    fontFamily: 'Nunito-Regular',
    fontSize: 11,
    color: '#666666',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  productItemSelected: {
    backgroundColor: '#FFF5F0',
    borderColor: '#A73249',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#3D1609',
    marginBottom: 4,
  },
  productQuantity: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  productPrice: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#A73249',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  textArea: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    borderWidth: 1,
    borderColor: '#E8D5C9',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
  },
  charCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
    textAlign: 'right',
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#F44336',
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  paymentOptionActive: {
    backgroundColor: '#FFF5F0',
    borderColor: '#A73249',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: '#A73249',
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#A73249',
  },
  paymentOptionText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  paymentOptionTextActive: {
    color: '#A73249',
    fontFamily: 'Nunito-Bold',
  },
  summaryCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  totalValue: {
    fontSize: 18,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  submitButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
});

export default NewRefundScreen;
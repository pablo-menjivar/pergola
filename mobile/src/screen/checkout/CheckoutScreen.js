import { useState, useContext, useEffect } from 'react';
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
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { useFonts } from 'expo-font';
import { formatPrice } from '../catalog/productUtils';
import { DateTimePickerAndroid } from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

// Constantes para los pasos del checkout
const STEPS = {
  DELIVERY: 1,
  PAYMENT: 2,
  REVIEW: 3,
};

const CheckoutScreen = ({ navigation }) => {
  const { user, API, fetchWithAuth } = useContext(AuthContext);
  const { cart, cartTotal, cartSubtotal, clearCart } = useContext(CartContext);

  // Estado para controlar el paso actual
  const [currentStep, setCurrentStep] = useState(STEPS.DELIVERY);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Datos del formulario
  const [formData, setFormData] = useState({
    receiver: '',
    timetable: '',
    mailingAddress: '',
    paymentMethod: 'efectivo contra entrega',
    receiptDate: ''
  });

  // Estado para el DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Errores de validación
  const [errors, setErrors] = useState({});

  // Cargar fuentes personalizadas
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  // Cargar datos del cliente al montar el componente
  useEffect(() => {
    loadCustomerData();
  }, []);

  // Obtener información del cliente desde la API
  const loadCustomerData = async () => {
    try {
      const response = await fetchWithAuth(`${API}/customers/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setCustomerData(data);

        // Pre-llenar el formulario con datos del cliente
        setFormData(prev => ({
          ...prev,
          receiver: `${data.name} ${data.lastName}`,
          mailingAddress: data.address || '',
        }));
      }
    } catch (error) {
      console.error('Error loading customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Formatear número de teléfono con patrón salvadoreño
  const formatPhoneNumber = (text) => {
    const prefix = "+503-";
    let numbers = text.replace(/\D/g, '');

    if (!text.startsWith(prefix)) {
      numbers = numbers.slice(3);
    }

    numbers = numbers.slice(0, 8);
    return prefix + numbers;
  };

  // Formatear fecha en formato DD/MM/AAAA
  const formatDate = (text) => {
    let numbers = text.replace(/\D/g, '');
    numbers = numbers.slice(0, 8);

    if (numbers.length >= 5) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    } else if (numbers.length >= 3) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    return numbers;
  };

  // Validar los campos del paso actual
  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === STEPS.DELIVERY) {
      // Validar nombre del receptor
      if (!formData.receiver.trim() || formData.receiver.trim().length < 5) {
        newErrors.receiver = 'El nombre del receptor debe tener al menos 5 caracteres';
      }

      if (formData.receiver.trim().length > 100) {
        newErrors.receiver = 'El nombre no puede exceder los 100 caracteres';
      }

      // Validar dirección de envío
      if (!formData.mailingAddress.trim() || formData.mailingAddress.trim().length < 10) {
        newErrors.mailingAddress = 'La dirección debe tener al menos 10 caracteres';
      }

      if (formData.mailingAddress.trim().length > 200) {
        newErrors.mailingAddress = 'La dirección no puede exceder los 200 caracteres';
      }

      // Validar horario 
      if (formData.timetable && formData.timetable.trim().length > 100) {
        newErrors.timetable = 'El horario no puede exceder los 100 caracteres';
      }
      if (!formData.timetable || typeof formData.timetable !== 'string' || formData.timetable.trim() === '') {
        newErrors.timetable = 'El horario es obligatorio';
      }

      // Validar fecha de recepción (ahora obligatorio)
      if (!formData.receiptDate || formData.receiptDate.trim() === '') {
        newErrors.receiptDate = 'La fecha de recepción es obligatoria';
      } else {
        const [day, month, year] = formData.receiptDate.split('/');
        if (day && month && year && year.length === 4) {
          const selectedDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          selectedDate.setHours(0, 0, 0, 0);
          if (isNaN(selectedDate.getTime())) {
            newErrors.receiptDate = 'La fecha de recepción no es válida';
          } else if (selectedDate < today) {
            newErrors.receiptDate = 'La fecha de recepción debe ser futura o igual a hoy';
          }
        } else {
          newErrors.receiptDate = 'Formato de fecha inválido (DD/MM/AAAA)';
        }
      }
    }

    if (currentStep === STEPS.PAYMENT) {
      // Validar método de pago
      if (!['efectivo contra entrega', 'transferencia bancaria'].includes(formData.paymentMethod)) {
        newErrors.paymentMethod = 'Método de pago no válido';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navegar al siguiente paso
  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      Alert.alert('Errores en el formulario', 'Por favor corrige los errores antes de continuar');
      return;
    }

    if (currentStep < STEPS.REVIEW) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  // Navegar al paso anterior
  const handlePreviousStep = () => {
    if (currentStep > STEPS.DELIVERY) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  // Manejar selección de fecha desde el DatePicker
  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const formattedDate = `${day}/${month}/${year}`;

      setFormData(prev => ({ ...prev, receiptDate: formattedDate }));
      setSelectedDate(date);
    }
  };

  // Abrir DatePicker
  const openDatePicker = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(true);
    }
  };

  // Generar código único para el pedido
  const generateOrderCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  // Mostrar confirmación antes de enviar el pedido
  const handleSubmitOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Carrito vacío', 'No hay productos en el carrito');
      return;
    }

    Alert.alert(
      'Confirmar pedido',
      `Total a pagar: ${formatPrice(cartTotal)}\n¿Deseas confirmar este pedido?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Confirmar', onPress: submitOrder }
      ]
    );
  };

  // Enviar el pedido a la API
  const submitOrder = async () => {
    setSubmitting(true);

    try {
      const orderCode = generateOrderCode();

      // Mapear items del carrito
      const items = cart.map(item => ({
        itemId: item._id,
        quantity: item.quantity,
        price: item.discount > 0 ? item.price * (1 - item.discount) : item.price
      }));

      // Convertir fecha a formato ISO si existe
      let receiptDateISO = null;
      if (formData.receiptDate && formData.receiptDate.trim()) {
        const [day, month, year] = formData.receiptDate.split('/');
        if (day && month && year) {
          receiptDate = new Date(year, month - 1, day).toISOString();
        }
      }

      // Construir objeto del pedido
      const orderData = {
        orderCode,
        customer: user.id,
        receiver: formData.receiver.trim(),
        timetable: formData.timetable.trim(),
        mailingAddress: formData.mailingAddress.trim(),
        paymentMethod: formData.paymentMethod,
        status: 'pendiente',
        paymentStatus: 'pendiente',
        receiptDate: receiptDateISO,
        items,
        subtotal: cartSubtotal,
        total: cartTotal
      };

      // Enviar pedido a la API
      const response = await fetchWithAuth(`${API}/public/orders`, {
        method: 'POST',
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        const result = await response.json();

        // Limpiar el carrito
        await clearCart();

        Alert.alert(
          'Pedido realizado',
          `Tu pedido ${orderCode} ha sido creado exitosamente`,
          [
            {
              text: 'Ver mis pedidos',
              onPress: () => navigation.navigate('Home', { screen: 'Profile' })
            }
          ]
        );

        // Navegar a pantalla de éxito
        navigation.navigate('OrderSuccess', {
          orderId: result.data._id,
          orderCode: orderCode
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el pedido');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      Alert.alert('Error', error.message || 'No se pudo procesar el pedido');
    } finally {
      setSubmitting(false);
    }
  };

  // Mostrar indicador de carga
  if (!fontsLoaded || loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  // Metadatos del stepper y progreso
  const stepsMeta = [
    { id: STEPS.DELIVERY, label: 'Entrega', icon: 'location-outline' },
    { id: STEPS.PAYMENT, label: 'Pago', icon: 'card-outline' },
    { id: STEPS.REVIEW, label: 'Revisar', icon: 'checkmark-done-outline' },
  ];
  const progressPercent = ((currentStep - 1) / (stepsMeta.length - 1)) * 100;

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Finalizar Compra</Text>

        <View style={{ width: 40 }} />
      </View>
      {/* Stepper mejorado */}
      <View style={styles.stepperContainer}>
        <View style={styles.stepperHeader}>
          <Text style={styles.stepperTitle}>
            {stepsMeta[currentStep - 1]?.label}
          </Text>
          <Text style={styles.stepperSubtitle}>
            Paso {currentStep} de {stepsMeta.length}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>

        <View style={styles.stepItemsRow}>
          {stepsMeta.map((s) => {
            const isDone = currentStep > s.id;
            const isActive = currentStep === s.id;
            return (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.stepPill,
                  isActive && styles.stepPillActive,
                  isDone && styles.stepPillDone
                ]}
                activeOpacity={isDone ? 0.8 : 1}
                onPress={() => {
                  if (isDone) setCurrentStep(s.id);
                }}
              >
                <Ionicons
                  name={isDone ? 'checkmark-circle' : s.icon}
                  size={16}
                  color={isDone ? '#FFFFFF' : isActive ? '#A73249' : '#8C6F61'}
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isDone && styles.stepLabelDone
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      {/* Contenido con scroll - Mostrar solo el paso actual */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* PASO 1: Información de Entrega */}
        {currentStep === STEPS.DELIVERY && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Información de Entrega</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nombre del Receptor *</Text>
              <TextInput
                style={[styles.input, errors.receiver && styles.inputError]}
                value={formData.receiver}
                onChangeText={(text) => setFormData(prev => ({ ...prev, receiver: text }))}
                placeholder="Nombre completo de quien recibe"
                maxLength={100}
              />
              {errors.receiver && (
                <Text style={styles.errorText}>{errors.receiver}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Dirección de Envío *</Text>
              <TextInput
                style={[styles.input, styles.textArea, errors.mailingAddress && styles.inputError]}
                value={formData.mailingAddress}
                onChangeText={(text) => setFormData(prev => ({ ...prev, mailingAddress: text }))}
                placeholder="Dirección completa de entrega"
                multiline
                numberOfLines={3}
                maxLength={200}
              />
              {errors.mailingAddress && (
                <Text style={styles.errorText}>{errors.mailingAddress}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Programa un Horario de Entrega</Text>
              <TextInput
                style={[styles.input, errors.timetable && styles.inputError]}
                value={formData.timetable}
                onChangeText={(text) => setFormData(prev => ({ ...prev, timetable: text }))}
                placeholder="Ej: 9:00 AM - 5:00 PM"
                maxLength={100}
              />
              {errors.timetable && (
                <Text style={styles.errorText}>{errors.timetable}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Programa una Fecha de Entrega</Text>
              <TouchableOpacity
                style={[styles.input, styles.datePickerButton, errors.receiptDate && styles.inputError]}
                onPress={openDatePicker}
              >
                <Text style={[styles.input, { color: formData.receiptDate ? '#3D1609' : '#999999' }]}>
                  {formData.receiptDate || 'DD/MM/AAAA'}
                </Text>
              </TouchableOpacity>
              {errors.receiptDate && (
                <Text style={styles.errorText}>{errors.receiptDate}</Text>
              )}
            </View>

            {/* DatePicker - Mostrar solo cuando esté abierto */}
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>
        )}

        {/* PASO 2: Método de Pago */}
        {currentStep === STEPS.PAYMENT && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Método de Pago</Text>

            {['efectivo contra entrega', 'transferencia bancaria'].map((method) => (
              <TouchableOpacity
                key={method}
                style={[
                  styles.paymentOption,
                  formData.paymentMethod === method && styles.paymentOptionActive
                ]}
                onPress={() => setFormData(prev => ({ ...prev, paymentMethod: method }))}
              >
                <View style={[
                  styles.radio,
                  formData.paymentMethod === method && styles.radioActive
                ]}>
                  {formData.paymentMethod === method && (
                    <View style={styles.radioDot} />
                  )}
                </View>
                <Text style={[
                  styles.paymentOptionText,
                  formData.paymentMethod === method && styles.paymentOptionTextActive
                ]}>
                  {method.charAt(0).toUpperCase() + method.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* PASO 3: Resumen del Pedido */}
        {currentStep === STEPS.REVIEW && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumen del Pedido</Text>

            <View style={styles.summaryCard}>
              {cart.map((item) => {
                const itemPrice = item.discount > 0
                  ? item.price * (1 - item.discount)
                  : item.price;
                const itemTotal = itemPrice * item.quantity;

                return (
                  <View key={item._id} style={styles.summaryItem}>
                    <View style={styles.summaryItemInfo}>
                      <Text style={styles.summaryItemName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.summaryItemQuantity}>
                        x{item.quantity}
                      </Text>
                    </View>
                    <Text style={styles.summaryItemPrice}>
                      {formatPrice(itemTotal)}
                    </Text>
                  </View>
                );
              })}

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal:</Text>
                <Text style={styles.summaryValue}>
                  {formatPrice(cartSubtotal)}
                </Text>
              </View>

              {cartSubtotal !== cartTotal && (
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, styles.discountLabel]}>
                    Descuentos:
                  </Text>
                  <Text style={[styles.summaryValue, styles.discountValue]}>
                    -{formatPrice(cartSubtotal - cartTotal)}
                  </Text>
                </View>
              )}

              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total:</Text>
                <Text style={styles.totalValue}>
                  {formatPrice(cartTotal)}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Pie de página con botones de navegación */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.footerInfo}>
            <Text style={styles.footerLabel}>Total a pagar</Text>
            <Text style={styles.footerTotal}>{formatPrice(cartTotal)}</Text>
          </View>

          {/* Botón Anterior (solo si no estamos en el primer paso) */}
          {currentStep > STEPS.DELIVERY && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={handlePreviousStep}
            >
              <Ionicons name="chevron-back" size={20} color="#A73249" />
            </TouchableOpacity>
          )}

          {/* Botón Siguiente o Confirmar */}
          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={currentStep === STEPS.REVIEW ? handleSubmitOrder : handleNextStep}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>
                  {currentStep === STEPS.REVIEW ? 'Confirmar Pedido' : 'Siguiente'}
                </Text>
                <Ionicons
                  name={currentStep === STEPS.REVIEW ? "checkmark-circle" : "arrow-forward"}
                  size={22}
                  color="#FFFFFF"
                />
              </>
            )}
          </TouchableOpacity>
        </View>
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
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    borderWidth: 1,
    borderColor: '#E8D5C9',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#F44336',
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
  // Indicador de progreso
  stepsIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E3C6B8',
    alignItems: 'center',
  },
  stepsTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'center',
  },
  stepItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5EDE8',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E8D5C9',
  },
  stepDotActive: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  stepDotCurrent: {
    borderWidth: 3,
  },
  stepConnector: {
    width: 24,
    height: 2,
    backgroundColor: '#E8D5C9',
    marginHorizontal: 4,
  },
  stepConnectorActive: {
    backgroundColor: '#A73249',
  },
  stepCounter: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
  },

  // Stepper mejorado
  stepperContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#E3C6B8',
  },
  stepperHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stepperTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  stepperSubtitle: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    opacity: 0.8,
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E8D5C9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A73249',
    borderRadius: 8,
    width: '0%',
  },
  stepItemsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  stepPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E8D5C9',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  stepPillActive: {
    backgroundColor: '#FFF5F0',
    borderColor: '#A73249',
    elevation: 2,
    shadowOpacity: 0.08,
  },
  stepPillDone: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  stepLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#8C6F61',
  },
  stepLabelActive: {
    color: '#A73249',
  },
  stepLabelDone: {
    color: '#FFFFFF',
  },

  // DatePicker
  datePickerButton: {
    justifyContent: 'center',
    paddingVertical: 12,
  },
  summaryCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryItemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  summaryItemName: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    flex: 1,
  },
  summaryItemQuantity: {
    fontSize: 12,
    fontFamily: 'Nunito-SemiBold',
    color: '#666666',
    marginLeft: 8,
  },
  summaryItemPrice: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8D5C9',
    marginVertical: 12,
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
  discountLabel: {
    color: '#4CAF50',
  },
  discountValue: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  totalValue: {
    fontSize: 22,
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
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  footerInfo: {
    flex: 1,
  },
  footerLabel: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginBottom: 4,
  },
  footerTotal: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  prevButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
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

export default CheckoutScreen;
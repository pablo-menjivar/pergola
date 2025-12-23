import { useFonts } from 'expo-font';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const OrderDetailScreen = ({ route, navigation }) => {
  const { order } = route.params || {};
  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  if (!fontsLoaded) return null;

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No se encontró el pedido.</Text>
      </View>
    );
  }

  const renderProduct = ({ item }) => {
    const product = item.itemId || {};
    const imagesField = product.images || product.image || product.img || [];
    const imageUri =
      Array.isArray(imagesField) && imagesField.length > 0
        ? imagesField[0]
        : typeof imagesField === 'string'
        ? imagesField
        : 'https://via.placeholder.com/150/cccccc/555555?text=Sin+imagen';

    const productName = product.name || 'Producto sin nombre';
    const unitPrice = item.price || product.price || 0;
    const quantity = item.quantity || 0;

    return (
      <View style={styles.productItem}>
        <Image
          source={{ uri: imageUri }}
          style={styles.productImage}
          onError={(e) => console.log('❌ Error cargando imagen:', e.nativeEvent.error)}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>{productName}</Text>
          <Text style={styles.productQuantity}>Cantidad: {quantity}</Text>
          <Text style={styles.productPrice}>${(unitPrice * quantity).toFixed(2)}</Text>
        </View>
      </View>
    );
  };
  console.log('📦 order.items:', JSON.stringify(order.items, null, 2));

  const renderOrderTracker = (status) => {
    const steps = [
      { key: 'pendiente', label: 'Pendiente', icon: 'time-outline' },
      { key: 'en proceso', label: 'En proceso', icon: 'cog-outline' },
      { key: 'enviado', label: 'Enviado', icon: 'cube-outline' },
      { key: 'entregado', label: 'Entregado', icon: 'checkmark-done-outline' },
    ];

    if (status === 'cancelado') {
      return (
        <View style={{ alignItems: 'center', paddingVertical: 10 }}>
          <Ionicons name="close-circle-outline" size={40} color="#999" />
          <Text style={{ fontFamily: 'Nunito-Bold', color: '#999', marginTop: 6 }}>
            Pedido cancelado
          </Text>
        </View>
      );
    }
    // Asignar índice según estado actual
    const currentIndex = steps.findIndex(s => s.key === status);

    return (
      <View style={styles.trackerRow}>
        {steps.map((step, index) => {
          const isActive = index <= currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <View key={step.key} style={styles.trackerStep}>
              {/* Línea de conexión */}
              {index > 0 && (
                <View style={[ styles.trackerLine, isActive && { backgroundColor: '#A73249' }, ]}/>
              )}
              {/* Ícono */}
              <View style={[ styles.trackerCircle, isActive && { backgroundColor: '#A73249', borderColor: '#A73249' }, ]}>
                <Ionicons name={step.icon} size={18} color={isActive ? '#fff' : '#A73249'}/>
              </View>

              {/* Etiqueta */}
              <Text style={[ styles.trackerLabel, isCurrent && { fontFamily: 'Nunito-Bold', color: '#A73249' } ]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalle del Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.orderSummary}>
          {/* Seguimiento visual del estado del pedido */}
          <View style={styles.trackerContainer}>
            {renderOrderTracker(order.status)}
          </View>
          <Text style={styles.orderNumber}>Pedido #{order._id?.slice(-6)}</Text>
          <Text style={styles.orderDate}>
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES') : 'N/A'}
          </Text>
          <Text style={styles.orderStatus}>Estado: {order.status || 'Pendiente'}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos</Text>
          <FlatList
            data={order.items || []}
            renderItem={renderProduct}
            keyExtractor={(item, index) => item._id || index.toString()}
            scrollEnabled={false}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de envío</Text>
          <Text style={styles.detailText}>
            Dirección: {order.mailingAddress || 'No especificada'}
          </Text>
          <Text style={styles.detailText}>
            Método de pago: {order.paymentMethod || 'No especificado'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del pedido</Text>
          <Text style={styles.detailText}>Subtotal: ${order.subtotal?.toFixed(2) || '0.00'}</Text>
          {order.shippingCost !== undefined && (
            <Text style={styles.detailText}>Envío: ${order.shippingCost.toFixed(2)}</Text>
          )}
          <Text style={styles.totalText}>Total: ${order.total?.toFixed(2) || '0.00'}</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  orderSummary: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderNumber: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#A73249',
  },
  orderDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#3D1609',
    marginTop: 4,
  },
  orderStatus: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#3D1609',
    marginTop: 6,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#A73249',
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#F5EDE8',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'space-between',
  },
  productName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 13,
    color: '#3D1609',
  },
  productQuantity: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#3D1609',
  },
  productPrice: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#A73249',
  },
  detailText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#3D1609',
    marginBottom: 4,
  },
  totalText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
    color: '#A73249',
    marginTop: 4,
  },
  trackerContainer: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackerStep: {
    alignItems: 'center',
    flex: 1,
    position: 'relative',
  },
  trackerCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: '#A73249',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  trackerLine: {
    position: 'absolute',
    top: 17,
    left: -((Dimensions.get('window').width / 4) - 34) / 2 + 20,
    height: 2,
    width: '100%',
    backgroundColor: '#E8D5C9',
    zIndex: 1,
  },
  trackerLabel: {
    marginTop: 6,
    fontSize: 11,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#A73249',
  },
});

export default OrderDetailScreen;
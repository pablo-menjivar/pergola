import { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { formatPrice } from './catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const RefundDetailScreen = ({ route, navigation }) => {
  const { refund } = route.params;
  const { API, fetchWithAuth } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pendiente': return '#FF9800';
      case 'aprobado': return '#4CAF50';
      case 'rechazado': return '#F44336';
      case 'procesado': return '#2196F3';
      default: return '#666666';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pendiente': return 'Pendiente';
      case 'aprobado': return 'Aprobado';
      case 'rechazado': return 'Rechazado';
      case 'procesado': return 'Procesado';
      default: return status;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case 'pendiente': 
        return 'Tu solicitud está siendo revisada por nuestro equipo.';
      case 'aprobado': 
        return 'Tu solicitud ha sido aprobada y se procederá con el reembolso.';
      case 'rechazado': 
        return 'Tu solicitud ha sido rechazada. Contacta con soporte para más información.';
      case 'procesado': 
        return 'El reembolso ha sido procesado exitosamente.';
      default: 
        return '';
    }
  };

  const handleCancelRefund = async () => {
    Alert.alert(
      'Cancelar devolución',
      '¿Estás seguro de que deseas cancelar esta solicitud de devolución?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const response = await fetchWithAuth(`${API}/refunds/${refund._id}`, {
                method: 'DELETE'
              });
              
              if (response.ok) {
                Alert.alert(
                  'Devolución cancelada',
                  'La solicitud de devolución ha sido cancelada exitosamente',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.goBack()
                    }
                  ]
                );
              } else {
                Alert.alert('Error', 'No se pudo cancelar la solicitud');
              }
            } catch (error) {
              if (error.message !== 'SESSION_EXPIRED') {
                Alert.alert('Error', 'Error de conexión al cancelar la solicitud');
              }
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  if (!fontsLoaded) return null;

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
        
        <Text style={styles.headerTitle}>Detalle de Devolución</Text>
        
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Estado de la devolución */}
        <View style={styles.section}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(refund.status) }]}>
              <Text style={styles.statusText}>{getStatusText(refund.status)}</Text>
            </View>
            <Text style={styles.refundCode}>#{refund.refundCode}</Text>
          </View>
          
          <Text style={styles.statusDescription}>
            {getStatusDescription(refund.status)}
          </Text>
        </View>

        {/* Información básica */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información General</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fecha de solicitud:</Text>
              <Text style={styles.infoValue}>
                {refund.requestDate ? new Date(refund.requestDate).toLocaleDateString('es-ES') : 'N/A'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Monto del reembolso:</Text>
              <Text style={styles.amountText}>{formatPrice(refund.amount)}</Text>
            </View>
            
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Método de reembolso:</Text>
              <Text style={styles.infoValue}>
                {refund.refundMethod === 'efectivo contra entrega' ? 'Efectivo' : 'Transferencia Bancaria'}
              </Text>
            </View>
            
            {refund.order && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Pedido relacionado:</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('OrderDetail', { 
                    order: refund.order 
                  })}
                >
                  <Text style={styles.linkText}>
                    #{refund.order.orderCode || refund.order._id?.slice(-6)}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {/* Productos a devolver */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Productos a Devolver</Text>
          
          {refund.items && refund.items.length > 0 ? (
            refund.items.map((item, index) => (
              <View key={index} style={styles.productItem}>
                {item.images && item.images[0] && (
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.productImage}
                  />
                )}
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.name || 'Producto'}</Text>
                  <Text style={styles.productPrice}>
                    {item.price ? formatPrice(item.price) : 'Precio no disponible'}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No hay productos especificados</Text>
          )}
        </View>

        {/* Razón y comentarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles de la Solicitud</Text>
          
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Razón de la devolución:</Text>
            <Text style={styles.detailText}>{refund.reason}</Text>
            
            {refund.comments && (
              <>
                <Text style={[styles.detailLabel, { marginTop: 16 }]}>
                  Comentarios adicionales:
                </Text>
                <Text style={styles.detailText}>{refund.comments}</Text>
              </>
            )}
          </View>
        </View>

        {/* Línea de tiempo (si hay actualizaciones) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial</Text>
          
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Solicitud creada</Text>
              <Text style={styles.timelineDate}>
                {refund.requestDate ? new Date(refund.requestDate).toLocaleDateString('es-ES') : 'N/A'}
              </Text>
            </View>
          </View>
          
          {refund.status !== 'pendiente' && (
            <View style={styles.timelineItem}>
              <View style={[styles.timelineDot, { backgroundColor: getStatusColor(refund.status) }]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Estado actualizado</Text>
                <Text style={styles.timelineStatus}>
                  Marcado como {getStatusText(refund.status).toLowerCase()}
                </Text>
                <Text style={styles.timelineDate}>
                  {refund.updatedAt ? new Date(refund.updatedAt).toLocaleDateString('es-ES') : 'N/A'}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botones de acción */}
      {refund.status === 'pendiente' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.cancelButton, loading && styles.buttonDisabled]}
            onPress={handleCancelRefund}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#F44336" />
            ) : (
              <>
                <Ionicons name="close-circle-outline" size={20} color="#F44336" />
                <Text style={styles.cancelButtonText}>Cancelar Solicitud</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
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
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  refundCode: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 18,
    color: '#A73249',
  },
  statusDescription: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 14,
    color: '#666666',
    flex: 1,
  },
  infoValue: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    textAlign: 'right',
    flex: 1,
  },
  amountText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
    color: '#A73249',
    textAlign: 'right',
    flex: 1,
  },
  linkText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#2196F3',
    textAlign: 'right',
    flex: 1,
  },
  productItem: {
    flexDirection: 'row',
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E8D5C9',
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
    color: '#3D1609',
    marginBottom: 4,
  },
  productPrice: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#A73249',
  },
  emptyText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  detailCard: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 16,
  },
  detailLabel: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#3D1609',
    marginBottom: 8,
  },
  detailText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 14,
    color: '#3D1609',
    lineHeight: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#A73249',
    marginRight: 12,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#3D1609',
    marginBottom: 2,
  },
  timelineStatus: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: '#666666',
    marginBottom: 2,
  },
  timelineDate: {
    fontFamily: 'Nunito-Regular',
    fontSize: 12,
    color: '#999999',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#F44336',
  },
});

export default RefundDetailScreen;
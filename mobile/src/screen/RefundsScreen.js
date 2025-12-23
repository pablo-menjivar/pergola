import { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useFonts } from 'expo-font';
import { formatPrice } from './catalog/productUtils';

const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

const RefundsScreen = ({ navigation }) => {
  const { user, API, fetchWithAuth } = useContext(AuthContext);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    if (user?.id) loadRefunds();
  }, [user]);

  const loadRefunds = async () => {
    try {
      const response = await fetchWithAuth(`${API}/refunds`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo las devoluciones del usuario actual
        const userRefunds = Array.isArray(data)
          ? data.filter(refund =>
              refund.customer === user.id ||
              refund.customer?._id === user.id ||
              refund.customer?.$oid === user.id
            )
          : [];
        setRefunds(userRefunds);
      }
    } catch (err) {
      if (err.message !== 'SESSION_EXPIRED') {
        console.error('Error loading refunds:', err);
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handleCancelRefund = async (refundId) => {
    Alert.alert(
      'Cancelar devolución',
      '¿Estás seguro de que deseas cancelar esta solicitud de devolución?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetchWithAuth(`${API}/refunds/${refundId}`, {
                method: 'DELETE'
              });
              
              if (response.ok) {
                Alert.alert('Éxito', 'La solicitud de devolución ha sido cancelada');
                loadRefunds(); // Recargar la lista
              } else {
                Alert.alert('Error', 'No se pudo cancelar la solicitud');
              }
            } catch (error) {
              if (error.message !== 'SESSION_EXPIRED') {
                Alert.alert('Error', 'Error de conexión al cancelar la solicitud');
              }
            }
          }
        }
      ]
    );
  };

  const renderRefund = ({ item }) => (
    <View style={styles.refundItem}>
      <View style={styles.refundHeader}>
        <Text style={styles.refundCode}>#{item.refundCode}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.refundInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Fecha de solicitud:</Text>
          <Text style={styles.infoValue}>
            {item.requestDate ? new Date(item.requestDate).toLocaleDateString('es-ES') : 'N/A'}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Monto:</Text>
          <Text style={styles.amountText}>{formatPrice(item.amount)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Método:</Text>
          <Text style={styles.infoValue}>
            {item.refundMethod === 'efectivo contra entrega' ? 'Efectivo' : 'Transferencia'}
          </Text>
        </View>

        <View style={styles.reasonContainer}>
          <Text style={styles.infoLabel}>Razón:</Text>
          <Text style={styles.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      </View>

      <View style={styles.refundActions}>
        <TouchableOpacity
          style={styles.detailButton}
          onPress={() => navigation.navigate('RefundDetail', { refund: item })}
        >
          <Text style={styles.detailButtonText}>Ver detalles</Text>
        </TouchableOpacity>

        {item.status === 'pendiente' && (
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => handleCancelRefund(item._id)}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#3D1609" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Devoluciones</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contenido */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#A73249" />
        </View>
      ) : refunds.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="return-down-back-outline" size={80} color="#3D1609" />
          <Text style={styles.emptyTitle}>No tienes devoluciones</Text>
          <Text style={styles.emptyText}>
            Aquí aparecerán tus solicitudes de devolución
          </Text>
          <TouchableOpacity
            style={styles.shopButton}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Text style={styles.shopButtonText}>Ver mis pedidos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={refunds}
          renderItem={renderRefund}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Botón flotante para nueva devolución */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('NewRefund')}
      >
        <Ionicons name="add" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginTop: 20,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
  },
  shopButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  refundItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  refundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  refundCode: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#A73249',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
    color: '#FFFFFF',
  },
  refundInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontFamily: 'Nunito-SemiBold',
    fontSize: 13,
    color: '#666666',
  },
  infoValue: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#3D1609',
  },
  amountText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 14,
    color: '#A73249',
  },
  reasonContainer: {
    marginTop: 8,
  },
  reasonText: {
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    color: '#3D1609',
    marginTop: 4,
    lineHeight: 18,
  },
  refundActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailButton: {
    flex: 1,
    backgroundColor: '#F5EDE8',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A73249',
  },
  detailButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#A73249',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Nunito-Bold',
    fontSize: 13,
    color: '#FFFFFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A73249',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default RefundsScreen;
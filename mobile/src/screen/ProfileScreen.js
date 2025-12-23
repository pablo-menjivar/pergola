import { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Dimensions,
  Platform,
  StatusBar
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Avatar } from '@kolking/react-native-avatar';
import { useFonts } from 'expo-font';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout, API, fetchWithAuth } = useContext(AuthContext);
  const { wishlist, removeFromWishlist } = useContext(CartContext);
  const loadingWishlist = false; // Ya no necesitas este loading
  const [profileData, setProfileData] = useState(user || {});
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [loadingPic, setLoadingPic] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  // Estados del modal de edición
  const [modalVisible, setModalVisible] = useState(false);
  const [editingData, setEditingData] = useState({});
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  // Cargar datos del perfil del usuario actual
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
      loadOrders();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    setLoadingProfile(true);
    try {
      const response = await fetch(`${API}/customers/${user.id}`);
      if (response.ok) {
        const userData = await response.json();
        setProfileData(userData);
        setProfilePic(userData.profilePic || null);
      } else {
        console.error('Error al cargar el perfil:', response.status);
      }
    } catch (error) {
      if (error.message !== 'SESSION_EXPIRED') {
        console.error('Error al cargar el perfil:', error);
      }
    } finally {
      setLoadingProfile(false);
    }
  };
  const loadOrders = async () => {
    try {
      const response = await fetch(`${API}/public/orders`);
      if (response.ok) {
        const data = await response.json();
        // Filtrar solo los pedidos del usuario actual
        const userOrders = Array.isArray(data) ? data.filter(order => order.customer === user.id || order.customer?._id === user.id || order.customer?.$oid === user.id ) : [];
        setOrders(userOrders);
      }
    } catch (error) {
      if (error.message !== 'SESSION_EXPIRED') {
        console.error('Error loading orders:', error);
      }
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Funciones de formateo
  const formatPhoneNumber = (text) => {
    const prefix = "+503-";
    let numbers = text.replace(/\D/g, '');

    if (!text.startsWith(prefix)) {
      numbers = numbers.slice(3);
    }

    numbers = numbers.slice(0, 8);
    return prefix + numbers;
  };

  const formatDUI = (text) => {
    let numbers = text.replace(/\D/g, '');
    numbers = numbers.slice(0, 9);

    if (numbers.length > 8) {
      return numbers.slice(0, 8) + '-' + numbers.slice(8);
    }
    return numbers;
  };

  const formatBirthDate = (text) => {
    let numbers = text.replace(/\D/g, '');
    numbers = numbers.slice(0, 8);

    if (numbers.length >= 5) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2, 4) + '/' + numbers.slice(4);
    } else if (numbers.length >= 3) {
      return numbers.slice(0, 2) + '/' + numbers.slice(2);
    }
    return numbers;
  };

  // Función para abrir modal de edición
  const openEditModal = () => {
    setEditingData({
      name: profileData.name || '',
      lastName: profileData.lastName || '',
      phoneNumber: profileData.phoneNumber || '+503-',
      address: profileData.address || '',
      birthDate: profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('es-ES') : '',
      DUI: profileData.DUI || ''
    });
    setModalVisible(true);
  };

  // Función para actualizar perfil
  const updateProfile = async () => {
    setLoadingUpdate(true);
    try {
      // Validaciones básicas
      if (!editingData.name?.trim() || editingData.name.trim().length < 2) {
        Alert.alert('Error', 'El nombre debe tener al menos 2 caracteres');
        setLoadingUpdate(false);
        return;
      }

      if (editingData.name.trim().length > 100) {
        Alert.alert('Error', 'El nombre no puede exceder los 100 caracteres');
        setLoadingUpdate(false);
        return;
      }

      if (!editingData.lastName?.trim() || editingData.lastName.trim().length < 2) {
        Alert.alert('Error', 'Los apellidos deben tener al menos 2 caracteres');
        setLoadingUpdate(false);
        return;
      }

      if (editingData.lastName.trim().length > 100) {
        Alert.alert('Error', 'Los apellidos no pueden exceder los 100 caracteres');
        setLoadingUpdate(false);
        return;
      }

      // Validar teléfono con regex del backend: /^\+503[-\d]{8,12}$/
      if (!editingData.phoneNumber || !/^\+503[-\d]{8,12}$/.test(editingData.phoneNumber)) {
        Alert.alert('Error', 'El teléfono debe tener formato +503-XXXXXXXX (8 dígitos)');
        setLoadingUpdate(false);
        return;
      }

      // Validar dirección si tiene contenido
      if (editingData.address && editingData.address.trim() !== '') {
        if (editingData.address.trim().length < 5) {
          Alert.alert('Error', 'La dirección debe tener al menos 5 caracteres');
          setLoadingUpdate(false);
          return;
        }
        if (editingData.address.trim().length > 200) {
          Alert.alert('Error', 'La dirección no puede exceder los 200 caracteres');
          setLoadingUpdate(false);
          return;
        }
      }

      // Validar DUI si tiene contenido (regex del backend: /^\d{8}-\d$/)
      if (editingData.DUI && editingData.DUI.trim() !== '') {
        if (!/^\d{8}-\d$/.test(editingData.DUI)) {
          Alert.alert('Error', 'El DUI debe tener formato 12345678-9');
          setLoadingUpdate(false);
          return;
        }
      }

      // Validar fecha de nacimiento si tiene contenido
      if (editingData.birthDate && editingData.birthDate.trim() !== '') {
        const [day, month, year] = editingData.birthDate.split('/');
        if (!day || !month || !year || year.length !== 4) {
          Alert.alert('Error', 'La fecha debe tener formato DD/MM/AAAA');
          setLoadingUpdate(false);
          return;
        }
        const testDate = new Date(year, month - 1, day);
        if (isNaN(testDate.getTime()) || testDate >= new Date()) {
          Alert.alert('Error', 'La fecha de nacimiento no es válida o es futura');
          setLoadingUpdate(false);
          return;
        }
      }

      // Preparar datos para envío
      const updateData = {
        name: editingData.name.trim(),
        lastName: editingData.lastName.trim(),
        phoneNumber: editingData.phoneNumber,
        address: editingData.address?.trim() || '',
      };

      // Añadir fecha si existe y es válida
      if (editingData.birthDate && editingData.birthDate.trim()) {
        const [day, month, year] = editingData.birthDate.split('/');
        if (day && month && year) {
          updateData.birthDate = new Date(year, month - 1, day).toISOString();
        }
      }

      // Añadir DUI si existe
      if (editingData.DUI && editingData.DUI.trim()) {
        updateData.DUI = editingData.DUI;
      }

      const response = await fetchWithAuth(`${API}/customers/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setProfileData(updatedData.data);
        setModalVisible(false);
        Alert.alert('Éxito', 'Perfil actualizado correctamente');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo actualizar el perfil');
      }
    } catch (error) {
      if (error.message !== 'SESSION_EXPIRED') {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Error de conexión al actualizar el perfil');
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Cambiar foto de perfil
  const handleChangePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets[0].uri) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = uri.split('/').pop() || 'profile.jpg';
      const mimeType = asset.mimeType || 'image/jpeg';

      setLoadingPic(true);
      const formData = new FormData();

      formData.append('profilePic', {
        uri: uri,
        name: fileName,
        type: mimeType,
      });

      try {
        // Para FormData, no podemos usar fetchWithAuth directamente porque sobreescribe el Content-Type
        const response = await fetch(`${API}/customers/${user.id}`, {
          method: 'PUT',
          credentials: 'include',
          body: formData,
        });

        if (response.status === 401) {
          await logout();
          ToastAndroid.show("Tu sesión ha expirado. Por favor, inicia sesión nuevamente.", ToastAndroid.LONG);
          return;
        }

        const data = await response.json();
        if (response.ok && data.data?.profilePic) {
          setProfilePic(data.data.profilePic);
          setProfileData(prev => ({ ...prev, profilePic: data.data.profilePic }));
        } else {
          Alert.alert('Error', data.message || 'No se pudo actualizar la foto');
        }
      } catch (error) {
        console.error('Error updating photo:', error);
        Alert.alert('Error', 'No se pudo actualizar la foto');
      } finally {
        setLoadingPic(false);
      }
    }
  };

  // Borrar foto de perfil
  const handleDeletePhoto = async () => {
    Alert.alert('Eliminar foto', '¿Seguro que deseas borrar tu foto de perfil?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          setLoadingPic(true);
          try {
            const response = await fetchWithAuth(`${API}/customers/${user.id}/profile-pic`, {
              method: 'DELETE',
            });

            if (response.ok) {
              setProfilePic(null);
              setProfileData(prev => ({ ...prev, profilePic: null }));
            } else {
              Alert.alert('Error', 'No se pudo borrar la foto');
            }
          } catch (error) {
            if (error.message !== 'SESSION_EXPIRED') {
              console.error('Error deleting photo:', error);
              Alert.alert('Error', 'No se pudo borrar la foto');
            }
          } finally {
            setLoadingPic(false);
          }
        }
      },
    ]);
  };

  const handleRemoveFromWishlist = async (itemId, itemName) => {
    Alert.alert(
      'Eliminar de lista de deseos',
      `¿Deseas eliminar "${itemName}" de tu lista de deseos?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => removeFromWishlist(itemId)
        }
      ]
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderTitle}>Pedido #{item._id?.slice(-5) || 'N/A'}</Text>
      <Text style={styles.orderDate}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString('es-ES') : 'N/A'}
      </Text>
      <Text style={styles.orderStatus}>Estado: {item.status || 'Pendiente'}</Text>
    </View>
  );

  const renderWishlist = ({ item }) => (
    <View style={styles.wishlistItem}>
      <Text style={styles.wishlistTitle}>{item.name || 'Producto'}</Text>
      <Text style={styles.wishlistDesc} numberOfLines={2}>{item.description || ''}</Text>
      <TouchableOpacity
        onPress={() => handleRemoveFromWishlist(item._id, item.name)}
        style={styles.deleteWishBtn}
      >
        <MaterialCommunityIcons name="delete" size={18} color="#A73249" />
      </TouchableOpacity>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No hay usuario autenticado.</Text>
      </View>
    );
  }

  const fullName = `${profileData.name || ''} ${profileData.lastName || ''}`.trim();

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header con mejor espaciado */}
        <View style={styles.header}>
          <View style={styles.profilePicContainer}>
            {loadingPic ? (
              <View style={styles.avatarPlaceholder}>
                <ActivityIndicator size="large" color="#A73249" />
              </View>
            ) : (
              <>
                {profilePic ? (
                  <Image source={{ uri: profilePic }} style={styles.profilePic} />
                ) : (
                  <Avatar
                    size={90}
                    name={fullName}
                    colorize={true}
                    radius={45}
                    textStyle={{ fontSize: 32, fontFamily: 'Quicksand-Bold' }}
                    style={styles.avatarDefault}
                  />
                )}
              </>
            )}

            <TouchableOpacity style={styles.editPicBtn} onPress={handleChangePhoto}>
              <MaterialCommunityIcons name="camera" size={20} color="#fff" />
            </TouchableOpacity>

            {profilePic && (
              <TouchableOpacity style={styles.deletePicBtn} onPress={handleDeletePhoto}>
                <MaterialCommunityIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.name}>{fullName || 'Usuario'}</Text>
          <Text style={styles.email}>{profileData.email || user.email}</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.editBtn} onPress={openEditModal}>
              <Ionicons name="create-outline" size={16} color="#A73249" />
              <Text style={styles.editBtnText}>Editar perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
              <Ionicons name="log-out-outline" size={16} color="#fff" />
              <Text style={styles.logoutText}>Cerrar sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Información de perfil */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de perfil</Text>

          {loadingProfile ? (
            <ActivityIndicator color="#A73249" style={{ marginVertical: 20 }} />
          ) : (
            <>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Usuario:</Text>
                <Text style={styles.infoValue}>{profileData.username || user.username || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoValue}>{profileData.phoneNumber || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DUI:</Text>
                <Text style={styles.infoValue}>{profileData.DUI || '-'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Dirección:</Text>
                <Text style={styles.infoValue} numberOfLines={2}>
                  {profileData.address || '-'}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Fecha de nacimiento:</Text>
                <Text style={styles.infoValue}>
                  {profileData.birthDate ? new Date(profileData.birthDate).toLocaleDateString('es-ES') : '-'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Pedidos realizados */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pedidos realizados</Text>
          {loadingOrders ? (
            <ActivityIndicator color="#A73249" />
          ) : orders.length === 0 ? (
            <Text style={styles.emptyText}>No tienes pedidos realizados.</Text>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrder}
              keyExtractor={item => item._id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            />
          )}
        </View>

        {/* Lista de deseos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista de deseos</Text>
          {loadingWishlist ? (
            <ActivityIndicator color="#A73249" />
          ) : wishlist.length === 0 ? (
            <Text style={styles.emptyText}>No tienes productos en tu lista de deseos.</Text>
          ) : (
            <FlatList
              data={wishlist}
              renderItem={renderWishlist}
              keyExtractor={item => item._id || Math.random().toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.horizontalList}
            />
          )}
        </View>

        {/* Botones para ver lista de deseos e historial de pedidos */}
        <View style={{ alignItems: 'center', flex: 1 }}>
          <TouchableOpacity
            style={{
              backgroundColor: '#A73249',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 28,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
              elevation: 2,
            }}
            onPress={() => navigation.navigate('WishList')}
          >
            <MaterialCommunityIcons name="heart" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold', marginLeft: 10, fontSize: 15 }}>Ver mi lista de deseos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#A73249',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 28,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              elevation: 2,
            }}
            onPress={() => navigation.navigate('OrderHistory')}
          >
            <Ionicons name="receipt-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold', marginLeft: 10, fontSize: 15 }}>
              Ver mis pedidos
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#A73249',
              borderRadius: 10,
              paddingVertical: 12,
              paddingHorizontal: 28,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
              elevation: 2,
            }}
            onPress={() => navigation.navigate('Refunds')}
          >
            <Ionicons name="return-down-back-outline" size={20} color="#fff" />
            <Text style={{ color: '#fff', fontFamily: 'Quicksand-Bold', marginLeft: 10, fontSize: 15 }}>
              Mis devoluciones
            </Text>
          </TouchableOpacity>
        </View>
        
      </ScrollView>

      {/* Modal de edición */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar perfil</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#3D1609" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Nombres *</Text>
                <TextInput
                  style={styles.input}
                  value={editingData.name}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, name: text }))}
                  placeholder="Ingresa tus nombres"
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Apellidos *</Text>
                <TextInput
                  style={styles.input}
                  value={editingData.lastName}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, lastName: text }))}
                  placeholder="Ingresa tus apellidos"
                  maxLength={50}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Teléfono *</Text>
                <TextInput
                  style={styles.input}
                  value={editingData.phoneNumber}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, phoneNumber: formatPhoneNumber(text) }))}
                  placeholder="+503-XXXXXXXX"
                  keyboardType="numeric"
                  maxLength={13}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Fecha de nacimiento</Text>
                <TextInput
                  style={styles.input}
                  value={editingData.birthDate}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, birthDate: formatBirthDate(text) }))}
                  placeholder="DD/MM/AAAA"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>DUI</Text>
                <TextInput
                  style={styles.input}
                  value={editingData.DUI}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, DUI: formatDUI(text) }))}
                  placeholder="12345678-9"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dirección</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={editingData.address}
                  onChangeText={(text) => setEditingData(prev => ({ ...prev, address: text }))}
                  placeholder="Tu dirección completa"
                  multiline={true}
                  numberOfLines={3}
                  maxLength={200}
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveBtn, loadingUpdate && styles.saveBtn]}
                onPress={updateProfile}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveBtnText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3C6B8',
  },
  contentContainer: {
    paddingHorizontal: Math.max(16, screenWidth * 0.04),
    paddingTop: statusBarHeight + 20,
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    justifyContent: "center",
    alignItems: "center",
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E3C6B8',
  },
  errorText: {
    fontSize: 16,
    color: '#A73249',
    fontFamily: 'Nunito-Regular',
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    paddingVertical: 20,
  },
  profilePicContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profilePic: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  avatarDefault: {
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#e8e1d8',
  },
  editPicBtn: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#A73249',
    borderRadius: 15,
    padding: 6,
    zIndex: 2,
  },
  deletePicBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#A73249',
    borderRadius: 12,
    padding: 5,
    zIndex: 2,
  },
  name: {
    fontSize: Math.min(20, screenWidth * 0.05),
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    marginBottom: 4,
    textAlign: 'center',
  },
  email: {
    fontSize: Math.min(14, screenWidth * 0.035),
    color: '#3d1609',
    marginBottom: 15,
    fontFamily: 'Nunito-Regular',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#A73249',
  },
  editBtnText: {
    color: '#A73249',
    fontFamily: 'Quicksand-Bold',
    fontSize: 13,
    marginLeft: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A73249',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 13,
    marginLeft: 6,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: Math.max(16, screenWidth * 0.04),
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: Math.min(16, screenWidth * 0.04),
    color: '#A73249',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    minHeight: 20,
  },
  infoLabel: {
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    fontSize: 13,
    flex: 1,
  },
  infoValue: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 13,
    flex: 2,
    textAlign: 'right',
  },
  orderItem: {
    backgroundColor: '#e8e1d8',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 130,
    maxWidth: 150,
  },
  orderTitle: {
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    fontSize: 14,
    marginBottom: 4,
  },
  orderDate: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 12,
    marginBottom: 2,
  },
  orderStatus: {
    fontFamily: 'Quicksand-Bold',
    color: '#3d1609',
    fontSize: 12,
  },
  wishlistItem: {
    backgroundColor: '#e8e1d8',
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    minWidth: 130,
    maxWidth: 150,
    position: 'relative',
  },
  wishlistTitle: {
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
    fontSize: 14,
    marginBottom: 4,
  },
  wishlistDesc: {
    fontFamily: 'Nunito-Regular',
    color: '#3d1609',
    fontSize: 12,
    marginBottom: 8,
  },
  deleteWishBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  horizontalList: {
    marginTop: 8,
  },
  emptyText: {
    color: '#A73249',
    fontFamily: 'Nunito-Regular',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
  },

  // Estilos del modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#F5EDE8',
    borderRadius: 20,
    width: '100%',
    maxHeight: screenHeight * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D5C9',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  modalBody: {
    padding: 20,
    maxHeight: screenHeight * 0.5,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#E8D5C9',
    color: '#3D1609',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8D5C9',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#E8D5C9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#3D1609',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
  saveBtn: {
    flex: 1,
    backgroundColor: '#A73249',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontFamily: 'Quicksand-Bold',
    fontSize: 14,
  },
});
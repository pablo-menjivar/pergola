import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Modal,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { useFonts } from 'expo-font';

const ReviewsSection = ({ productId }) => {
  const { user, API } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [expandedReview, setExpandedReview] = useState(null);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../../assets/fonts/Quicksand-Medium.ttf'),
    'Nunito-Bold': require('../../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/public/reviews`);
      if (response.ok) {
        const allReviews = await response.json();
        // Filtrar reseñas para este producto específico
        const productReviews = allReviews.filter(review => 
          (review.product && review.product._id === productId) || review.product === productId
        );
        setReviews(productReviews);
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitReview = async () => {
    if (!user) {
      Alert.alert('Inicia sesión', 'Debes iniciar sesión para escribir una reseña');
      return;
    }

    if (!newReview.comment.trim() || newReview.comment.trim().length < 10) {
      Alert.alert('Error', 'El comentario debe tener al menos 10 caracteres');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: productId,
          customer: user.id,
          rating: newReview.rating,
          comment: newReview.comment.trim()
        }),
      });

      if (response.ok) {
        Alert.alert('Éxito', 'Tu reseña ha sido enviada correctamente');
        setShowReviewModal(false);
        setNewReview({ rating: 5, comment: '' });
        loadReviews(); // Recargar reseñas
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'No se pudo enviar la reseña');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Error de conexión al enviar la reseña');
    } finally {
      setSubmitting(false);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating]++;
    });
    return distribution;
  };

  const renderStars = (rating, size = 16, onPress = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => onPress && onPress(i)}
          disabled={!onPress}
          activeOpacity={onPress ? 0.7 : 1}
        >
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={size}
            color={i <= rating ? "#FFD700" : "#E0E0E0"}
            style={{ marginRight: 2 }}
          />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starsContainer}>{stars}</View>;
  };

  const renderRatingSummary = () => {
    const averageRating = calculateAverageRating();
    const distribution = getRatingDistribution();
    const totalReviews = reviews.length;

    return (
      <View style={styles.ratingSummary}>
        {/* Header con rating promedio */}
        <View style={styles.ratingHeader}>
          <View style={styles.averageRatingBox}>
            <Text style={styles.averageRatingNumber}>{averageRating}</Text>
            <View style={styles.averageStars}>
              {renderStars(Math.round(parseFloat(averageRating)), 20)}
            </View>
            <Text style={styles.totalReviewsText}>
              {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
            </Text>
          </View>
          
          <TouchableOpacity
            style={styles.writeReviewButton}
            onPress={() => setShowReviewModal(true)}
          >
            <Ionicons name="create-outline" size={20} color="#FFFFFF" />
            <Text style={styles.writeReviewButtonText}>Escribir reseña</Text>
          </TouchableOpacity>
        </View>

        {/* Distribución de ratings mejorada */}
        <View style={styles.ratingDistribution}>
          <Text style={styles.distributionTitle}>Distribución de calificaciones</Text>
          <View style={styles.distributionBars}>
            {[5, 4, 3, 2, 1].map(rating => {
              const percentage = totalReviews > 0 ? (distribution[rating] / totalReviews) * 100 : 0;
              return (
                <View key={rating} style={styles.distributionRow}>
                  <View style={styles.ratingLabel}>
                    <Text style={styles.ratingNumber}>{rating}</Text>
                    <Ionicons name="star" size={14} color="#FFD700" />
                  </View>
                  
                  <View style={styles.barContainer}>
                    <View 
                      style={[
                        styles.ratingBar,
                        { width: `${Math.max(8, percentage)}%` } // Mínimo 8% para que sea visible
                      ]} 
                    />
                  </View>
                  
                  <Text style={styles.ratingCount}>
                    {distribution[rating]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReview(expandedReview === reviewId ? null : reviewId);
  };

  const renderReviewItem = (review, index) => {
    const isExpanded = expandedReview === (review._id || index);
    const comment = review.comment || '';
    const needsTruncation = comment.length > 150;

    return (
      <View key={review._id || index} style={styles.reviewCard}>
        <View style={styles.reviewHeader}>
          <View style={styles.reviewerInfo}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {review.customer?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.reviewerDetails}>
              <Text style={styles.reviewerName}>
                {review.customer?.username || 'Usuario anónimo'}
              </Text>
              <Text style={styles.reviewDate}>
                {new Date(review.createdAt).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.ratingBadge}>
            {renderStars(review.rating, 14)}
          </View>
        </View>
        
        <View style={styles.reviewContent}>
          <Text 
            style={styles.reviewComment}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {comment}
          </Text>
          
          {needsTruncation && (
            <TouchableOpacity 
              style={styles.readMoreButton}
              onPress={() => toggleReviewExpansion(review._id || index)}
            >
              <Text style={styles.readMoreText}>
                {isExpanded ? 'Leer menos' : 'Leer más'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {review.response && (
          <View style={styles.responseContainer}>
            <View style={styles.responseHeader}>
              <Ionicons name="business" size={16} color="#A73249" />
              <Text style={styles.responseLabel}>Respuesta del vendedor</Text>
            </View>
            <Text style={styles.responseText}>{review.response}</Text>
          </View>
        )}
      </View>
    );
  };

  const renderReviewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showReviewModal}
      onRequestClose={() => setShowReviewModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Escribe tu reseña</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Ionicons name="close" size={24} color="#3D1609" />
            </TouchableOpacity>
          </View>

          {/* SCROLLVIEW MEJORADO - CON FLEX Y SIN ALTURA FIJA */}
          <ScrollView 
            style={styles.modalBody}
            contentContainerStyle={styles.modalBodyContent}
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>¿Cómo calificarías este producto?</Text>
              <View style={styles.starRating}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setNewReview(prev => ({ ...prev, rating: star }))}
                    style={styles.starButton}
                  >
                    <Ionicons
                      name={star <= newReview.rating ? "star" : "star-outline"}
                      size={36}
                      color={star <= newReview.rating ? "#FFD700" : "#E0E0E0"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.ratingHint}>
                {newReview.rating === 5 ? 'Excelente' :
                newReview.rating === 4 ? 'Muy bueno' :
                newReview.rating === 3 ? 'Bueno' :
                newReview.rating === 2 ? 'Regular' : 'Malo'}
              </Text>
            </View>

            <View style={styles.commentSection}>
              <Text style={styles.commentLabel}>Tu reseña</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Comparte tu experiencia con este producto..."
                placeholderTextColor="#A73249AA"
                value={newReview.comment}
                onChangeText={(text) => setNewReview(prev => ({ ...prev, comment: text }))}
                multiline={true}
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <View style={styles.characterCounter}>
                <Text style={styles.characterCount}>
                  {newReview.comment.length}/500 caracteres
                </Text>
                {newReview.comment.length < 10 && (
                  <Text style={styles.minimumWarning}>
                    Mínimo 10 caracteres
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.tipsSection}>
              <Text style={styles.tipsTitle}>Consejos para una buena reseña:</Text>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Describe la calidad del producto</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Menciona si cumple con lo esperado</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Sé específico y honesto</Text>
              </View>
              {/* CONSEJO ADICIONAL PARA MEJORAR EL SCROLL */}
              <View style={styles.tipItem}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Incluye detalles sobre el uso del producto</Text>
              </View>
            </View>

            {/* ESPACIO EXTRA AL FINAL PARA MEJORAR SCROLL */}
            <View style={styles.modalSpacer} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowReviewModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                (newReview.comment.length < 10 || submitting) && styles.submitButtonDisabled
              ]}
              onPress={submitReview}
              disabled={newReview.comment.length < 10 || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="send" size={18} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Publicar reseña</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderRatingSummary()}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A73249" />
          <Text style={styles.loadingText}>Cargando reseñas...</Text>
        </View>
      ) : reviews.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubble-ellipses-outline" size={64} color="#E0E0E0" />
          <Text style={styles.emptyStateTitle}>Aún no hay reseñas</Text>
          <Text style={styles.emptyStateSubtitle}>
            Sé el primero en compartir tu experiencia con este producto
          </Text>
          <TouchableOpacity
            style={styles.emptyStateButton}
            onPress={() => setShowReviewModal(true)}
          >
            <Text style={styles.emptyStateButtonText}>Escribir primera reseña</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.reviewsList}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.reviewsTitle}>Reseñas de clientes</Text>
          {reviews.map((review, index) => renderReviewItem(review, index))}
        </ScrollView>
      )}

      {renderReviewModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    marginTop: 12,
  },

  // RATING SUMMARY MEJORADO - DISEÑO MÁS ATRACTIVO
  ratingSummary: {
    backgroundColor: '#F8F8F8',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
  },
  ratingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  averageRatingBox: {
    alignItems: 'center',
    flex: 1,
  },
  averageRatingNumber: {
    fontSize: 52,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 4,
  },
  averageStars: {
    marginBottom: 8,
  },
  totalReviewsText: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
  },
  writeReviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
    minWidth: 160,
  },
  writeReviewButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },

  // DISTRIBUCIÓN DE RATINGS MEJORADA
  ratingDistribution: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  distributionTitle: {
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
    textAlign: 'center',
  },
  distributionBars: {
    gap: 12,
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
    gap: 4,
  },
  ratingNumber: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
  },
  barContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFD700',
    borderRadius: 4,
    minWidth: 8, // Asegura que siempre sea visible
  },
  ratingCount: {
    fontSize: 14,
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    width: 20,
    textAlign: 'right',
  },

  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // REVIEWS LIST
  reviewsList: {
    flex: 1,
    padding: 20,
  },
  reviewsTitle: {
    fontSize: 18,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 16,
  },

  // REVIEW CARDS (mantenido igual)
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A73249',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  reviewerDetails: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
  },
  ratingBadge: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reviewContent: {
    marginBottom: 12,
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 20,
  },
  readMoreButton: {
    marginTop: 8,
  },
  readMoreText: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#A73249',
  },
  responseContainer: {
    backgroundColor: '#F5EDE8',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#A73249',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  responseLabel: {
    fontSize: 12,
    fontFamily: 'Quicksand-Bold',
    color: '#A73249',
  },
  responseText: {
    fontSize: 13,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    lineHeight: 18,
  },
  // ESTADOS VACÍOS
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#999999',
    marginTop: 16,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#CCCCCC',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateButton: {
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Quicksand-Bold',
  },

  // MODAL (mantenido igual)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxHeight: '85%', // Aumentado ligeramente para mejor visualización
    minHeight: '60%', // Mínimo para que no se vea muy pequeño
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E1D8',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Quicksand-Bold',
    color: '#3D1609',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1, // IMPORTANTE: Usar flex en lugar de altura fija
  },
  modalBodyContent: {
    padding: 24,
    paddingBottom: 10, // Reducido para dar más espacio
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 16,
    textAlign: 'center',
  },
  starRating: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  starButton: {
    padding: 4,
  },
  ratingHint: {
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    color: '#666666',
    fontStyle: 'italic',
  },
  commentSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  commentLabel: {
    fontSize: 16,
    fontFamily: 'Nunito-SemiBold',
    color: '#3D1609',
    marginBottom: 12,
  },
  commentInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito-Regular',
    borderWidth: 1,
    borderColor: '#E8E1D8',
    color: '#3D1609',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#999999',
  },
  minimumWarning: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#FF6B6B',
  },
  tipsSection: {
    backgroundColor: '#F0F8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10, // Espacio antes del spacer
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito-SemiBold',
    color: '#2E7D32',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Cambiado a flex-start para mejor alineación
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    fontSize: 12,
    fontFamily: 'Nunito-Regular',
    color: '#2E7D32',
    flex: 1,
    lineHeight: 16,
  },
  // ESPACIO EXTRA PARA MEJORAR SCROLL
  modalSpacer: {
    height: 20, // Espacio extra al final para mejor scroll
  },
  // FOOTER DEL MODAL MEJORADO
  modalFooter: {
    flexDirection: 'row',
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E8E1D8',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A73249',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Quicksand-Bold',
  }
});

export default ReviewsSection;
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Minus, Plus, Star, X, RefreshCw, Trash2, Send } from 'lucide-react';

// --- ESTILOS Y DATOS SIMULADOS ---

const COLORS = {
  primary: '#A73249', // Rojo vino
  dark: '#3D1609',   // Café oscuro
  background: '#E3C6B8', // Fondo Arena/Rosa pálido
  lightGray: '#E8E1D8', // Gris muy claro
  price: '#4CAF50', // Verde para el precio
};

const FONT_CLASSES = {
    serif: 'font-serif', // Para un toque elegante, similar al diseño
    sans: 'font-sans'
}

// Datos simulados (solo se usan como estructura inicial, serán reemplazados por el fetch)
const mockReviews = []; 

// --- CONSTANTE DE API (AJUSTAR SEGÚN TU ENTORNO) ---
const API_BASE_URL = 'http://localhost:3000/api'; 


// --- COMPONENTES AUXILIARES ---

// Componente: RatingStars (Muestra la calificación estática)
const RatingStars = ({ rating, size = 16 }) => {
  const normalizedRating = Math.max(0, Math.min(5, rating)); 
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center space-x-0.5">
      {Array(fullStars).fill(0).map((_, i) => (
        <Star key={`full-${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <div className="relative">
            <Star size={size} className="text-gray-300 fill-gray-300" />
            <Star size={size} className="text-yellow-400 fill-yellow-400 absolute top-0 left-0" style={{ clipPath: 'polygon(0% 0%, 50% 0%, 50% 100%, 0% 100%)' }} />
        </div>
      )}
      {Array(emptyStars).fill(0).map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
};


// Componente: ReviewCard
const ReviewCard = ({ review, IS_ADMIN, onRespond, onDelete }) => {
    const authorName = review.customer?.username || review.customer?.email || 'Usuario Anónimo';
    const location = review.customer?.location || 'Ubicación Desconocida';
    const date = new Date(review.createdAt).toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });

    return (
        <div className="py-4 border-b last:border-b-0" style={{ borderColor: COLORS.lightGray }}>
            <div className="flex items-start mb-2">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center bg-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                </div>
                
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>{authorName}</span>
                        <RatingStars rating={review.rating} />
                    </div>
                    <p className={`text-xs mt-1 leading-relaxed ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.8 }}>{review.comment}</p>
                    <p className={`text-xs mt-1 ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.5 }}>{date}, {location}</p>
                </div>
            </div>

            {/* Respuesta del Administrador (si existe) */}
            {review.response && (
                <div className="mt-3 ml-12 p-3 rounded-lg border-l-4" style={{ borderColor: COLORS.primary, backgroundColor: COLORS.lightGray }}>
                    <p className={`text-xs font-bold`} style={{ color: COLORS.dark }}>Respuesta de la Tienda:</p>
                    <p className={`text-xs mt-1 leading-relaxed ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.9 }}>
                        {review.response}
                    </p>
                </div>
            )}
            
            {/* Acciones de Administrador */}
            {IS_ADMIN && (
                <div className="flex justify-end space-x-2 mt-2">
                    {/* Botón Responder (si no hay respuesta o si se permite editar) */}
                    <button 
                        onClick={() => onRespond(review)}
                        className="text-xs font-semibold text-white px-3 py-1 rounded transition duration-150 flex items-center hover:opacity-90"
                        style={{ backgroundColor: COLORS.primary }}
                    >
                        <Send size={14} className="mr-1" />
                        {review.response ? 'Editar Respuesta' : 'Responder'}
                    </button>
                    {/* Botón Eliminar */}
                    <button 
                        onClick={() => onDelete(review)}
                        className="text-xs font-semibold text-red-600 px-3 py-1 rounded border border-red-600 transition duration-150 flex items-center hover:bg-red-50"
                    >
                        <Trash2 size={14} className="mr-1" />
                        Eliminar
                    </button>
                </div>
            )}
        </div>
    );
};


// Componente: InteractiveRatingStars (Permite seleccionar la calificación en el formulario)
const InteractiveRatingStars = ({ rating, setRating }) => {
    return (
        <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((starValue) => (
                <Star
                    key={starValue}
                    size={32}
                    className={`cursor-pointer transition-colors duration-150 ${
                        starValue <= rating 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 hover:text-yellow-400 hover:fill-yellow-400'
                    }`}
                    onClick={() => setRating(starValue)}
                />
            ))}
        </div>
    );
};

// Componente: ReviewForm (Para enviar reseñas de cliente - POST)
const ReviewForm = ({ productId, customerId, onClose, onReviewSubmitted }) => {
    const MIN_COMMENT_LENGTH = 10;
    const MAX_COMMENT_LENGTH = 500;
    // ... (El resto del código de ReviewForm se mantiene igual)

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const trimmedComment = comment.trim();

        if (rating === 0) {
            setMessage('Por favor, selecciona una calificación.');
            return;
        }

        if (trimmedComment.length < MIN_COMMENT_LENGTH) {
            setMessage(`El comentario debe tener al menos ${MIN_COMMENT_LENGTH} caracteres.`);
            return;
        }

        setIsLoading(true);
        setMessage('');

        const reviewData = {
            product: productId,
            customer: customerId,
            rating: rating,
            comment: trimmedComment,
        };
        
        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });

            const result = await response.json();

            if (response.ok) {
                setMessage(result.message || "Reseña creada con éxito.");
                onReviewSubmitted(result.data); 
                setTimeout(onClose, 2000);

            } else {
                const errorMsg = result.message || "Ocurrió un error desconocido al guardar la reseña.";
                setMessage(`Error: ${errorMsg}`);
                console.error("Error del servidor al publicar reseña:", result);
            }

        } catch (error) {
            setMessage('Error de conexión. Asegúrate de que el servidor esté funcionando.');
            console.error("Error de red:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
                className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md ${FONT_CLASSES.sans}`}
                style={{ backgroundColor: COLORS.lightGray }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-bold`} style={{ color: COLORS.dark }}>Escribir Reseña</h2>
                    <button onClick={onClose} aria-label="Cerrar formulario" className="p-1 rounded-full hover:bg-gray-200">
                        <X size={24} style={{ color: COLORS.dark }} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6 text-center">
                        <p className={`mb-3 font-semibold`} style={{ color: COLORS.dark }}>Tu calificación:</p>
                        <InteractiveRatingStars rating={rating} setRating={setRating} />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="comment" className={`block mb-2 text-sm font-semibold`} style={{ color: COLORS.dark }}>
                            Tu comentario:
                        </label>
                        <textarea
                            id="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-2 transition duration-150 resize-none"
                            style={{ borderColor: COLORS.lightGray, outlineColor: COLORS.primary }}
                            placeholder={`Mínimo ${MIN_COMMENT_LENGTH} caracteres. Máximo ${MAX_COMMENT_LENGTH}.`}
                            maxLength={MAX_COMMENT_LENGTH}
                            disabled={isLoading}
                        ></textarea>
                         <p className={`text-xs text-right mt-1`} style={{ color: COLORS.dark, opacity: 0.6 }}>
                            {comment.length}/{MAX_COMMENT_LENGTH}
                        </p>
                    </div>

                    {message && (
                        <p className={`text-center text-sm mb-4 font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl text-lg font-bold text-white transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                        style={{ backgroundColor: COLORS.primary }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                            </div>
                        ) : 'Enviar Reseña'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Componente: ReviewResponseForm (Para responder reseñas de administrador - PUT)
const ReviewResponseForm = ({ review, onClose, onResponseSubmitted }) => {
    const MAX_RESPONSE_LENGTH = 500;
    const [response, setResponse] = useState(review.response || '');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedResponse = response.trim();

        if (trimmedResponse.length === 0) {
            setMessage('La respuesta no puede estar vacía.');
            return;
        }

        setIsLoading(true);
        setMessage('');

        const responseData = { response: trimmedResponse };
        
        try {
            const fetchUrl = `${API_BASE_URL}/reviews/${review._id}`; // PUT /reviews/:id
            
            const apiResponse = await fetch(fetchUrl, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(responseData)
            });

            const result = await apiResponse.json();

            if (apiResponse.ok) {
                setMessage(result.message || "Respuesta guardada con éxito.");
                // Pasamos la reseña actualizada (incluyendo el nuevo campo 'response')
                onResponseSubmitted(result.data); 
                setTimeout(onClose, 2000);

            } else {
                const errorMsg = result.message || "Ocurrió un error desconocido al guardar la respuesta.";
                setMessage(`Error: ${errorMsg}`);
                console.error("Error del servidor al responder reseña:", result);
            }

        } catch (error) {
            setMessage('Error de conexión. Asegúrate de que el servidor esté funcionando.');
            console.error("Error de red:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
                className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md ${FONT_CLASSES.sans}`}
                style={{ backgroundColor: COLORS.lightGray }}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-xl font-bold`} style={{ color: COLORS.dark }}>Responder a {review.customer?.username || 'Reseña'}</h2>
                    <button onClick={onClose} aria-label="Cerrar formulario" className="p-1 rounded-full hover:bg-gray-200">
                        <X size={24} style={{ color: COLORS.dark }} />
                    </button>
                </div>
                
                <p className={`text-sm mb-4 italic p-2 rounded-lg`} style={{ backgroundColor: COLORS.lightGray, color: COLORS.dark }}>
                    "**{review.comment.substring(0, 50)}...**"
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="response" className={`block mb-2 text-sm font-semibold`} style={{ color: COLORS.dark }}>
                            Respuesta de la Tienda:
                        </label>
                        <textarea
                            id="response"
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            rows="4"
                            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-offset-2 transition duration-150 resize-none"
                            style={{ borderColor: COLORS.primary, outlineColor: COLORS.primary }}
                            placeholder={`Máximo ${MAX_RESPONSE_LENGTH} caracteres.`}
                            maxLength={MAX_RESPONSE_LENGTH}
                            disabled={isLoading}
                        ></textarea>
                         <p className={`text-xs text-right mt-1`} style={{ color: COLORS.dark, opacity: 0.6 }}>
                            {response.length}/{MAX_RESPONSE_LENGTH}
                        </p>
                    </div>

                    {message && (
                        <p className={`text-center text-sm mb-4 font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 rounded-xl text-lg font-bold text-white transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                        style={{ backgroundColor: COLORS.primary }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </div>
                        ) : 'Guardar Respuesta'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Componente: ConfirmationModal (Para eliminar reseñas de administrador - DELETE)
const ConfirmationModal = ({ review, onClose, onConfirmDelete }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleDelete = async () => {
        setIsLoading(true);
        setMessage('');

        try {
            const fetchUrl = `${API_BASE_URL}/reviews/${review._id}`; // DELETE /reviews/:id
            
            const response = await fetch(fetchUrl, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setMessage("Reseña eliminada con éxito.");
                onConfirmDelete(review._id); // Llama a la función para actualizar el estado local
                setTimeout(onClose, 1500);

            } else {
                const result = await response.json();
                const errorMsg = result.message || "Ocurrió un error al eliminar la reseña.";
                setMessage(`Error: ${errorMsg}`);
                console.error("Error del servidor al eliminar reseña:", result);
            }
        } catch (error) {
            setMessage('Error de conexión. Asegúrate de que el servidor esté funcionando.');
            console.error("Error de red:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div 
                className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm ${FONT_CLASSES.sans}`}
                style={{ backgroundColor: COLORS.lightGray }}
            >
                <h3 className={`text-xl font-bold mb-4`} style={{ color: COLORS.dark }}>Confirmar Eliminación</h3>
                <p className="mb-6 text-sm" style={{ color: COLORS.dark }}>
                    ¿Estás seguro de que deseas eliminar la reseña de **{review.customer?.username || 'Usuario Anónimo'}**?
                </p>
                <p className={`text-sm italic mb-6 p-2 rounded-lg border-l-2`} style={{ borderColor: COLORS.primary, backgroundColor: COLORS.lightGray }}>
                    "**{review.comment.substring(0, 50)}...**"
                </p>

                {message && (
                    <p className={`text-center text-sm mb-4 font-medium ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                        {message}
                    </p>
                )}

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border transition duration-150 hover:bg-gray-200"
                        style={{ borderColor: COLORS.dark, color: COLORS.dark }}
                        disabled={isLoading}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`px-4 py-2 rounded-xl text-sm font-bold text-white transition duration-200 flex items-center ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'}`}
                        style={{ backgroundColor: 'red' }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Confirmar Eliminación'}
                    </button>
                </div>
            </div>
        </div>
    );
};


// Componente: ReviewsList
const ReviewsList = ({ reviews, onOpenForm, isLoading, error, IS_ADMIN, onRespond, onDelete }) => {
    
    let content;

    if (isLoading) {
        content = (
            <div className="flex items-center justify-center py-8 text-gray-500">
                <RefreshCw size={24} className="animate-spin mr-3" />
                Cargando reseñas...
            </div>
        );
    } else if (error) {
        content = (
            <div className="py-8 text-red-600 text-center border rounded-lg p-4 bg-red-50" style={{ borderColor: COLORS.primary }}>
                <p className="font-semibold mb-2">Error al cargar las reseñas</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    } else if (reviews.length === 0) {
        content = (
            <div className="py-8 text-center text-gray-500 border rounded-lg p-4 mt-4" style={{ borderColor: COLORS.lightGray }}>
                <p className="font-semibold">¡Sé el primero en opinar!</p>
                <p className="text-sm mt-1">Aún no hay reseñas para este producto.</p>
            </div>
        );
    } else {
        const totalRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0);
        const reviewCount = reviews.length;
        const averageRating = reviewCount > 0 ? totalRating / reviewCount : 0;
        const displayRating = averageRating.toFixed(1);

        content = (
            <>
                <div className="flex items-baseline mt-2">
                    <p className={`text-4xl font-bold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>{displayRating} Estrellas</p>
                </div>
                <p className={`text-sm ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.7}}>{reviewCount} Opiniones</p>

                <div className="mt-4 space-y-2">
                    {reviews.map((review, index) => (
                        <ReviewCard 
                            key={review._id || review.id || index} 
                            review={review}
                            IS_ADMIN={IS_ADMIN}
                            onRespond={onRespond}
                            onDelete={onDelete}
                        /> 
                    ))}
                </div>
            </>
        );
    }

    return (
        <section className="mt-8 px-5">
            <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold ${FONT_CLASSES.serif}`} style={{ color: COLORS.dark }}>Reseñas</h2>
                <button
                    onClick={onOpenForm}
                    className="text-sm font-semibold py-1 px-3 rounded-full border transition duration-150 hover:opacity-80"
                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                    disabled={isLoading}
                >
                    Escribir reseña
                </button>
            </div>
            
            {content}
        </section>
    );
};


// --- COMPONENTE PRINCIPAL ---

const ProductReviewScreen = () => {
    // Simulamos que el usuario actual es un administrador
    const IS_ADMIN = true; 

    const [quantity, setQuantity] = useState(1);
    const [isClientFormOpen, setIsClientFormOpen] = useState(false);
    
    // Estados para la administración de reseñas
    const [selectedReview, setSelectedReview] = useState(null);
    const [isResponseFormOpen, setIsResponseFormOpen] = useState(false);
    const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] = useState(false);

    const [reviews, setReviews] = useState(mockReviews);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // --- Valores simulados necesarios para el envío ---
    const PRODUCT_ID = "65c34e022b7c430e719541a7"; 
    const CUSTOMER_ID = "65c34e022b7c430e719541a8"; 

    const productPrice = 17.25;
    const totalPrice = (productPrice * quantity).toFixed(2);

    // FUNCIÓN PARA CARGAR RESEÑAS
    const fetchReviews = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/public`); 
            
            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `Error ${response.status}: Fallo al obtener reseñas`);
            }

            const data = await response.json();
            setReviews(data); 

        } catch (err) {
            console.error("Error al cargar reseñas:", err.message);
            setError(`No se pudieron cargar las reseñas: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchReviews();
    }, []); 

    // --- MANEJO DE ACCIONES DEL CLIENTE ---

    const handleQuantityChange = (delta) => {
        setQuantity(prev => Math.max(1, prev + delta));
    };

    const handleAddToCart = () => {
        console.log(`¡Añadido! ${quantity} unidad(es) de "Pulsera color aqua-celula - Cristal Bohemio" por $${totalPrice} USD.`);
    };

    const handleReviewSubmitted = (newReviewData) => {
        const tempNewReview = {
            ...newReviewData,
            _id: newReviewData._id || Date.now(),
            customer: { username: 'Tú (Usuario Actual)', email: 'N/A' }, 
            createdAt: new Date().toISOString(),
        };
        setReviews(prevReviews => [tempNewReview, ...prevReviews]); 
    };

    // --- MANEJO DE ACCIONES DEL ADMINISTRADOR ---

    // 1. Responder (abrir formulario)
    const handleOpenResponseForm = (review) => {
        setSelectedReview(review);
        setIsResponseFormOpen(true);
    };

    // 2. Eliminar (abrir confirmación)
    const handleOpenDeleteConfirmation = (review) => {
        setSelectedReview(review);
        setIsDeleteConfirmationOpen(true);
    };

    // 3. Respuesta enviada (actualizar estado)
    const handleResponseSubmitted = (updatedReview) => {
        setReviews(prevReviews => prevReviews.map(r => 
            r._id === updatedReview._id ? updatedReview : r
        ));
        setSelectedReview(null);
    };
    
    // 4. Reseña eliminada (actualizar estado)
    const handleReviewDeleted = (deletedReviewId) => {
        setReviews(prevReviews => prevReviews.filter(r => 
            r._id !== deletedReviewId
        ));
        setSelectedReview(null);
    };


    return (
        <div className="flex items-center justify-center min-h-screen p-0 antialiased" style={{ backgroundColor: COLORS.background }}>
            
            <div className="relative w-full h-screen max-w-xl bg-white shadow-2xl rounded-none sm:rounded-2xl sm:h-[95vh] overflow-hidden flex flex-col">
                
                {/* Header (Botones de navegación/favorito) */}
                <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 pt-8">
                    <button 
                        className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm rounded-full shadow-md"
                        onClick={() => console.log('Atrás')}
                        aria-label="Atrás"
                    >
                        <ChevronLeft size={24} className="text-white" />
                    </button>
                    <button 
                        className="w-10 h-10 flex items-center justify-center bg-black bg-opacity-10 backdrop-blur-sm rounded-full shadow-md"
                        onClick={() => console.log('Favorito')}
                        aria-label="Favorito"
                    >
                        <Heart size={24} className="text-white" />
                    </button>
                </header>

                {/* Contenido principal con scroll */}
                <div className="flex-1 overflow-y-auto">
                    
                    {/* Sección de Imágenes (se mantiene) */}
                    <div className="relative h-[40vh] min-h-[300px] overflow-hidden">
                        <div className="absolute inset-0" style={{ backgroundColor: COLORS.background }}></div>

                        <div className="flex h-full w-full justify-center p-4 pt-16 space-x-2">
                            <img 
                                src="https://placehold.co/180x200/B87333/ffffff?text=Pulsera+1" 
                                alt="Pulsera color aqua-celula - Vista frontal"
                                className="object-cover rounded-xl shadow-lg w-1/2 h-full"
                            />
                            <img 
                                src="https://placehold.co/180x200/A73249/ffffff?text=Pulsera+2" 
                                alt="Pulsera color aqua-celula - Detalle"
                                className="object-cover rounded-xl shadow-lg w-1/2 h-full"
                            />
                        </div>
                    </div>
                    
                    {/* Detalles del Producto (se mantiene) */}
                    <div className="p-5 pt-0">
                        <h1 className={`text-2xl font-bold mt-4 ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>Pulsera color aqua-celula - Cristal Bohemio</h1>
                        <p className={`text-xl font-bold ${FONT_CLASSES.sans}`} style={{ color: COLORS.primary }}>${productPrice.toFixed(2)}</p>

                        <div className="flex items-center justify-between mt-4">
                            <span className={`text-base font-semibold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>Cantidad</span>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={() => handleQuantityChange(-1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full border"
                                    style={{ borderColor: COLORS.primary, color: COLORS.primary }}
                                    aria-label="Disminuir cantidad"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className={`text-lg font-bold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(1)}
                                    className="w-8 h-8 flex items-center justify-center rounded-full"
                                    style={{ backgroundColor: COLORS.primary, color: 'white' }}
                                    aria-label="Aumentar cantidad"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="mt-6">
                            <p className={`text-base leading-relaxed ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.9 }}>
                                Esta pulsera presenta una selección de cuentas de cristal de Bohemia de alta calidad en un encantador color aqua-celeste. Su diseño versátil la convierte en el complemento ideal para cualquier ocasión.
                            </p>
                        </div>
                        
                        <div className="mt-6">
                            <h3 className={`text-lg font-bold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>Envío y devoluciones</h3>
                            <p className={`text-sm mt-1 ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.8 }}>
                                Envío estándar gratuito y devoluciones gratuitas durante 60 días.
                            </p>
                        </div>
                    </div>

                    {/* Reseñas (Lista, Carga y Error) */}
                    <ReviewsList 
                        reviews={reviews} 
                        onOpenForm={() => setIsClientFormOpen(true)}
                        isLoading={isLoading}
                        error={error}
                        IS_ADMIN={IS_ADMIN}
                        onRespond={handleOpenResponseForm}
                        onDelete={handleOpenDeleteConfirmation}
                    />

                    {/* Espacio para el footer fijo */}
                    <div className="h-24 sm:h-20"></div> 
                </div>

                {/* Footer fijo (Total y Botón) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t shadow-2xl" style={{ backgroundColor: 'white', borderColor: COLORS.lightGray }}>
                    <div className="flex items-center justify-between w-full">
                        <div className="flex flex-col items-start">
                            <span className={`text-sm ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark, opacity: 0.7 }}>Total</span>
                            <span className={`text-2xl font-bold ${FONT_CLASSES.sans}`} style={{ color: COLORS.dark }}>${totalPrice}</span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={`px-6 py-3 rounded-xl text-lg font-bold text-white transition duration-200 shadow-xl w-3/5 ${FONT_CLASSES.sans}`}
                            style={{ backgroundColor: COLORS.primary, opacity: 1, boxShadow: `0 4px 6px -1px rgba(167, 50, 73, 0.5), 0 2px 4px -2px rgba(167, 50, 73, 0.5)` }}
                        >
                            Añadir al carrito
                        </button>
                    </div>
                </div>

                {/* MODALES */}

                {/* 1. Modal de Formulario de Reseña (Cliente) */}
                {isClientFormOpen && (
                    <ReviewForm 
                        productId={PRODUCT_ID} 
                        customerId={CUSTOMER_ID} 
                        onClose={() => setIsClientFormOpen(false)}
                        onReviewSubmitted={handleReviewSubmitted}
                    />
                )}

                {/* 2. Modal de Respuesta (Administrador) */}
                {isResponseFormOpen && selectedReview && (
                    <ReviewResponseForm
                        review={selectedReview}
                        onClose={() => {
                            setIsResponseFormOpen(false);
                            setSelectedReview(null);
                        }}
                        onResponseSubmitted={handleResponseSubmitted}
                    />
                )}

                {/* 3. Modal de Confirmación de Eliminación (Administrador) */}
                {isDeleteConfirmationOpen && selectedReview && (
                    <ConfirmationModal
                        review={selectedReview}
                        onClose={() => {
                            setIsDeleteConfirmationOpen(false);
                            setSelectedReview(null);
                        }}
                        onConfirmDelete={handleReviewDeleted}
                    />
                )}
            </div>
        </div>
    );
}

export default ProductReviewScreen;

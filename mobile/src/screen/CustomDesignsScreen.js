import { useMemo, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

const STEPS = [
  { key: 'piece', title: 'Elige la pieza', description: 'Selecciona qué tipo de joya deseas diseñar.' },
  { key: 'base', title: 'Elige la base', description: 'Escoge el material base para tu joya.' },
  { key: 'baseLength', title: 'Longitud de la base', description: 'Especifica la longitud requerida (ej: 45cm).' },
  { key: 'decoration', title: 'Elige la decoración', description: 'Agrega toques únicos (puedes elegir varios).' },
  { key: 'clasp', title: 'Elige el cierre', description: 'Define el tipo de cierre para tu comodidad.' },
  { key: 'customerComments', title: 'Comentarios', description: 'Agrega algún detalle especial (opcional).' },
];

const OPTIONS = {
  piece: [
    { id: 'pulsera', label: 'Pulsera', price: 40, backendValue: 'Pulsera' },
    { id: 'cadena', label: 'Cadena', price: 55, backendValue: 'Cadena' },
    { id: 'tobillera', label: 'Tobillera', price: 35, backendValue: 'Tobillera' }
  ],
  base: [
    { id: 'oro', label: 'Oro 18k', price: 180, elementId: '507f1f77bcf86cd799439011' },
    { id: 'plata', label: 'Plata .925', price: 75, elementId: '507f1f77bcf86cd799439012' },
    { id: 'acero', label: 'Acero', price: 40, elementId: '507f1f77bcf86cd799439013' }
  ],
  decoration: [
    { id: 'perlas', label: 'Perlas', price: 35, elementId: '507f1f77bcf86cd799439014' },
    { id: 'zirconias', label: 'Zirconias', price: 28, elementId: '507f1f77bcf86cd799439015' },
    { id: 'inicial', label: 'Inicial', price: 18, elementId: '507f1f77bcf86cd799439016' },
    { id: 'amuleto', label: 'Amuleto', price: 22, elementId: '507f1f77bcf86cd799439017' }
  ],
  clasp: [
    { id: 'mosqueton', label: 'Mosquetón', price: 10, elementId: '507f1f77bcf86cd799439018' },
    { id: 'iman', label: 'Imán', price: 15, elementId: '507f1f77bcf86cd799439019' },
    { id: 'barra', label: 'Barra T', price: 18, elementId: '507f1f77bcf86cd799439020' },
    { id: 'resorte', label: 'Resorte', price: 8, elementId: '507f1f77bcf86cd799439021' }
  ]
};

const CustomDesignsScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [fontsLoaded] = useFonts({
    'CormorantGaramond-Bold': require('../../assets/fonts/CormorantGaramond-Bold.ttf'),
    'Nunito-Black': require('../../assets/fonts/Nunito-Black.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
    'Quicksand': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [selected, setSelected] = useState({
    piece: null,
    base: null,
    baseLength: '',
    decoration: [],
    clasp: null,
    customerComments: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const currentStep = STEPS[stepIndex];

  const validateBaseLength = (length) => {
    if (!length.trim()) {
      return { isValid: false, message: 'La longitud es requerida' };
    }

    const regex = /^\d{1,3}(cm|mm)?$/i;
    const trimmedLength = length.trim();
    if (!regex.test(trimmedLength)) {
      // Mensaje de error basado en lo que el backend realmente espera
      return { isValid: false, message: 'Formato inválido. Usa: 123, 123cm, o 123mm (sin decimales ni pulgadas)' };
    }

    const match = trimmedLength.match(/^(\d{1,3})(cm|mm)?$/i);
    if (!match) {
      return { isValid: false, message: 'Error interno de validación al analizar el valor.' };
    }
    const value = parseFloat(match[1]);
    const unit = (match[2] || '').toLowerCase();

    const effectiveUnit = unit || 'cm';

    if (effectiveUnit === 'cm' && (value < 10 || value > 200)) {
      // Rango ajustado a las nuevas unidades permitidas (sin decimales)
      return { isValid: false, message: 'Longitud debe ser un entero entre 10cm y 200cm' };
    }
    if (effectiveUnit === 'mm' && (value < 100 || value > 2000)) {
      // Rango ajustado a las nuevas unidades permitidas (sin decimales)
      return { isValid: false, message: 'Longitud debe ser un entero entre 100mm y 2000mm' };
    }

    return { isValid: true };
  };

  const validateComments = (comments) => {
    if (comments.length > 300) {
      return { isValid: false, message: 'Máximo 300 caracteres' };
    }
    return { isValid: true };
  };
  const canContinue = useMemo(() => {
    // Limpiar errores al cambiar de paso
    setErrors({});

    if (currentStep.key === 'decoration') return selected.decoration.length > 0;
    if (currentStep.key === 'baseLength') {
      const lengthValid = validateBaseLength(selected.baseLength);
      return lengthValid.isValid;
    }
    if (currentStep.key === 'customerComments') return true; // Opcional
    return !!selected[currentStep.key];
  }, [selected, currentStep.key]);

  const generateCodeRequest = () => {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 5);
    return `DESIGN-${timestamp}-${random}`.toUpperCase();
  };

  const handleSelect = (groupKey, option) => setSelected(prev => ({ ...prev, [groupKey]: option }));

  const handleSelectDecoration = (option) => {
    setSelected(prev => {
      const isSelected = prev.decoration.some(deco => deco.elementId === option.elementId);
      if (isSelected) {
        return {
          ...prev,
          decoration: prev.decoration.filter(deco => deco.elementId !== option.elementId)
        };
      } else {
        return {
          ...prev,
          decoration: [...prev.decoration, option]
        };
      }
    });
  };

  const next = () => {
    if (stepIndex < STEPS.length - 1) setStepIndex(stepIndex + 1);
  };

  const back = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    else navigation.goBack();
  };

  const finish = async () => {
    // Validaciones finales antes de enviar
    const baseLengthValidation = validateBaseLength(selected.baseLength);

    // Solo validar comentarios si hay texto
    const commentsValidation = selected.customerComments.trim().length > 0 ? validateComments(selected.customerComments) : { isValid: true };

    const validationErrors = {};

    if (!selected.piece) validationErrors.piece = 'Selecciona una pieza';
    if (!selected.base) validationErrors.base = 'Selecciona un material base';
    if (!baseLengthValidation.isValid) validationErrors.baseLength = baseLengthValidation.message;
    if (selected.decoration.length === 0) validationErrors.decoration = 'Selecciona al menos una decoración';
    if (!selected.clasp) validationErrors.clasp = 'Selecciona un cierre';
    if (!commentsValidation.isValid) validationErrors.customerComments = commentsValidation.message;

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Alert.alert(
        'Datos incompletos',
        'Por favor corrige los errores antes de continuar:\n\n' +
        Object.values(validationErrors).join('\n• ')
      );
      return;
    }
    const missing = STEPS.filter(s => {
      if (s.key === 'decoration') return selected.decoration.length === 0;
      return !selected[s.key];
    });

    if (missing.length || !selected.baseLength.trim()) {
      Alert.alert('Faltan opciones', 'Por favor completa todas las selecciones antes de continuar.');
      return;
    }
    setIsSubmitting(true);

    try {
      const designData = {
        codeRequest: generateCodeRequest(),
        piece: selected.piece.backendValue, // Solo el string
        base: selected.base.elementId, // ObjectId
        baseLength: selected.baseLength,
        decoration: selected.decoration.map(deco => deco.elementId), // Array de ObjectIds
        clasp: selected.clasp.elementId, // ObjectId (closure -> clasp)
        customerComments: selected.customerComments
      };

      // Aquí iría la llamada al API
      const response = await fetch('https://pergola.onrender.com/api/public/customdesigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(designData)
      });

      if (response.ok) {
        Alert.alert(
          'Diseño creado',
          `Código: ${designData.codeRequest}\nPieza: ${selected.piece.label}\nBase: ${selected.base.label}\nDecoraciones: ${selected.decoration.map(d => d.label).join(', ')}\nCierre: ${selected.clasp.label}`,
          [
            { text: 'Aceptar', onPress: () => navigation.navigate('Home') },
          ]
        );
      } else {
        throw new Error(responseData.message || 'Error del servidor');
      }
    } catch (error) {
      console.error('Error al crear diseño:', error);
      Alert.alert('Error', 'No se pudo crear el diseño. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };
  // Componente para longitud de base
  const renderBaseLengthInput = () => {
    const validation = validateBaseLength(selected.baseLength);
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Longitud de la base *</Text>
        <TextInput
          style={[styles.textInput,
          selected.baseLength && !validation.isValid && styles.inputError // ← ESTILO DE ERROR
          ]}
          value={selected.baseLength}
          onChangeText={(text) => {
            setSelected(prev => ({ ...prev, baseLength: text }));
            // Limpiar error específico al escribir
            if (errors.baseLength) {
              setErrors(prev => ({ ...prev, baseLength: null }));
            }
          }}
          placeholder="Ej: 45cm o 180mm"
          placeholderTextColor="#999"
          keyboardType="numbers-and-punctuation"
        />
        <Text style={[styles.inputHint,
        selected.baseLength && !validation.isValid && styles.errorText // ← TEXTO DE ERROR
        ]}>{selected.baseLength && !validation.isValid
          ? validation.message
          : 'Formato: 45cm o 180mm'
          }</Text>
      </View>
    );
  };
  // Componente para comentarios opcionales
  const renderCommentsInput = () => {
    const validation = validateComments(selected.customerComments);
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Comentarios adicionales (opcional)</Text>
        <TextInput
          style={[styles.textInput, styles.textArea, !validation.isValid && styles.inputError]}
          value={selected.customerComments}
          onChangeText={(text) => {
            setSelected(prev => ({ ...prev, customerComments: text }))
            // Limpiar error específico al escribir
            if (errors.customerComments) {
              setErrors(prev => ({ ...prev, customerComments: null }));
            }
          }}
          placeholder="Algún detalle especial o instrucción..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          maxLength={300}
        />
        <Text style={[
          styles.inputHint,
          !validation.isValid && styles.errorText // ← TEXTO DE ERROR
        ]}>{!validation.isValid
          ? validation.message
          : `${selected.customerComments.length}/300 caracteres`
          }</Text>
      </View>
    );
  };
  const renderOptions = () => {
    if (currentStep.key === 'baseLength') {
      return renderBaseLengthInput();
    }

    if (currentStep.key === 'customerComments') {
      return renderCommentsInput();
    }

    // Prevención de error: si no hay opciones para el paso actual
    if (!OPTIONS[currentStep.key]) {
      return null;
    }

    return (
      <View style={styles.chipsWrap}>
        {OPTIONS[currentStep.key].map(opt => {
          const isSelected = currentStep.key === 'decoration'
            ? selected.decoration.some(deco => deco.elementId === opt.elementId)
            : selected[currentStep.key]?.elementId === opt.elementId;

          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => currentStep.key === 'decoration'
                ? handleSelectDecoration(opt)
                : handleSelect(currentStep.key, opt)
              }
              activeOpacity={0.8}
              disabled={isSubmitting}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {opt.label}
              </Text>
              <Text style={[styles.chipPrice, isSelected && styles.chipTextSelected]}>
                ${opt.price}
              </Text>
              {currentStep.key === 'decoration' && isSelected && (
                <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  if (!fontsLoaded) return <AppLoading />;

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#E3C6B8" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={back} disabled={isSubmitting}>
          <Ionicons name="chevron-back" size={26} color="#3D1609" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Diseño Personalizado</Text>
        <View style={{ width: 26 }} />
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((s, i) => {
          const active = i === stepIndex;
          const completed = i < stepIndex;
          return (
            <View key={s.key} style={styles.stepItem}>
              <View style={[styles.stepCircle, completed && styles.stepCircleDone, active && styles.stepCircleActive]}>
                <Text style={[styles.stepIndex, (active || completed) && styles.stepIndexActive]}>{i + 1}</Text>
              </View>
              {i < STEPS.length - 1 && <View style={[styles.stepLine, (completed) && styles.stepLineDone]} />}
            </View>
          );
        })}
      </View>

      {/* Titles */}
      <View style={styles.titles}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.subtitle}>{currentStep.description}</Text>
      </View>

      {/* Options */}
      <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {renderOptions()}

        {/* Summary card actualizada */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Pieza</Text>
            <Text style={styles.summaryVal}>{selected.piece?.label || '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Base</Text>
            <Text style={styles.summaryVal}>{selected.base?.label || '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Longitud</Text>
            <Text style={styles.summaryVal}>{selected.baseLength || '—'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Decoración</Text>
            <Text style={styles.summaryVal}>
              {selected.decoration.length > 0
                ? selected.decoration.map(d => d.label).join(', ')
                : '—'
              }
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryKey}>Cierre</Text>
            <Text style={styles.summaryVal}>{selected.clasp?.label || '—'}</Text>
          </View>
          {selected.customerComments ? (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Comentarios</Text>
              <Text style={[styles.summaryVal, styles.commentsText]}>{selected.customerComments}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>

      {/* Footer actions */}
      <View style={[styles.footer, { paddingBottom: insets.bottom || 16 }]}>
        <TouchableOpacity style={[styles.navBtn, styles.secondaryBtn, isSubmitting && styles.disabledBtn]} onPress={back}
          disabled={isSubmitting}>
          <Text style={[styles.navBtnText, styles.secondaryText]}>{stepIndex === 0 ? 'Salir' : 'Atrás'}</Text>
        </TouchableOpacity>
        {stepIndex < STEPS.length - 1 ? (
          <TouchableOpacity style={[styles.navBtn, (!canContinue || isSubmitting) && styles.disabledBtn]} onPress={next}
            disabled={(!canContinue || isSubmitting)}>
            <Text style={styles.navBtnText}>Siguiente</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.navBtn, (!canContinue || isSubmitting) && styles.disabledBtn]} onPress={finish}
            disabled={(!canContinue || isSubmitting)}>
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.navBtnText}>Enviar Solicitud</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

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
    paddingVertical: 12,
  },
  backBtn: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 24,
    color: '#3D1609',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E8E1D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#A73249',
  },
  stepCircleDone: {
    backgroundColor: '#A73249',
  },
  stepIndex: {
    color: '#3D1609',
    fontFamily: 'Nunito-Bold',
    fontSize: 12,
  },
  stepIndexActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 28,
    height: 2,
    backgroundColor: '#E8E1D8',
    marginHorizontal: 6,
  },
  stepLineDone: {
    backgroundColor: '#A73249',
  },
  titles: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  title: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 20,
    color: '#3D1609',
  },
  subtitle: {
    fontFamily: 'Quicksand',
    fontSize: 14,
    color: '#3D1609',
    opacity: 0.85,
    marginTop: 2,
  },
  optionsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 12,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E1D8',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chipSelected: {
    backgroundColor: '#A73249',
    borderColor: '#A73249',
  },
  chipText: {
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    fontSize: 14,
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
  chipPrice: {
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    fontSize: 12,
    opacity: 0.9,
  },
  summary: {
    marginTop: 24,
    backgroundColor: '#F5EDE8',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D5C9',
    shadowColor: '#3D1609',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  summaryTitle: {
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
    color: '#3D1609',
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryKey: {
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    fontSize: 14,
    opacity: 0.9,
  },
  summaryVal: {
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#E8D5C9',
    marginVertical: 8,
  },
  em: {
    fontFamily: 'Nunito-Bold',
    color: '#A73249',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: '#E3C6B8',
  },
  navBtn: {
    flex: 1,
    backgroundColor: '#A73249',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A73249',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  navBtnText: {
    color: '#FFFFFF',
    fontFamily: 'Quicksand-Bold',
    fontSize: 16,
  },
  secondaryBtn: {
    backgroundColor: '#E8E1D8',
    shadowOpacity: 0.08,
  },
  secondaryText: {
    color: '#3D1609',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: 'Nunito-Bold',
    color: '#3D1609',
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E1D8',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    fontSize: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontFamily: 'Nunito-Regular',
    color: '#3D1609',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  commentsText: {
    fontStyle: 'italic',
    textAlign: 'right',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  inputError: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  errorText: {
    color: '#D32F2F',
    opacity: 1,
  }
});
export default CustomDesignsScreen;
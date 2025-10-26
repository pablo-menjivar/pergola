// Importa react-hook-form y componentes necesarios
import { useForm, Controller } from 'react-hook-form'
import BaseModal from './BaseModal'
import { Save, X, Upload, Eye, EyeOff, Image, Trash2 } from 'lucide-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import OrderItemsField from '../../Fields/OrderItemsField'
import PhoneInput from '../../Input/PhoneInput'
import DUIInput from '../../Input/DUIInput';
import DateInput from '../../Input/DateInput'; 
import PasswordInput from '../../Input/PasswordInput';

// Componente modal para formularios dinámicos
const FormModal = ({isOpen, onClose, onSubmit, title, fields, initialData = {}, isLoading = false, submitButtonText = 'Guardar', productsData = {}}) => {
  // Estados para mostrar/ocultar contraseñas, previews de imágenes y archivos seleccionados, y si el formulario está inicializado
  const [showPasswords, setShowPasswords] = useState({})
  const [imagePreviews, setImagePreviews] = useState({})
  const [imageArrays, setImageArrays] = useState({})
  const [selectedFiles, setSelectedFiles] = useState({})
  const isInitialized = useRef(false)
  // Configura react-hook-form
  const { register, handleSubmit, formState: { errors }, reset, setValue, control } = useForm({
    mode: 'onChange', // Validar en tiempo real
    defaultValues: {}
  })
  // Función para limpiar states}}
  const clearStates = useCallback(() => {
    setShowPasswords({})
    setImagePreviews({})
    setImageArrays({})
    setSelectedFiles({})
  }, [])
  // Efecto para reset cuando se cierra el modal
  useEffect(() => {
    if (!isOpen) {
      clearStates()
      isInitialized.current = false
    }
  }, [isOpen, clearStates])
  // Inicializa el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen && fields && !isInitialized.current) {
      const defaultValues = {}
      fields.forEach(field => {
        const initialValue = initialData[field.name]
        if (field.type === 'date') {
          // Convierte el valor inicial al formato YYYY-MM-DD
          if (initialValue) {
            const date = new Date(initialValue)
            if (!isNaN(date)) {
              defaultValues[field.name] = date.toISOString().split('T')[0] // Formato YYYY-MM-DD
            } else {
              defaultValues[field.name] = '' // Valor por defecto si la fecha es inválida
            }
          } else {
            defaultValues[field.name] = ''
          }
        }
        if (field.type === 'checkbox') {
          defaultValues[field.name] = Boolean(initialValue)
        } else if (field.type === 'number') {
          defaultValues[field.name] = initialValue !== undefined ? Number(initialValue) : ''
        } 
        else if (field.type === 'select-multiple') {
          if (Array.isArray(initialValue)) {
            defaultValues[field.name] = initialValue.map(item => 
              typeof item === 'object' ? item._id : item
            )
          } else {
            defaultValues[field.name] = []
          }
        } 
        else {
          defaultValues[field.name] = initialValue || ''
        }
      })
      reset(defaultValues)
      clearStates()
      isInitialized.current = true
    }
  }, [isOpen, fields, initialData, reset]) // Solo depende de isOpen
  // Limpiar previews cuando se cierra el modal
  if (!isOpen) {
    setImagePreviews({})
    setImageArrays({})
  }
  // Maneja el envío del formulario
  const onFormSubmit = (data) => {
    onSubmit(data)
  }
  // Obtiene reglas de validación para cada campo
  const getValidationRules = (field) => {
    const rules = {}
    if (field.required && field.type !== 'checkbox') {
      rules.required = `${field.label} es requerido`
    }
    if (field.type === 'email') {
      rules.pattern = {
        value: /\S+@\S+\.\S+/,
        message: 'Email inválido'
      }
    }
    if (field.type === 'tel') {
      rules.pattern = {
        value: /^\+503-?\d{4}-?\d{4}$/,
        message: 'Teléfono debe ser +503 seguido de 8 dígitos, con o sin guiones (ej: +503-7123-4567)',
      };
      rules.setValueAs = (value) => {
        // Limpia espacios y asegura el formato +503-XXXX-XXXX
        if (!value) return '';
        let cleaned = value.replace(/[^\d+]/g, '');
        if (!cleaned.startsWith('+503')) {
          cleaned = '+503' + cleaned.replace(/[^\d]/g, '').slice(0, 8);
        }
        if (cleaned.length === 11) {
          cleaned = cleaned.replace(/^(\+503)(\d{4})(\d{4})$/, '$1-$2-$3');
        }
        return cleaned;
      };
    }
    if (field.type === 'dui') {
      rules.pattern = {
        value: /^\d{8}-\d{1}$/,
        message: 'DUI debe tener el formato 00000000-0',
      };
      rules.setValueAs = (value) => {
        if (!value) return '';
        const cleaned = value.replace(/\D/g, '').slice(0, 9);
        if (cleaned.length === 9) {
          return `${cleaned.slice(0, 8)}-${cleaned.slice(8)}`;
        }
        return cleaned;
      };
    }
    if (field.type === 'number') {
      rules.min = {
        value: field.min || 0,
        message: `Debe ser mayor o igual a ${field.min || 0}`
      }
      if (field.max) {
        rules.max = {
          value: field.max,
          message: `Debe ser menor o igual a ${field.max}`
        }
      }
      rules.setValueAs = (value) => value === '' ? '' : Number(value)
    }
    if (field.type === 'date') {
      rules.setValueAs = (value) => {
        if (!value) return '' // Maneja valores vacíos
        const date = new Date(value)
        return isNaN(date) ? '' : date.toISOString().split('T')[0] // Retorna YYYY-MM-DD
      };
      // Validación para fechas futuras y pasadas (para receiptDate, birthDate y hireDate)
      if (field.name === 'receiptDate') {
        rules.validate = {
          isFuture: (value) => {
            if (!value) return true; // Permite vacíos si no es requerido
            const dateValue = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateValue.setHours(0, 0, 0, 0);
            return !isNaN(dateValue.getTime()) && dateValue > today
              ? true
              : 'La fecha de recepción debe ser futura';
          },
        };
      }
      if (field.name === 'birthDate') {
        rules.validate = {
          isPast: (value) => {
            if (!value) return true;
            const dateValue = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateValue.setHours(0, 0, 0, 0);
            const maxBirthDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
            return !isNaN(dateValue.getTime()) && dateValue <= today && dateValue >= maxBirthDate
              ? true
              : 'La fecha de nacimiento debe ser en el pasado y no anterior a 120 años';
          },
        };
      }
      if (field.name === 'hireDate') {
        rules.validate = {
          isValid: (value) => {
            if (!value) return true;

            const dateValue = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            dateValue.setHours(0, 0, 0, 0);

            const isFuture = dateValue > today;
            const isInvalidDate = isNaN(dateValue.getTime());

            if (isInvalidDate) return 'La fecha ingresada no es válida';
            if (isFuture) return 'La fecha de contratación no puede ser futura';
            // Si pasa ambas comprobaciones
            return true;
          },
        };
      }
    }
    if (field.minLength) {
      rules.minLength = {
        value: field.minLength,
        message: `Mínimo ${field.minLength} caracteres`
      }
    }
    if (field.maxLength) {
      rules.maxLength = {
        value: field.maxLength,
        message: `Máximo ${field.maxLength} caracteres`
      }
    }
    // AGREGAR en la función getValidationRules después de la línea 70:
    if (field.pattern) {
      rules.pattern = {
        value: new RegExp(field.pattern),
        message: field.patternMessage || 'Formato inválido'
      }
    }
    return rules
  }
  // Maneja el preview de imágenes
  const handleImagePreview = (fieldName, files, isArray = false) => {
      if (!files || files.length === 0) {
      setImagePreviews(prev => ({ ...prev, [fieldName]: null }))
      if (isArray) {
        setImageArrays(prev => ({ ...prev, [fieldName]: [] }))
      }
      return
    }
    if (isArray) {
      const newPreviews = []
      const fileArray = Array.from(files)
      fileArray.forEach((file, index) => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = (e) => {
            newPreviews[index] = e.target.result
            if (newPreviews.length === fileArray.length) {
              setImagePreviews(prev => ({ ...prev, [fieldName]: newPreviews }))
              setImageArrays(prev => ({ ...prev, [fieldName]: fileArray }))
            }
          }
          reader.readAsDataURL(file)
        }
      })
    } else {
      const file = files[0]
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews(prev => ({ ...prev, [fieldName]: e.target.result }))
        }
        reader.readAsDataURL(file)
      }
    }
  }
  // Remueve imagen de un array de imágenes
  const removeImageFromArray = (fieldName, index) => {
    const currentPreviews = imagePreviews[fieldName] || []
    const currentFiles = imageArrays[fieldName] || []
    const newPreviews = currentPreviews.filter((_, i) => i !== index)
    const newFiles = currentFiles.filter((_, i) => i !== index)
    setImagePreviews(prev => ({ ...prev, [fieldName]: newPreviews }))
    setImageArrays(prev => ({ ...prev, [fieldName]: newFiles }))
    // Actualiza el valor en el formulario
    const dataTransfer = new DataTransfer()
    newFiles.forEach(file => dataTransfer.items.add(file))
    setValue(fieldName, dataTransfer.files)
  }
  // Renderiza el campo según su tipo
  const renderField = (field) => {
    const hasError = errors[field.name]
    const validation = getValidationRules(field)
    const baseInputClasses = `w-full px-3 py-2 border rounded-lg font-[Quicksand] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#A73249] ${
      hasError 
        ? 'border-red-300 bg-red-50 focus:border-red-500' 
        : 'border-gray-300 bg-white focus:border-[#A73249]'
    }`
    switch (field.type) {
      case 'tel':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={validation}
            render={({ field: { onChange, value, name } }) => (
              <PhoneInput
                name={name}
                value={value || ''} // Asegurar que siempre haya un valor (string vacío si undefined)
                onChange={onChange}
                required={field.required}
                disabled={isLoading}
              />
            )}
          />
        )
      case 'dui':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={validation}
            render={({ field: { onChange, value, name } }) => (
              <DUIInput
                text={field.label}
                name={name}
                value={value || ''}
                onChange={onChange}
                required={field.required}
                disabled={isLoading}
              />
            )}
          />
        )
      case 'textarea':
        return (
          <textarea {...register(field.name, validation)} placeholder={field.placeholder} rows={field.rows || 3} className={`${baseInputClasses} resize-none`} disabled={isLoading}/>
        )
      case 'select':
        // Usa las opciones del campo
        let selectOptions = field.options || []
        if (!Array.isArray(selectOptions)) {
          selectOptions = []
        }
        return (
          <select {...register(field.name, validation)} className={baseInputClasses} disabled={isLoading}>
            <option value="">Seleccionar {field.label}</option>
            {selectOptions.map((option, index) => (
              <option key={`${field.name}-option-${option.value}-${index}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      case 'select-multiple':
        let multiSelectOptions = field.options || []
        if (!Array.isArray(multiSelectOptions)) {
          multiSelectOptions = []
        }
        return (
          <div className="space-y-2">
            <select {...register(field.name, validation)} multiple size={Math.min(multiSelectOptions.length + 1, 6)} className={`${baseInputClasses} h-auto min-h-[120px]`} disabled={isLoading}>
              {multiSelectOptions.map((option, index) => (
                <option key={`${field.name}-multi-option-${option.value}-${index}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 font-[Quicksand]">
              Mantén presionado Ctrl/Cmd para seleccionar múltiples opciones
            </div>
          </div>
        )
      // En FormModal.jsx, dentro de renderField function, agrega:
      case 'order-items':
        console.log('🔍 FormModal - Rendering order-items field:', {
          fieldName: field.name,
          productsData: productsData?.products,
          productsCount: productsData?.products?.length
        });
        return (
          <OrderItemsField
            value={initialData[field.name] || []}
            onChange={(newItems) => {
              // Calcular subtotal y total automáticamente
              const subtotal = newItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
              const total = subtotal;
              
              // Actualizar los campos de subtotal y total
              setValue('subtotal', subtotal);
              setValue('total', total);
              
              // Actualizar los items
              setValue(field.name, newItems);
            }}
            products={productsData?.products || []}
            disabled={isLoading}
          />
        );
      case 'image':
        return (
          <div className="space-y-3">
            <div className="relative">
              <input type="file" accept="image/*" className="hidden" id={`image-${field.name}`} disabled={isLoading} onChange={(e) => { const files = e.target.files
                const file = files[0] || null
                handleImagePreview(field.name, files, false)
                setSelectedFiles(prev => ({ ...prev, [field.name]: file }))}}/>
              <label htmlFor={`image-${field.name}`} className={`${baseInputClasses} cursor-pointer flex items-center justify-center space-x-2 hover:bg-gray-50 min-h-[100px]`}>
                {imagePreviews[field.name] ? (
                  <div className="flex flex-col items-center space-y-2">
                    <img src={imagePreviews[field.name]} alt="Preview" className="w-20 h-20 object-cover rounded-lg border-2 border-[#db8f2c]"/>
                    <span className="text-sm text-[#3D1609]">Cambiar imagen</span>
                  </div>
                ) : (
                  <>
                    <Image className="w-6 h-6 text-gray-500" />
                    <span className="text-gray-500">{field.placeholder || 'Seleccionar imagen'}</span>
                  </>
                )}
              </label>
            </div>
          </div>
        )
      case 'imageArray':
        return (
          <div className="space-y-3">
            <div className="relative">
              <input  {...register(field.name, validation)} type="file" accept="image/*" multiple className="hidden" id={`images-${field.name}`} disabled={isLoading} onChange={(e) => { handleImagePreview(field.name, e.target.files, true) }}/>
              <label htmlFor={`images-${field.name}`} className={`${baseInputClasses} cursor-pointer flex items-center justify-center space-x-2 hover:bg-gray-50 min-h-[60px]`}>
                <Upload className="w-5 h-5 text-gray-500" />
                <span className="text-gray-500">
                  {field.placeholder || 'Seleccionar múltiples imágenes'}
                </span>
              </label>
            </div>
            {/* Grid de previews */}
            {imagePreviews[field.name] && imagePreviews[field.name].length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 bg-[#FFF] rounded-lg border-gray-900">
                {imagePreviews[field.name].map((preview, index) => (
                  <div key={index} className="relative group">
                    <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg border-2 border-white shadow-sm"/>
                    <button type="button" onClick={() => removeImageFromArray(field.name, index)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600" disabled={isLoading}>
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case 'password':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={validation}
            render={({ field: { onChange, value, name } }) => (
              <PasswordInput
                text={field.label}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={field.placeholder}
                required={field.required}
                disabled={isLoading}
              />
            )}
          />
        );
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input {...register(field.name)} type="checkbox" className="w-4 h-4 text-[#A73249] border-gray-300 rounded focus:ring-[#A73249]" disabled={isLoading}/>
            <span className="text-sm text-gray-600">{field.checkboxLabel || field.label}</span>
          </div>
        )
      case 'number':
        return (
          <input {...register(field.name, validation)} type="number" placeholder={field.placeholder} className={baseInputClasses} disabled={isLoading} min={field.min} max={field.max} step={field.step || 'any'}/>
        )
      case 'date':
        return (
          <Controller
            name={field.name}
            control={control}
            rules={validation}
            render={({ field: { onChange, value, name } }) => (
              <DateInput
                text={field.label}
                name={name}
                value={value || ''}
                onChange={onChange}
                required={field.required}
                disabled={isLoading}
                min={field.minDate}
                max={field.maxDate}
              />
            )}
          />
        );
      default:
        return (
          <input {...register(field.name, validation)} type={field.type || 'text'} placeholder={field.placeholder} className={baseInputClasses} disabled={isLoading}/>
        )
    }
  }
  // Procesa los datos antes de enviar (para archivos)
  const processFormData = (data) => {
    const processedData = { ...data }
    // Procesa archivos e imágenes
    fields.forEach(field => {
      if (field.type === 'image') {
        // Usa el archivo del estado separado
        const file = selectedFiles[field.name]
        if (file && file instanceof File) {
          processedData[field.name] = file
        } else {
          delete processedData[field.name]
        }
      } else if (field.type === 'imageArray' && imageArrays[field.name]) {
        processedData[field.name] = imageArrays[field.name]
      }
      else if (field.type === 'select-multiple' && data[field.name]) {
        // Convierte HTMLCollection a array de strings
        processedData[field.name] = Array.from(data[field.name])
      }
    })
    return processedData  
  }
  // Validar si hay campos
  if (!fields) {
    return null
  }
  return (
    // Usa el modal base para mostrar el formulario
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form onSubmit={handleSubmit((data) => onFormSubmit(processFormData(data)))} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Renderiza cada campo del formulario */}
          {fields.map((field) => (
            <div key={field.name} className={field.fullWidth ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-[#3D1609] mb-2 font-[Quicksand]">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {/* Muestra errores de validación */}
              {errors[field.name] && (
                <p className="mt-1 text-sm text-red-600 font-[Quicksand]">
                  {errors[field.name]?.message}
                </p>
              )}
              {/* Texto de ayuda si existe */}
              {field.helperText && !errors[field.name] && (
                <p className="mt-1 text-sm text-gray-500 font-[Quicksand]">{field.helperText}</p>
              )}
            </div>
          ))}
        </div>
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-[#3D1609] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-[Quicksand] font-regular disabled:opacity-50">
            <X className="w-4 h-4 inline mr-2" />
            Cancelar
          </button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-[#A73249] text-white rounded-lg hover:bg-[#A73249]/90 transition-colors duration-200 font-[Quicksand] disabled:opacity-50 flex items-center">
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {submitButtonText}
              </>
            )}
          </button>
        </div>
      </form>
    </BaseModal>
  )
}
// Exporta el componente para su uso en otras partes de la aplicación
export default FormModal
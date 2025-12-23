import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { AuthContext } from "../context/AuthContext";

const EmailVerificationScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const { verifyEmail, resendVerificationCode } = useContext(AuthContext);
  
  const [verificationCode, setVerificationCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);

  const [fontsLoaded] = useFonts({
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-Regular': require('../../assets/fonts/Quicksand-Regular.ttf'),
    'Nunito-Bold': require('../../assets/fonts/Nunito-Bold.ttf'),
    'Nunito-SemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
    'Nunito-Regular': require('../../assets/fonts/Nunito-Regular.ttf'),
  });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleCodeChange = (value, index) => {
    if (value.length <= 1 && /^[a-zA-Z0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value.toLowerCase(); // Convertimos a minúscula
      setVerificationCode(newCode);

      // Auto focus next input
      if (value && index < 5) {
        inputsRef.current[index + 1].focus();
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (nativeEvent.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.join("");
    
    if (code.length !== 6) {
      Alert.alert("Error", "Por favor ingresa el código completo de 6 dígitos");
      return;
    }

    setLoading(true);
    
    try {
      const success = await verifyEmail(email, code);
      
      if (success) {
        navigation.navigate("VerificationSuccess");
      } else {
        Alert.alert("Error", "Código incorrecto. Intenta nuevamente.");
      }
      
    } catch (error) {
      Alert.alert("Error", "Error al verificar el código: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    
    try {
      const success = await resendVerificationCode(email);
      
      if (success) {
        Alert.alert("Éxito", "Se ha enviado un nuevo código a tu correo");
        setTimer(60);
        setCanResend(false);
        setVerificationCode(["", "", "", "", "", ""]);
      } else {
        Alert.alert("Error", "No se pudo reenviar el código");
      }
      
    } catch (error) {
      Alert.alert("Error", "Error al reenviar código: " + error.message);
    } finally {
      setResending(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A73249" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header con botón de volver */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={loading}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={28} color="#3D1609" />
          </TouchableOpacity>
        </View>

        {/* Icono de verificación */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="mail" size={60} color="#A73249" />
          </View>
        </View>

        {/* Mensaje de Bienvenida */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Verifica tu correo</Text>
          <Text style={styles.welcomeSubtitle}>
            Hemos enviado un código de verificación de 6 dígitos a:
          </Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Card del Formulario */}
        <View style={styles.verificationCard}>
          <Text style={styles.cardTitle}>Ingresa el código</Text>
          
          {/* Campos de código */}
          <View style={styles.codeContainer}>
            {verificationCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                style={styles.codeInput}
                value={digit}
                onChangeText={(value) => handleCodeChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="default"
                autoCapitalize="none"
                maxLength={1}
                textAlign="center"
                editable={!loading}
              />
            ))}
          </View>

          {/* Timer y reenviar */}
          <View style={styles.resendContainer}>
            {!canResend ? (
              <Text style={styles.timerText}>
                Reenviar código en {timer}s
              </Text>
            ) : (
              <TouchableOpacity 
                onPress={handleResendCode}
                disabled={resending}
                activeOpacity={0.7}
              >
                <Text style={styles.resendText}>
                  {resending ? "Reenviando..." : "Reenviar código"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Botón de verificar */}
          <TouchableOpacity 
            style={[styles.verifyButton, loading && styles.buttonDisabled]} 
            onPress={handleVerifyCode}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.verifyButtonText}>Verificar código</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3C6B8",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#E3C6B8",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F5EDE8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#A73249",
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 32,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 38,
  },
  welcomeSubtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#3D1609",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  emailText: {
    fontFamily: "Nunito-Bold",
    fontSize: 16,
    color: "#A73249",
    textAlign: "center",
  },
  verificationCard: {
    backgroundColor: "#F5EDE8",
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    shadowColor: "#3D1609",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#E8D5C9",
  },
  cardTitle: {
    fontFamily: "Quicksand-Bold",
    fontSize: 24,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 30,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
    gap: 8,
  },
  codeInput: {
    flex: 1,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    fontSize: 24,
    fontFamily: "Nunito-Bold",
    borderWidth: 2,
    borderColor: "#E8E1D8",
    color: "#3D1609",
    textAlign: "center",
  },
  resendContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  timerText: {
    fontFamily: "Nunito-Regular",
    fontSize: 14,
    color: "#3D1609",
    opacity: 0.7,
  },
  resendText: {
    fontFamily: "Nunito-SemiBold",
    fontSize: 14,
    color: "#A73249",
    textDecorationLine: "underline",
  },
  verifyButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#A73249",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#A73249",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#A7324980",
    shadowOpacity: 0.1,
    elevation: 2,
  },
  verifyButtonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
  }
});
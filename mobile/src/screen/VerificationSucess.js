import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const VerificationSuccessScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    "Nunito-Bold": require("../../assets/fonts/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("../../assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Regular": require("../../assets/fonts/Nunito-Regular.ttf"),
  });

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
        {/* Icono principal */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark" size={70} color="#2E7D32" />
          </View>
        </View>

        {/* Mensaje principal */}
        <View style={styles.messageSection}>
          <Text style={styles.title}>¡Correo verificado!</Text>
          <Text style={styles.subtitle}>
            Tu correo electrónico ha sido verificado exitosamente.  
            Ahora puedes continuar.
          </Text>
        </View>

        {/* Botón continuar */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("Login")} 
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Volver al inicio de sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default VerificationSuccessScreen;

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
    paddingTop: Platform.OS === "ios" ? 80 : 60,
    paddingBottom: 40,
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#F5EDE8",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#2E7D32",
    shadowColor: "#3D1609",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  messageSection: {
    alignItems: "center",
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  title: {
    fontFamily: "Quicksand-Bold",
    fontSize: 32,
    color: "#3D1609",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 38,
  },
  subtitle: {
    fontFamily: "Nunito-Regular",
    fontSize: 16,
    color: "#3D1609",
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.8,
  },
  continueButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#2E7D32",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  continueButtonText: {
    color: "#fff",
    fontFamily: "Quicksand-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
});

import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function CameraScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.cameraIcon}>
          <Ionicons name="camera" size={80} color="#fff" />
        </View>
        <ThemedText style={styles.title}>Camera</ThemedText>
        <ThemedText style={styles.description}>
          Scan receipts or investment opportunities with your camera.
        </ThemedText>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14142B',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraIcon: {
    backgroundColor: '#7C3AED',
    borderRadius: 75,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#A4A4B8',
    textAlign: 'center',
  },
});

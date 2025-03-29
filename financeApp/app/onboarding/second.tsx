import { View, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedText } from '../../components/ThemedText';
import { TouchableOpacity } from 'react-native';

export default function SecondOnboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>Invest With</ThemedText>
          <ThemedText type="title" style={styles.highlight}>Purpose</ThemedText>
        </View>
        <TouchableOpacity onPress={() => router.push('/auth/sign-up')} style={styles.skipButton}>
          <ThemedText>Skip</ThemedText>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={require('../../assets/images/Center Content.png')} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <ThemedText style={styles.description}>
          Choose from a variety of sustainable and impactful projects. Every investment contributes to positive change.
        </ThemedText>
      </View>

      <TouchableOpacity 
        style={styles.continueButton}
        onPress={() => router.push('/onboarding/third')}
      >
        <ThemedText style={styles.buttonText}>Next</ThemedText>
      </TouchableOpacity>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
  },
  highlight: {
    fontSize: 32,
    color: '#7C3AED',
    fontWeight: 'bold',
  },
  skipButton: {
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  imageContainer: {
    width: '100%',
    height: 400,
    marginVertical: 30,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  description: {
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 30,
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: '#7C3AED',
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
  },
  activeDot: {
    backgroundColor: '#7C3AED',
    width: 20,
  },
});

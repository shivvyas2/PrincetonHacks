import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { amount, businessName } = params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Congratulations</ThemedText>
        <ThemedText style={styles.subtitle}>Natalie!</ThemedText>
      </View>

      <View style={styles.confettiContainer}>
        <View style={styles.partyContainer}>
          <ThemedText style={styles.partyEmoji}>🎉</ThemedText>
        </View>
        <View style={[styles.confettiDot, styles.confettiBlue]} />
        <View style={[styles.confettiDot, styles.confettiYellow]} />
        <View style={[styles.confettiDot, styles.confettiGreen]} />
      </View>

      <View style={styles.investmentInfo}>
        <ThemedText style={styles.investedText}>
          You've Invested <ThemedText style={styles.amount}>${amount}</ThemedText>
        </ThemedText>
        <ThemedText style={styles.businessText}>
          Your investment in "{businessName}" is successful.
        </ThemedText>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.portfolioButton}
          onPress={() => router.push('/portfolio')}
        >
          <ThemedText style={styles.portfolioButtonText}>Investment Portfolio Summary</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.exploreButton}
          onPress={() => router.push('/(tabs)')}
        >
          <ThemedText style={styles.exploreButtonText}>Explore More Project</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#6200EE',
    marginTop: 5,
  },
  confettiContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  confettiDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  confettiBlue: {
    backgroundColor: '#479fd7',
    top: '20%',
    right: '15%',
  },
  confettiYellow: {
    backgroundColor: '#FFD700',
    top: '18%',
    left: '12%',
  },
  confettiGreen: {
    backgroundColor: '#4CAF50',
    top: '25%',
    left: '50%',
  },
  partyContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  partyEmoji: {
    fontSize: 40,
  },
  investmentInfo: {
    alignItems: 'center',
    marginBottom: 40,
  },
  investedText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
  },
  amount: {
    color: '#00C853',
    fontWeight: 'bold',
  },
  businessText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: '80%',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 40,
  },
  portfolioButton: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  portfolioButtonText: {
    color: '#6200EE',
    fontSize: 16,
  },
  exploreButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

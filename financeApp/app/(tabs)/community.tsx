import { View, StyleSheet, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Community</ThemedText>
        <ThemedText style={styles.description}>
          Connect with other investors and share your impact journey.
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

import { Redirect } from 'expo-router';
import { View, ActivityIndicator, Modal, Text, TextInput, TouchableOpacity, Pressable, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';

// This is the root index file that will be shown first when app starts
// Always redirect to onboarding screens
export default function Index() {
  const [loading, setLoading] = useState(true);
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  useEffect(() => {
    // Short timeout to ensure stable navigation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Show loading spinner briefly
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  // Always go to onboarding, regardless of whether user has seen it before
  return (
    <View>
      <Pressable onPress={(e) => { e.stopPropagation(); setBottomSheetVisible(true); }}>
        <Text>Invest Now</Text>
      </Pressable>
      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setBottomSheetVisible(false)}
      >
        <View style={styles.bottomSheetOverlay}>
          <View style={styles.bottomSheetContainer}>
            <Text style={styles.bottomSheetTitle}>Enter Investment Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={investmentAmount}
              onChangeText={setInvestmentAmount}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setBottomSheetVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  closeButton: {
    backgroundColor: '#479fd7',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

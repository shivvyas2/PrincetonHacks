import { View, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

// App theme color
const PRIMARY_COLOR = '#479fd7';

interface PaymentOption {
  id: string;
  name: string;
  last4: string;
  logo: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  expanded: boolean;
  options: PaymentOption[];
}

// Mock payment methods
const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Credit / Debit Card',
    icon: 'card-outline',
    description: 'Mastercard, VISA etc.',
    expanded: true,
    options: [
      { id: 'visa', name: 'Visa', last4: '4547', logo: 'visa' },
      { id: 'mastercard', name: 'Mastercard', last4: '3477', logo: 'mastercard' }
    ]
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: 'business-outline',
    description: 'JCB, Banccontact, etc.',
    expanded: false,
    options: []
  },
  {
    id: 'digital',
    name: 'Digital Wallet',
    icon: 'wallet-outline',
    description: 'Paypal, Applepay etc.',
    expanded: false,
    options: []
  }
];

export default function PaymentScreen() {
  const router = useRouter();
  const { businessId, amount } = useLocalSearchParams();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [selectedOption, setSelectedOption] = useState('visa');
  
  // Convert params
  const investmentAmount = typeof amount === 'string' ? amount : '100';
  const businessIdStr = typeof businessId === 'string' ? businessId : '1';

  const handleContinue = () => {
    // Navigate to confirmation screen
    router.push({
      pathname: '/invest/confirmation',
      params: { 
        businessId: businessIdStr,
        amount: investmentAmount,
        paymentMethod: selectedPaymentMethod,
        paymentOption: selectedOption
      }
    });
  };

  const toggleExpand = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const selectOption = (optionId: string) => {
    setSelectedOption(optionId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Secure Payment',
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Invest Project</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentCard}>
          <ThemedText style={styles.sectionTitle}>Secure Payment</ThemedText>
          <ThemedText style={styles.sectionSubtitle}>
            Select your preferred payment method to complete the investment.
          </ThemedText>
          
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentMethodContainer}>
              <TouchableOpacity 
                style={styles.paymentMethodHeader}
                onPress={() => toggleExpand(method.id)}
              >
                <View style={styles.paymentMethodLeft}>
                  <View style={styles.radioButton}>
                    {selectedPaymentMethod === method.id && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  
                  <View style={styles.methodIconContainer}>
                    <Ionicons name={method.icon} size={24} color="#6B7280" />
                  </View>
                  
                  <View>
                    <ThemedText style={styles.methodName}>{method.name}</ThemedText>
                    <ThemedText style={styles.methodDescription}>{method.description}</ThemedText>
                  </View>
                </View>
                
                <Ionicons 
                  name={method.expanded ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#A4A4B8" 
                />
              </TouchableOpacity>
              
              {selectedPaymentMethod === method.id && method.options.length > 0 && (
                <View style={styles.optionsContainer}>
                  {method.options.map((option) => (
                    <TouchableOpacity 
                      key={option.id}
                      style={styles.paymentOption}
                      onPress={() => selectOption(option.id)}
                    >
                      <View style={styles.optionLeft}>
                        <View style={styles.radioButton}>
                          {selectedOption === option.id && (
                            <View style={styles.radioButtonInner} />
                          )}
                        </View>
                        <ThemedText style={styles.optionName}>
                          {option.name} **** **** **** {option.last4}
                        </ThemedText>
                      </View>
                      
                      <View style={styles.cardLogoContainer}>
                        {option.logo === 'visa' && (
                          <View style={styles.cardIconContainer}>
                            <Ionicons name="card-outline" size={20} color={PRIMARY_COLOR} />
                            <ThemedText style={styles.cardLogoText}>VISA</ThemedText>
                          </View>
                        )}
                        {option.logo === 'mastercard' && (
                          <View style={styles.cardIconContainer}>
                            <Ionicons name="card-outline" size={20} color="#FF5F00" />
                            <ThemedText style={styles.cardLogoText}>MC</ThemedText>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity style={styles.addNewOption}>
                    <Ionicons name="add-outline" size={20} color={PRIMARY_COLOR} />
                    <ThemedText style={styles.addNewText}>Add New Credit / Debit Card</ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <ThemedText style={styles.continueButtonText}>Continue</ThemedText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#252039', // Dark purple background as shown in mockups
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    flex: 1,
    minHeight: 800, // To ensure the card extends beyond the screen
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  paymentMethodContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PRIMARY_COLOR,
  },
  methodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  methodDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    padding: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionName: {
    fontSize: 14,
    color: '#333',
  },
  cardLogoContainer: {
    width: 40,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLogoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },
  addNewOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  addNewText: {
    fontSize: 14,
    color: PRIMARY_COLOR,
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  continueButton: {
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

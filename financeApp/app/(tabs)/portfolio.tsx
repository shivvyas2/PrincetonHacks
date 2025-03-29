import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';

export default function PortfolioScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Your Portfolio</ThemedText>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.summaryCard}>
          <ThemedText style={styles.summaryTitle}>Total Investment</ThemedText>
          <ThemedText style={styles.summaryAmount}>£12,565,058</ThemedText>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Ionicons name="trending-up-outline" size={20} color="#4ADE80" />
              <ThemedText style={styles.summaryProfit}>+£1,245</ThemedText>
              <ThemedText style={styles.summaryLabel}>This month</ThemedText>
            </View>
            <View style={styles.summaryItem}>
              <Ionicons name="pie-chart-outline" size={20} color="#7C3AED" />
              <ThemedText style={styles.summaryCount}>8</ThemedText>
              <ThemedText style={styles.summaryLabel}>Investments</ThemedText>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Your Impact</ThemedText>
          <View style={styles.impactCard}>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <Ionicons name="leaf-outline" size={24} color="#4ADE80" />
                <ThemedText style={styles.impactCount}>24</ThemedText>
                <ThemedText style={styles.impactLabel}>Trees Planted</ThemedText>
              </View>
              <View style={styles.impactItem}>
                <Ionicons name="water-outline" size={24} color="#60A5FA" />
                <ThemedText style={styles.impactCount}>1.2K</ThemedText>
                <ThemedText style={styles.impactLabel}>Water Saved (L)</ThemedText>
              </View>
            </View>
            <View style={styles.impactRow}>
              <View style={styles.impactItem}>
                <Ionicons name="people-outline" size={24} color="#F97316" />
                <ThemedText style={styles.impactCount}>56</ThemedText>
                <ThemedText style={styles.impactLabel}>People Helped</ThemedText>
              </View>
              <View style={styles.impactItem}>
                <Ionicons name="globe-outline" size={24} color="#3B82F6" />
                <ThemedText style={styles.impactCount}>3.4</ThemedText>
                <ThemedText style={styles.impactLabel}>CO₂ Reduced (t)</ThemedText>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="arrow-up-outline" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>Invested in Business 1</ThemedText>
                <ThemedText style={styles.activityDate}>April 15, 2025</ThemedText>
              </View>
              <ThemedText style={styles.activityAmount}>£500</ThemedText>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, styles.depositIcon]}>
                <Ionicons name="arrow-down-outline" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>Deposit</ThemedText>
                <ThemedText style={styles.activityDate}>April 10, 2025</ThemedText>
              </View>
              <ThemedText style={styles.depositAmount}>£2,000</ThemedText>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="arrow-up-outline" size={16} color="#fff" />
              </View>
              <View style={styles.activityContent}>
                <ThemedText style={styles.activityTitle}>Invested in Business 2</ThemedText>
                <ThemedText style={styles.activityDate}>April 5, 2025</ThemedText>
              </View>
              <ThemedText style={styles.activityAmount}>£750</ThemedText>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#14142B',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#6C5DD3',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
  },
  summaryAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  summaryProfit: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4ADE80',
    marginVertical: 5,
  },
  summaryCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.7,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  impactCard: {
    backgroundColor: '#22223A',
    borderRadius: 15,
    padding: 15,
  },
  impactRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  impactItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  impactCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginVertical: 5,
  },
  impactLabel: {
    fontSize: 14,
    color: '#A4A4B8',
    textAlign: 'center',
  },
  activityCard: {
    backgroundColor: '#22223A',
    borderRadius: 15,
    padding: 15,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  depositIcon: {
    backgroundColor: '#4ADE80',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    color: '#ffffff',
  },
  activityDate: {
    fontSize: 14,
    color: '#A4A4B8',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
  depositAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4ADE80',
  },
  divider: {
    height: 1,
    backgroundColor: '#333',
    marginVertical: 5,
  },
});

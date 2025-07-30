import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NutrientBarProps {
  label: string;
  current: number;
  target: number;
  color: string;
  unit: string;
}

export function NutrientBar({ label, current, target, color, unit }: NutrientBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.values}>
          {Math.round(current)}{unit} / {target?.toFixed(1)}{unit}
        </Text>
      </View>
      <View style={styles.barContainer}>
        <View 
          style={[
            styles.barFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  values: {
    fontSize: 14,
    color: '#6B7280',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  percentage: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
  },
});
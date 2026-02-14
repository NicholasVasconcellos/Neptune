import { StyleSheet, View } from 'react-native'
import React from 'react'
import { Text } from 'react-native-paper'
import Title from '../../components/Title'

const addTraining = () => {
  return (
    <View style={styles.container}>
      <Title>Add Training</Title>
      <Text variant="bodyLarge">Create new Training Here</Text>
      {/* Button: Start from existing Training */}
      {/* New Training */}

      {/* Populate the Forms and continuously show the trainign duration */}
    </View>
  )
}

export default addTraining

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 8,
  },
})

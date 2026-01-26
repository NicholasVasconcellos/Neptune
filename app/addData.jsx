import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const addData = () => {
  return (
    <View>
      <Text>addData</Text>

      <Link href="/">Back Home</Link>
    </View>
  )
}

export default addData

const styles = StyleSheet.create({})
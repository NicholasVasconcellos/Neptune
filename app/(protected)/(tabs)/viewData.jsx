import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

// Dedicated Reporting page, allows you to select which data to view
// Custom Filter, sorting, grouping
// Get Charts you want, Pin a chart to you home page. 
// Whenever adding a chart get the option to keep it appearing there

const viewData = () => {
  return (
    <View>
      <Text>View Data</Text>
      <Text>View Any data here</Text>
      <Text>Select Object to view (todo) will list the icons</Text>
      {/* Will display a list of all the entries */}
      {/* Visuzalization options : icons for Filter, Sort, Group */}
        {/* When clicking on filter populate associated fields based on the selected object */}
        {/* when clickign on Sort populate associated fields based on the object */}
        {/* Same for Grouping */}
      {/* Filter removes entries based on criteria */}
      {/* Sort changes the order based on a field */}

      {/* Later Add Plotting, Choose X axis and Choose Y axis */}

    </View>
  )
}

export default viewData

const styles = StyleSheet.create({})
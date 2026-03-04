import React, { useState } from 'react'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { Chip, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import UnitToggle from '../../components/UnitToggle'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

type Day = typeof DAYS[number]

const AddTraining = () => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [teamName, setTeamName] = useState('')
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDays, setSelectedDays] = useState<Set<Day>>(new Set())
  const [note, setNote] = useState('')

  const toggleDay = (day: Day) => {
    setSelectedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }

  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name */}
      <Row label="Name">
        <TextInput
          mode="outlined"
          value={name}
          onChangeText={setName}
          style={styles.input}
          dense
        />
      </Row>

      {/* Team Name */}
      <Row label="Team Name">
        <TextInput
          mode="outlined"
          value={teamName}
          onChangeText={setTeamName}
          style={styles.input}
          dense
        />
      </Row>

      {/* Date */}
      <Row label="Date">
        <TouchableRipple
          onPress={() => setShowDatePicker(prev => !prev)}
          style={[styles.dateTouchable, { borderColor: theme.colors.outline }]}
          borderless={false}
        >
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableRipple>
      </Row>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(_, selected) => {
            if (Platform.OS !== 'ios') setShowDatePicker(false)
            if (selected) setDate(selected)
          }}
          style={styles.datePicker}
        />
      )}

      {/* Days Picker */}
      <Row label="Days">
        <View style={styles.chipsRow}>
          {DAYS.map(day => {
            const active = selectedDays.has(day)
            return (
              <Chip
                key={day}
                selected={active}
                onPress={() => toggleDay(day)}
                style={[styles.chip, active && { backgroundColor: theme.colors.primary }]}
                selectedColor={active ? theme.colors.onPrimary : undefined}
                textStyle={active ? { color: theme.colors.onPrimary } : undefined}
                compact
              >
                {day}
              </Chip>
            )
          })}
        </View>
      </Row>

      {/* Unit Toggle */}
      <Row label="Unit">
        <View style={styles.toggleWrapper}>
          <UnitToggle />
        </View>
      </Row>

      {/* Note */}
      <Row label="Note" alignTop>
        <TextInput
          mode="outlined"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          style={styles.input}
        />
      </Row>
    </ScrollView>
  )
}

function Row({
  label,
  children,
  alignTop = false,
}: {
  label: string
  children: React.ReactNode
  alignTop?: boolean
}) {
  return (
    <View style={[styles.row, alignTop && styles.rowTop]}>
      <Text variant="labelLarge" style={styles.label}>
        {label}
      </Text>
      <View style={styles.inputWrapper}>{children}</View>
    </View>
  )
}

export default AddTraining

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
  },
  rowTop: {
    alignItems: 'flex-start',
    paddingTop: 8,
  },
  label: {
    width: 90,
    flexShrink: 0,
  },
  inputWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
  },
  dateTouchable: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateText: {
    fontSize: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    marginBottom: 2,
  },
  toggleWrapper: {
    flex: 1,
  },
  datePicker: {
    alignSelf: 'stretch',
  },
})

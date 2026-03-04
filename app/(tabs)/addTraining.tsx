import React, { useCallback, useMemo, useState } from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Chip, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import UnitToggle from '../../components/UnitToggle'

// DateTimePicker is not supported on web
const DateTimePicker =
  Platform.OS !== 'web'
    ? require('@react-native-community/datetimepicker').default
    : null

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

  const toggleDay = useCallback((day: Day) => {
    setSelectedDays(prev => {
      const next = new Set(prev)
      next.has(day) ? next.delete(day) : next.add(day)
      return next
    })
  }, [])

  const onDateChange = useCallback((_: unknown, selected?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (selected) setDate(selected)
  }, [])

  const formattedDate = useMemo(
    () => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    [date],
  )

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
      {showDatePicker && Platform.OS === 'web' && (
        <input
          type="date"
          value={date.toISOString().split('T')[0]}
          onChange={e => {
            setShowDatePicker(false)
            if (e.target.value) setDate(new Date(e.target.value + 'T00:00:00'))
          }}
          onBlur={() => setShowDatePicker(false)}
          autoFocus
          style={{
            backgroundColor: theme.colors.surface,
            color: theme.colors.onSurface,
            border: `1px solid ${theme.colors.outline}`,
            borderRadius: 4,
            padding: '8px 12px',
            fontSize: 14,
            width: '100%',
            boxSizing: 'border-box' as const,
            colorScheme: theme.dark ? 'dark' : 'light',
          }}
        />
      )}
      {showDatePicker && Platform.OS === 'android' && DateTimePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />
      )}
      {Platform.OS === 'ios' && DateTimePicker && (
        <Modal transparent visible={showDatePicker} animationType="fade">
          <Pressable style={styles.modalBackdrop} onPress={() => setShowDatePicker(false)}>
            <Pressable style={[styles.modalCard, { backgroundColor: theme.colors.surface }]}>
              <DateTimePicker value={date} mode="date" display="inline" onChange={onDateChange} />
            </Pressable>
          </Pressable>
        </Modal>
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
        <UnitToggle />
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    alignSelf: 'stretch',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
})

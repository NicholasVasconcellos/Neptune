import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Modal, Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Button, Chip, Divider, IconButton, Text, TextInput, TouchableRipple, useTheme } from 'react-native-paper'
import UnitToggle from '../../components/UnitToggle'
import Typeahead from '../../components/Typeahead'
import { getData, postData } from '../../utils/backendData'
import { alertLog } from '../../utils/alertLog'

// DateTimePicker is not supported on web
const DateTimePicker =
  Platform.OS !== 'web'
    ? require('@react-native-community/datetimepicker').default
    : null

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

type Day = typeof DAYS[number]

const ENERGY_SYSTEMS: { label: string; value: number }[] = [
  { label: 'N1', value: 1 },
  { label: 'N2', value: 2 },
  { label: 'N3', value: 3 },
  { label: 'N4', value: 4 },
]

type Exercise = {
  id: number
  name: string
  distance: string
  repetitions: string
  interval: string       // mm:ss format
  energySystem: number | null
  note: string
  totalDistance: string  // display-only, calculated client-side
  totalTime: string      // display-only, calculated client-side
}

function parseInterval(mmss: string): number | null {
  if (!mmss.trim()) return null
  const parts = mmss.split(':')
  if (parts.length !== 2) return null
  const mm = parseInt(parts[0], 10)
  const ss = parseInt(parts[1], 10)
  if (isNaN(mm) || isNaN(ss)) return null
  return mm * 60 + ss
}

let nextExerciseId = 1

const AddTraining = () => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [teamId, setTeamId] = useState<number | null>(null)
  const [teams, setTeams] = useState<Record<string, any>[]>([])
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDays, setSelectedDays] = useState<Set<Day>>(new Set())
  const [note, setNote] = useState('')
  const [showNote, setShowNote] = useState(false)
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getData('Teams').then(setTeams).catch(() => {})
  }, [])

  const addExercise = useCallback(() => {
    setExercises(prev => [
      ...prev,
      {
        id: nextExerciseId++,
        name: '',
        distance: '',
        repetitions: '',
        interval: '',
        energySystem: null,
        note: '',
        totalDistance: '',
        totalTime: '',
      },
    ])
  }, [])

  const updateExercise = useCallback((id: number, field: keyof Exercise, value: string | number | null) => {
    setExercises(prev =>
      prev.map(ex => (ex.id === id ? { ...ex, [field]: value } : ex)),
    )
  }, [])

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

  const saveTraining = useCallback(async () => {
    if (!name.trim()) {
      alertLog('Validation', 'Training name is required.')
      return
    }

    setSaving(true)
    try {
      const [training] = await postData('Trainings', {
        Name: name.trim(),
        Notes: note.trim() || null,
        Team: teamId ?? null,
        Date: date.toISOString().split('T')[0],
        Days: JSON.stringify([...selectedDays]),
      })

      if (exercises.length > 0) {
        await Promise.all(
          exercises.map(ex =>
            postData('Exercises', {
              Name: ex.name.trim(),
              Distance: ex.distance ? parseInt(ex.distance, 10) : null,
              Repetitions: ex.repetitions ? parseInt(ex.repetitions, 10) : null,
              Interval: parseInterval(ex.interval),
              'Energy System': ex.energySystem ?? null,
              Note: ex.note.trim() || null,
              Training: training.id,
            }),
          ),
        )
      }

      alertLog('Saved', 'Training saved successfully.')
      // Reset form
      setName('')
      setTeamId(null)
      setDate(new Date())
      setSelectedDays(new Set())
      setNote('')
      setShowNote(false)
      setExercises([])
    } catch (e: any) {
      alertLog('Error', e.message)
    } finally {
      setSaving(false)
    }
  }, [name, note, teamId, date, selectedDays, exercises])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Compact Header */}
      {/* Training Name - full width prominent input */}
      <TextInput
        mode="outlined"
        value={name}
        onChangeText={setName}
        placeholder="Training name"
        style={styles.nameInput}
      />

      {/* Row 1: Team + Date */}
      <View style={styles.headerRow}>
        <View style={styles.teamWrapper}>
          <Typeahead
            array={teams}
            propertyName="Name"
            placeholderText="Team..."
            allowsNew={false}
            showOnEmpty
            onSelect={item => setTeamId(item.id)}
            onChangeText={text => { if (!text.trim()) setTeamId(null) }}
          />
        </View>
        <TouchableRipple
          onPress={() => setShowDatePicker(prev => !prev)}
          style={[styles.dateTouchable, { borderColor: theme.colors.outline }]}
          borderless={false}
        >
          <Text style={styles.dateText}>{formattedDate}</Text>
        </TouchableRipple>
      </View>

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

      {/* Row 2: Days + Unit + Add Note */}
      <View style={styles.headerRow}>
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
        <View style={styles.headerActions}>
          <UnitToggle />
          <IconButton
            icon={showNote ? 'note-text' : 'note-text-outline'}
            size={20}
            onPress={() => setShowNote(prev => !prev)}
            style={styles.noteIconButton}
          />
        </View>
      </View>

      {/* Collapsible Note */}
      {showNote && (
        <TextInput
          mode="outlined"
          value={note}
          onChangeText={setNote}
          placeholder="Training note..."
          multiline
          numberOfLines={3}
          style={styles.noteInput}
        />
      )}

      <Divider style={styles.divider} />

      {/* Exercises */}
      <Text variant="titleMedium" style={styles.sectionTitle}>Exercises</Text>

      {exercises.map((ex, index) => (
        <View key={ex.id} style={[styles.exerciseCard, { borderColor: theme.colors.outlineVariant }]}>
          <Text variant="labelMedium" style={styles.exerciseIndex}>Exercise {index + 1}</Text>
          <View style={styles.exerciseGrid}>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Name</Text>
              <TextInput
                mode="outlined"
                value={ex.name}
                onChangeText={v => updateExercise(ex.id, 'name', v)}
                dense
              />
            </View>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Distance</Text>
              <TextInput
                mode="outlined"
                value={ex.distance}
                onChangeText={v => updateExercise(ex.id, 'distance', v)}
                keyboardType="numeric"
                dense
              />
            </View>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Repetitions</Text>
              <TextInput
                mode="outlined"
                value={ex.repetitions}
                onChangeText={v => updateExercise(ex.id, 'repetitions', v)}
                keyboardType="numeric"
                dense
              />
            </View>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Interval (mm:ss)</Text>
              <TextInput
                mode="outlined"
                value={ex.interval}
                onChangeText={v => updateExercise(ex.id, 'interval', v)}
                placeholder="00:00"
                keyboardType="numeric"
                dense
              />
            </View>

            <View style={[styles.exerciseCell, styles.exerciseCellFull]}>
              <Text variant="labelSmall" style={styles.cellLabel}>Energy System</Text>
              <View style={styles.chipsRow}>
                {ENERGY_SYSTEMS.map(es => {
                  const active = ex.energySystem === es.value
                  return (
                    <Chip
                      key={es.value}
                      selected={active}
                      onPress={() => updateExercise(ex.id, 'energySystem', active ? null : es.value)}
                      style={[styles.chip, active && { backgroundColor: theme.colors.primary }]}
                      selectedColor={active ? theme.colors.onPrimary : undefined}
                      textStyle={active ? { color: theme.colors.onPrimary } : undefined}
                      compact
                    >
                      {es.label}
                    </Chip>
                  )
                })}
              </View>
            </View>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Total Distance</Text>
              <TextInput
                mode="outlined"
                value={ex.totalDistance}
                onChangeText={v => updateExercise(ex.id, 'totalDistance', v)}
                keyboardType="numeric"
                dense
              />
            </View>

            <View style={styles.exerciseCell}>
              <Text variant="labelSmall" style={styles.cellLabel}>Total Time</Text>
              <TextInput
                mode="outlined"
                value={ex.totalTime}
                onChangeText={v => updateExercise(ex.id, 'totalTime', v)}
                dense
              />
            </View>

            <View style={[styles.exerciseCell, styles.exerciseCellFull]}>
              <Text variant="labelSmall" style={styles.cellLabel}>Note</Text>
              <TextInput
                mode="outlined"
                value={ex.note}
                onChangeText={v => updateExercise(ex.id, 'note', v)}
                dense
              />
            </View>

          </View>
        </View>
      ))}

      <Button
        mode="outlined"
        icon="plus"
        onPress={addExercise}
        style={styles.addExerciseButton}
      >
        Add Exercise
      </Button>

      <Divider style={styles.divider} />

      <Button
        mode="contained"
        onPress={saveTraining}
        loading={saving}
        disabled={saving}
        style={styles.saveButton}
      >
        Save Training
      </Button>
    </ScrollView>
  )
}

export default AddTraining

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 6,
  },
  nameInput: {
    fontSize: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  teamWrapper: {
    flex: 1,
    minWidth: 120,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  noteIconButton: {
    margin: 0,
  },
  noteInput: {
    width: '100%',
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
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  exerciseCard: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    gap: 8,
  },
  exerciseIndex: {
    opacity: 0.6,
    marginBottom: 4,
  },
  exerciseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exerciseCell: {
    minWidth: 120,
    flex: 1,
    gap: 2,
  },
  exerciseCellFull: {
    minWidth: '100%',
    flexBasis: '100%',
  },
  cellLabel: {
    opacity: 0.6,
  },
  addExerciseButton: {
    marginTop: 4,
    marginBottom: 4,
  },
  saveButton: {
    marginBottom: 16,
  },
})

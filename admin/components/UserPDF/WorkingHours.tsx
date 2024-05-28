import { DAY_OF_WEEK } from '@/constants/common'
import { StyleSheet, Text, View } from '@react-pdf/renderer'
import { WorkingHoursProps } from '../WorkHours'

const WorkingHours = ({
  workingHours = {},
}: {
  workingHours: WorkingHoursProps
}) => {
  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
    },
    header_wrapper: {
      display: 'flex',
      flexDirection: 'row',
    },
    header_item_wrapper: {
      width: 36,
      height: 20,
      textAlign: 'center',
      backgroundColor: '#F5F6F8',
      border: '1px solid #D8D8D8',
    },
    hour_item_wrapper: {
      width: 36,
    },
    cell_wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: 24,
      border: '1px solid #D8D8D8',
    },
    hour: {
      height: 12,
      width: 12,
      backgroundColor: '#3D3D3D',
      borderRadius: '50%',
    },
  })

  return (
    <View style={styles.wrapper}>
      <View style={styles.header_wrapper}>
        {[{ label: '' }, ...DAY_OF_WEEK].map(({ label }, index) => (
          <View key={index} style={styles.header_item_wrapper}>
            <Text>{label}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <View style={styles.hour_item_wrapper}>
          <View style={{ ...styles.cell_wrapper, backgroundColor: '#F5F6F8' }}>
            <Text>午前</Text>
          </View>
          <View style={{ ...styles.cell_wrapper, backgroundColor: '#F5F6F8' }}>
            <Text>午後</Text>
          </View>
        </View>
        <WorkHourItem time={workingHours?.monday} styles={styles} />
        <WorkHourItem time={workingHours?.tuesday} styles={styles} />
        <WorkHourItem time={workingHours?.wednesday} styles={styles} />
        <WorkHourItem time={workingHours?.thursday} styles={styles} />
        <WorkHourItem time={workingHours?.friday} styles={styles} />
        <WorkHourItem time={workingHours?.saturday} styles={styles} />
        <WorkHourItem time={workingHours?.sunday} styles={styles} />
      </View>
      <Text>{workingHours?.note}</Text>
    </View>
  )
}

const WorkHourItem = ({
  time = [],
  styles,
}: {
  time?: ('am' | 'pm')[]
  styles: { [key: string]: any }
}) => {
  return (
    <View style={styles.hour_item_wrapper}>
      <View style={styles.cell_wrapper}>
        {time?.includes('am') && <View style={styles.hour}></View>}
      </View>
      <View style={styles.cell_wrapper}>
        {time?.includes('pm') && <View style={styles.hour}></View>}
      </View>
    </View>
  )
}

export default WorkingHours

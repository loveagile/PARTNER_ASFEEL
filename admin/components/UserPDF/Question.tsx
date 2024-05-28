import { Text, View } from '@react-pdf/renderer'

type QuestionProps = {
  questionsForPrefectureDisplay: {
    [key: string]: {
      question: string
      answer: string
    }
  }
}

const Question = ({ questionsForPrefectureDisplay }: QuestionProps) => {
  return (
    <View>
      {Object.entries(questionsForPrefectureDisplay).map(([key, value]) => (
        <QuestionItem
          key={key}
          prefecture={key || ''}
          question={value?.question || ''}
          answer={value?.answer || ''}
        />
      ))}
    </View>
  )
}

const QuestionItem = ({
  prefecture,
  question,
  answer,
}: {
  prefecture: string
  question: string
  answer: string
}) => {
  return (
    <View
      style={{
        marginBottom: 12,
      }}
    >
      <Text>{prefecture}</Text>
      <View
        style={{
          border: '1px solid #D8D8D8',
          marginTop: '4px',
        }}
      >
        <View
          style={{
            padding: '4px 8px',
            backgroundColor: '#EFEFEF',
            borderBottom: '1px solid #D8D8D8',
          }}
        >
          <Text>{question}</Text>
        </View>
        <View
          style={{
            padding: '4px 8px',
          }}
        >
          <Text>{answer}</Text>
        </View>
      </View>
    </View>
  )
}

export default Question

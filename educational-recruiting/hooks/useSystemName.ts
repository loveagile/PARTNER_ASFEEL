import { useAppSelector } from '@/store'
import { useState, useEffect } from 'react'

function useSystemName() {
  const [systemNameWithNewline, setSystemNameWithNewline] = useState('スポーツ・カルチャー人材バンク')
  const [systemNameWithoutNewline, setSystemNameWithoutNewline] = useState('スポーツ・カルチャー人材バンク')
  const { subDomainPref } = useAppSelector((state) => state.global)

  useEffect(() => {
    if (subDomainPref) {
      setSystemNameWithNewline(`${subDomainPref}\nスポーツ・カルチャー人材バンク`)
      setSystemNameWithoutNewline(`${subDomainPref}スポーツ・カルチャー人材バンク`)
    }
  }, [subDomainPref])

  return {
    logo: systemNameWithNewline,
    logoWithoutNewLine: systemNameWithoutNewline,
  }
}

export default useSystemName

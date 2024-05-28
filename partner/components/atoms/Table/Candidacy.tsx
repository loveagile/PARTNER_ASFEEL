import { IoMdPerson } from 'react-icons/io'

interface CandidacyProps {
  status: 'On' | 'Off'
}

const Candidacy: React.FC<CandidacyProps> = ({ status }) => {
  return (
    <div className={`text-[18px] ${status === 'On' ? 'text-core-sky' : 'text-gray-gray'}`}>
      <IoMdPerson />
    </div>
  )
}

export default Candidacy

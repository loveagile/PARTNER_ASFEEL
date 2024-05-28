import { MdEditNote } from 'react-icons/md'

export const EditNoteIcon = ({ isActive, ...rest }: { isActive?: boolean }) => {
  return (
    <MdEditNote
      style={{
        fontSize: 24,
      }}
      {...rest}
    />
  )
}

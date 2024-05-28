import { AiOutlineFile } from 'react-icons/ai'

interface FileIconProps {
  extension: string
}

const FileIcon: React.FC<FileIconProps> = ({ extension }) => {
  let ext = extension.toUpperCase()
  switch (ext) {
    case 'PDF':
      return <img src="/images/icons/pdf.svg" alt="" />
    case 'XLS':
      return <img src="/images/icons/xlsx.svg" alt="" />
    case 'XLSX':
      return <img src="/images/icons/xlsx.svg" alt="" />
    case 'DOC':
      return <img src="/images/icons/docx.svg" alt="" />
    case 'DOCX':
      return <img src="/images/icons/docx.svg" alt="" />
    case 'PPT':
      return <img src="/images/icons/pptx.svg" alt="" />
    case 'PPTX':
      return <img src="/images/icons/pptx.svg" alt="" />
    case 'PNG':
      return <img src="/images/icons/png.svg" alt="" />
    case 'JPG':
      return <img src="/images/icons/jpg.svg" alt="" />
    default:
      return <AiOutlineFile size={20} className="text-gray-gray" />
  }
}

export default FileIcon

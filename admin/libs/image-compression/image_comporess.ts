import imageCompression from 'browser-image-compression'

export const appImageCompress = async ({
  file,
  maxSizeMB = 0.1,
  maxWidthOrHeight = 150,
}: {
  file: File
  maxSizeMB?: number
  maxWidthOrHeight?: number
}) => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
  }

  const compressedFile = await imageCompression(file, options)
  return compressedFile
}

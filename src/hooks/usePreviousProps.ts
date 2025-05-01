import { useEffect, useRef } from 'react'

export default function usePreviousProps(id: string, position: [number, number]) {
  const prevRef = useRef<Map<string, string>>(new Map<string, string>())
  const prevIdRef = useRef<Map<string, string>>(new Map<string, string>())

  useEffect(() => {
    const positionKey = `${position[0]},${position[1]}`
    const currentMap = prevRef.current
    const currentPrevIdMap = prevIdRef.current
    const previousId = currentMap.get(positionKey) // Lưu ID trước đó

    if (previousId !== id && previousId !== undefined) {
      currentPrevIdMap.set(positionKey, previousId) // Lưu previousId
    } else if (previousId === undefined) {
      currentPrevIdMap.delete(positionKey) // Xóa nếu không có tile trước đó
    }
    currentMap.set(positionKey, id) // Cập nhật ID mới

    return () => {
      currentMap.delete(positionKey)
      currentPrevIdMap.delete(positionKey)
    }
  }, [id, position])

  const positionKey = `${position[0]},${position[1]}`
  return prevIdRef.current.get(positionKey) // Trả về previousId
}

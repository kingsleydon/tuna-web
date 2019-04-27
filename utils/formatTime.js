export const formatTime = second => {
  const date = new Date(null)
  date.setSeconds(second)
  return date.toISOString().substring(14, 19)
}

export const formatTime = second => {
  try {
    const date = new Date(null)
    date.setSeconds(second)
    return date.toISOString().substring(14, 19)
  } catch (err) {
    return '00:00'
  }
}

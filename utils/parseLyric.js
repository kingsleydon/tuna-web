export const parseLyric = (lyric, offset = 0) =>
  lyric.split('\n').map(line => {
    const [timestamp, text] = line.slice(1).split(']')
    const [minutes, seconds] = timestamp.split(':').map(Number)

    return {
      time: minutes * 60 + seconds + offset,
      text,
    }
  })

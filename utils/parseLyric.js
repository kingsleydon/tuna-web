export const parseLyric = (lyric, offset = 0) =>
  lyric.split('\n').map(line => {
    const [timestamp, text] = line.slice(1).split(']')
    const [minutes, seconds] = timestamp.split(':').map(Number)

    return {
      time: minutes * 60 + seconds + offset,
      text,
    }
  })

export const parseLrcx = (lyric, offset = 0) => {
  return lyric.split('\n').reduce((accumulator, currentValue, index, array) => {
    if (index / 2 === 0) {
      return accumulator
    }

    const [timestamp, text] = array[index - 1].slice(1).split(']')
    const [minutes, seconds] = timestamp.split(':').map(Number)
    const wordTime = currentValue
      .match(/<\d+,\d+>/g)
      .map(item => parseInt(item.replace(/<\d+,(\d+)>/, '$1'), 10) / 1000)

    return accumulator.concat([
      {
        time: minutes * 60 + seconds + offset,
        text,
        wordTime,
      },
    ])
  }, [])
}

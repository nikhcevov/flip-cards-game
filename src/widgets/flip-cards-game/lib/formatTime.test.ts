import { formatTime } from './formatTime'

describe('formatTime', () => {
  it('should format time correctly for full minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00')
    expect(formatTime(59)).toBe('0:59')
    expect(formatTime(60)).toBe('1:00')
    expect(formatTime(61)).toBe('1:01')
    expect(formatTime(3599)).toBe('59:59')
    expect(formatTime(3600)).toBe('60:00')
  })

  it('should format time correctly for more than an hour', () => {
    expect(formatTime(3661)).toBe('61:01')
    expect(formatTime(7322)).toBe('122:02')
  })
})

import { shuffleArray } from './shuffleArray'

describe('shuffleArray', () => {
  it('should shuffle the array elements', () => {
    const array = [1, 2, 3, 4, 5]
    const originalArray = [...array]
    shuffleArray(array)
    expect(array).not.toEqual(originalArray)
    expect(array.sort()).toEqual(originalArray.sort())
  })

  it('should handle an empty array', () => {
    const array: number[] = []
    shuffleArray(array)
    expect(array).toEqual([])
  })

  it('should handle an array with one element', () => {
    const array = [1]
    shuffleArray(array)
    expect(array).toEqual([1])
  })

  it('should handle an array with two elements', () => {
    const array = [1, 2]
    const originalArray = [...array]
    shuffleArray(array)
    expect(array.sort()).toEqual(originalArray.sort())
  })
})


import { LineDirections } from '../constant/interfaces'
import { RectCreator } from './rect-creator'
import {defaultSectors, sectorIndex} from '../helper-fns/helper-fn'

describe('test rect-creator methods', () => {
    test('get start point function', () => {
        const points1 = {
           
            '1-1': {
                utmost: true,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return   {dir: LineDirections.right, neighbor: '2-1'}
                        }
                        return d
                    })
                }
            },
            '2-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return {dir: LineDirections.right, neighbor: '3-1'}
                        }
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '1-1'}
                        }
                        return d
                    })
                }
            },
            '3-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '2-1'}
                        }
                        if (d.dir === LineDirections.right) {
                            return {dir: LineDirections.right, neighbor: '4-1'}
                        }
                        return d
                    })
                }
            },
            '4-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '3-1'}
                        }
                        if (d.dir === LineDirections.bottom) {
                            return {dir: LineDirections.left, neighbor: '4-2'}
                        }
                        return d
                    })
                }
            },
            '4-2': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.top) {
                            return {dir: LineDirections.top, neighbor: '4-1'}
                        }
                        if (d.dir === LineDirections.bottom) {
                            return {dir: LineDirections.bottom, neighbor: '4-3'}
                        }
                        return d
                    })
                }
            },
            '4-3': {
                utmost: false,
                connections: { 
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.top) {
                            return {dir: LineDirections.top, neighbor: '4-2'}
                        }
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '3-3'}
                        }
                        return d
                    })
                }
            },
            '3-3': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return {dir: LineDirections.right, neighbor: '4-3'}
                        }
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '2-3'}
                        }
                        return d
                    })
                }
            },
            '2-3': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return {dir: LineDirections.right, neighbor: '3-3'}
                        }
                        if (d.dir === LineDirections.top) {
                            return {dir: LineDirections.top, neighbor: '2-2'}
                        }
                        return d
                    })
                }
            },
            '2-2': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.bottom) {
                            return  {dir: LineDirections.bottom, neighbor: '2-3'}
                        }
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '1-2'}
                        }
                        return d
                    })                   
                }
            },
            '1-2': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return  {dir: LineDirections.right, neighbor: '2-2'}
                        }
                        return d
                    })
                }
            },
        }

        const points2 = {
            '0-1': {
                utmost: true,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.right) {
                            return  {dir: LineDirections.right, neighbor: '1-1'}
                        }
                        return d
                    })
                }
            },
            '1-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '0-1'}
                        }
                        if (d.dir === LineDirections.right) {
                            return  {dir: LineDirections.right, neighbor: '2-1'}
                        }
                        return d
                    })
                }
                
            },
            '2-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '1-1'}
                        }
                        if (d.dir === LineDirections.right) {
                            return  {dir: LineDirections.right, neighbor: '3-1'}
                        }
                        return d
                    })
                }
            },
            '3-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '2-1'}
                        }
                        if (d.dir === LineDirections.right) {
                            return {dir: LineDirections.right, neighbor: '4-1'}
                        }
                        return d
                    })
                }
            },
            '4-1': {
                utmost: false,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.left) {
                            return {dir: LineDirections.left, neighbor: '3-1'}
                        }
                        if (d.dir === LineDirections.bottom) {
                            return {dir: LineDirections.bottom, neighbor: '4-2'}
                        }
                        return d
                    })
                }
            },
            '4-2': {
                utmost: true,
                connections: {
                    blue: defaultSectors().map(d => {
                        if (d.dir === LineDirections.top) {
                            return  {dir: LineDirections.top, neighbor: '4-1'}
                        }
                        return d
                    })
                   
                }
            }
        }
        const rectCR1 = new RectCreator({width: 6, height: 4})
        const rectCR2 = new RectCreator({width: 6, height: 4})
        rectCR1.addTakenPoints(points1)
        rectCR2.addTakenPoints(points2)
        // expect(rectCR1.getStartPoint('2-1', 'blue')[0]).toBe('1-1')
        // expect(rectCR1.getStartPoint('2-1', 'blue', '1-1')[0]).toBe('')
        // expect(rectCR1.getStartPoint('2-1', 'blue', '1-1').length).toBe(1)
        // expect(rectCR2.getStartPoint('2-1', 'blue').includes('4-2')).toBe(true)
        // expect(rectCR2.getStartPoint('2-1', 'blue').length).toBe(2)
        // expect(rectCR2.getStartPoint('2-1', 'blue').includes('1-1')).toBe(true)
        // console.log(rectCR1.takenPoints)
        expect(rectCR2.goToLinePoint('3-1', '4-1', 'blue', rectCR2.isUtmost)).toBe('0-1')
        expect(rectCR2.goToLinePoint('2-1', '1-1', 'blue', rectCR2.isUtmost)).toBe('4-2')
        expect(rectCR1.checkIfSameLinePoints('2-1', '2-2', 'blue')).toBe(true)
        expect(rectCR1.checkCircleLine('2-1', 'blue')).toBe(true)
        expect(rectCR1.checkCircleLine('2-2', 'blue')).toBe(true)
        expect(!!rectCR2.checkLineContinuity('0-1', 'blue')).toBe(true)
        expect(!!rectCR2.takenPoints['4-2']).toBe(true)
        rectCR2.deletePoint('4-2')
        expect(rectCR2.takenPoints['4-2']).toBe(undefined)
        expect(sectorIndex(LineDirections.right)).toBe(1)
        
    })
    const rect = new RectCreator({width: 6, height: 8})
    test('get direction', () => {
        expect(rect.determineDirection('1-2', '2-2')).toBe(LineDirections.right)
    }) 

})
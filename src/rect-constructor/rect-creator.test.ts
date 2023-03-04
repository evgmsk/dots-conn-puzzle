import {LineDirections} from '../constant/interfaces'
import {RectCreator} from './rect-creator'
import {defaultConnectionsWithColor, isDev, sectorIndex} from '../helper-fns/helper-fn'
import {DefaultColor} from "../constant/constants";


describe('test rect-creator methods', () => {
    test('get start point function', () => {
        const points1 = {
           
            '1-1': {
                utmost: true,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '2-1', color: 'blue'}
                }
            },
            '2-1': {
                utmost: false,
                connections:  {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '1-1', color: 'blue'},
                    [LineDirections.right]: {neighbor: '3-1', color: 'blue'}
                }
            },
            '3-1': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '2-1', color: 'blue'},
                    [LineDirections.right]: {neighbor: '4-1', color: 'blue'}
                }
            },
            '4-1': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '3-1', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '4-2', color: 'blue'}
                }
            },
            '4-2': {
                utmost: false,
                connections:{
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.top]: {neighbor: '4-1', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '4-3', color: 'blue'}
                }
            },
            '4-3': {
                utmost: false,
                connections:{
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '3-3', color: 'blue'},
                    [LineDirections.top]: {neighbor: '4-2', color: 'blue'}
                }
            },
            '3-3': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '4-3', color: 'blue'},
                    [LineDirections.left]: {neighbor: '2-3', color: 'blue'}
                }
            },
            '2-3': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '3-3', color: 'blue'},
                    [LineDirections.top]: {neighbor: '2-2', color: 'blue'}
                }
            },
            '2-2': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '1-2', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '2-3', color: 'blue'}
                }
            },
            '1-2': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '2-2', color: 'blue'},
                }
            },
        }

        const rectCR1 = new RectCreator({width: 6, height: 4})
        // const rectCR2 = new RectCreator({width: 6, height: 4})
        rectCR1.addTakenPoints(points1)
        // rectCR2.addTakenPoints(points2)
        expect(rectCR1.getStartPoint('2-1', '3-1')).toBe('1-1')
        expect(rectCR1.checkStartPointUtmost('2-2', '1-2')).toBe(true)
        expect(rectCR1.checkStartPointUtmost('3-1', '2-1')).toBe(false)
        expect(rectCR1.getStartPoint('3-1', '2-1')).toBe('1-2')
        expect(rectCR1.checkPointConnections('2-1', rectCR1.getPoint('2-1'))).toBe(true)
        expect(rectCR1.checkIfSameLinePoints('2-1', '2-2', 'blue').same).toBe(true)
        expect(rectCR1.getLineDirections('2-1', 'blue')).toEqual([LineDirections.left,
            LineDirections.right])
        // expect(rectCR1.checkCircleLine('2-2', 'blue')).toBe(true)
        // expect(!!rectCR2.checkLineContinuity('0-1', 'blue')).toBe(true)
        // expect(!!rectCR2.takenPoints['4-2']).toBe(true)
        // rectCR2.deletePoint('4-2')
        // expect(rectCR2.takenPoints['4-2']).toBe(undefined)
        expect(sectorIndex(LineDirections.right)).toBe(1)
        
    })
    const rect = new RectCreator({width: 6, height: 8})
    rect.addTakenPoints({
        '2-3': {
            utmost: true,
            connections: {
                ...defaultConnectionsWithColor(),
                [LineDirections.right]: {color: DefaultColor, neighbor: '3-3'}
            }
        },
        '3-3': {
            utmost: false,
            connections: {
                ...defaultConnectionsWithColor(),
                [LineDirections.left]: {color: DefaultColor, neighbor: '2-3'}
            },

        }
    })
    test('get direction', () => {
        expect(rect.determineDirection('1-2', '2-2')).toBe(LineDirections.right)
        expect(rect.tryContinueLine('4-4', '3-3', DefaultColor)).toBe('3-4' || '4-3')
        rect.clearAll()
        rect.addTakenPoints({
            '2-3': {
                utmost: true,
                connections: {
                    ...defaultConnectionsWithColor(),
                    [LineDirections.right]: {color: DefaultColor, neighbor: '3-3'}
                }
            },
            '3-3': {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor(),
                    [LineDirections.left]: {color: DefaultColor, neighbor: '2-3'}
                },

            }
        })
        expect(rect.tryContinueLine('4-2', '3-3', DefaultColor)).toBe('3-2' || '2-3')
    }) 
    test('builder', () => {
        const point = {
            utmost: true,
            connections: {
                [LineDirections.top]: {color: 'red', neighbor: '1-1'},
                [LineDirections.bottom]: {color: 'red', neighbor: '1-3'},
                [LineDirections.left]: {color: 'blue', neighbor: '0-2'},
                [LineDirections.right]: {color: 'blue', neighbor: '2-2'},
            }
        }
        // console.warn(rect.prepareUtmostPointForResolver(point))
        expect(rect.prepareUtmostPointForResolver(point).crossLine?.length).toBe(2)
        // console.log(process.env)
        expect(isDev()).toBe(true)
    })
})

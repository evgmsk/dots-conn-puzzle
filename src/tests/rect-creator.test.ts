import {IEndpoints, IEndpointsValue, LineDirections} from '../constant/interfaces'
import {pC, RectCreator} from '../puzzle-engine/rect-creator'
import {defaultConnectionsWithColor, isDev, sectorIndex} from '../utils/helper-fn'
import {DefaultColor, LineColors} from "../constant/constants";


describe('test rect-creator methods', () => {

    test('interfering lines', () => {
        const rectCR0 = new RectCreator({width: 3, height: 3})
        const line1 = {
            "pairKey": "0-0_2-0",
            "coords1": [
                0,
                0
            ],
            "coords2": [
                2,
                0
            ],
            "intervals": {
                "x": -2,
                "y": 0
            },
            meddling: 0,
            color: LineColors[4],
            line: ['0-0', '2-0']
        }
        const line2 = {
            "pairKey": "1-2_1-0",
            "coords1": [
                1,
                2
            ],
            "coords2": [
                1,
                0
            ],
            "intervals": {
                "x": 0,
                "y": 2
            },
            meddling: 0,
            color: LineColors[3],
            line: ['1-2', '1-0']
        }
        expect(rectCR0.twoLinesInterfering(line1, line2)).toBe(4)
    })
    test('auto resolve', () => {
        const puzz = pC
    })
    test('get start point function', () => {
        const points0 = {
            '0-0': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor('green'),
                    [LineDirections.right]: {neighbor: '1-0', color: 'green'}
                }
            },
            '1-0': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('green'),
                    [LineDirections.left]: {neighbor: '0-0', color: 'green'},
                    [LineDirections.bottom]: {neighbor: '1-1', color: 'green'}
                }
            },
            '1-1': {
                endpoint: true,
                crossLine: ['red', 'green'],
                connections: {
                    [LineDirections.top]: {neighbor: '1-0', color: 'green'},
                    [LineDirections.right]: {neighbor: '2-1', color: 'red'},
                    [LineDirections.left]: {neighbor: '0-1', color: 'red'},
                    [LineDirections.bottom]: {neighbor: '1-2', color: 'green'}
                }
            },
            '1-2': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('green'),
                    [LineDirections.top]: {neighbor: '1-1', color: 'green'},
                    [LineDirections.bottom]: {neighbor: '1-3', color: 'green'}
                }
            },
            '1-3': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor('green'),
                    [LineDirections.top]: {neighbor: '1-2', color: 'green'},
                }
            },
        }
        const points1 = {
            '1-1': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '2-1', color: 'blue'}
                }
            },
            '2-1': {
                endpoint: false,
                connections:  {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '1-1', color: 'blue'},
                    [LineDirections.right]: {neighbor: '3-1', color: 'blue'}
                }
            },
            '3-1': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '2-1', color: 'blue'},
                    [LineDirections.right]: {neighbor: '4-1', color: 'blue'}
                }
            },
            '4-1': {
                endpoint: true,
                crossLine: ['blue', 'red'],
                connections: {
                    ...defaultConnectionsWithColor(DefaultColor),
                    [LineDirections.right]: {neighbor: '3-1', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '4-2', color: 'blue'}
                }
            },
            '4-2': {
                endpoint: false,
                connections:{
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.top]: {neighbor: '4-1', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '4-3', color: 'blue'}
                }
            },
            '4-3': {
                endpoint: false,
                connections:{
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '3-3', color: 'blue'},
                    [LineDirections.top]: {neighbor: '4-2', color: 'blue'}
                }
            },
            '3-3': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '4-3', color: 'blue'},
                    [LineDirections.left]: {neighbor: '2-3', color: 'blue'}
                }
            },
            '2-3': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '3-3', color: 'blue'},
                    [LineDirections.top]: {neighbor: '2-2', color: 'blue'}
                }
            },
            '2-2': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.left]: {neighbor: '1-2', color: 'blue'},
                    [LineDirections.bottom]: {neighbor: '2-3', color: 'blue'}
                }
            },
            '1-2': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor('blue'),
                    [LineDirections.right]: {neighbor: '2-2', color: 'blue'},
                }
            },
        }

        const rectCR1 = new RectCreator({width: 6, height: 4})
        const rectCR0 = new RectCreator({width: 6, height: 4})
        rectCR1.addTakenPoints(points1)
        rectCR0.addTakenPoints(points0)

        expect(rectCR0.checkPoint('1-1').crossLine!.length).toBe(2)
        const line1 = rectCR1.getFullLineFromAnyPoint('1-1', 'blue', ['2-1'])
        // console.log(line1)
        const line2 = rectCR1.getFullLineFromAnyPoint('2-1', 'blue', ['1-1', '3-1'])
        // console.log(line2)
        expect(line2).toEqual(line1)
        expect(rectCR1.checkIfPointBelongsToLine(line1, '3-1').length).toBe(8)
        expect(rectCR1.checkIfPointsBelongToSameLine('3-1', '1-1', 'blue').length).toBe(10)
        expect(rectCR1.checkIfPointBelongsToLine(line1, '3-1', '41-1').length).toBe(8)

        expect(rectCR1.getFullLineFromAnyPoint('1-1', 'blue', ['2-1']).includes('2-2')).toBe(true)
        expect(rectCR1.getLineDirections('2-1', 'blue')).toEqual([LineDirections.left,
            LineDirections.right])
        expect(rectCR0.prepareEndpointForResolver(rectCR0.getPoint('1-1')).crossLine!.length).toBe(2)
        expect(sectorIndex(LineDirections.right)).toBe(1)
    })
    const rect = new RectCreator({width: 6, height: 8})
    rect.addTakenPoints({
        '2-3': {
            endpoint: true,
            connections: {
                ...defaultConnectionsWithColor(),
                [LineDirections.right]: {color: DefaultColor, neighbor: '3-3'}
            }
        },
        '3-3': {
            endpoint: false,
            connections: {
                ...defaultConnectionsWithColor(),
                [LineDirections.left]: {color: DefaultColor, neighbor: '2-3'}
            },

        }
    })
    test('line interfering', () => {
        const line1: IEndpointsValue = {
            coords1: [0, 3],
            coords2: [3, 0],
            intervals: {x: -3, y: 3},
            meddling: 0,
            color: LineColors[2],
            line: ['0-3', '3-0']
        }
        const line2 = {

        }
    })
    test('get direction', () => {
        expect(rect.determineDirection('1-2', '2-2')).toBe(LineDirections.right)
        // expect(rect.tryContinueLine('4-4', '3-3', DefaultColor)).toBe('3-4' || '4-3')
        rect.clearAll()
        rect.addTakenPoints({
            '2-3': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(),
                    [LineDirections.right]: {color: DefaultColor, neighbor: '3-3'}
                }
            },
            '3-3': {
                endpoint: false,
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
            endpoint: true,
            connections: {
                [LineDirections.top]: {color: 'red', neighbor: '1-1'},
                [LineDirections.bottom]: {color: 'red', neighbor: '1-3'},
                [LineDirections.left]: {color: 'blue', neighbor: '0-2'},
                [LineDirections.right]: {color: 'blue', neighbor: '2-2'},
            }
        }
        // console.warn(rect.prepareEndpointForResolver(point))
        expect(rect.prepareEndpointForResolver(point).crossLine?.length).toBe(2)
        // console.log(process.env)
        expect(isDev()).toBe(true)
    })
})


import {RectCreator} from '../puzzle-engine/rect-creator'
import {defaultConnectionsWithColor} from '../utils/helper-fn'
import {DefaultColor, LineColors} from "../constant/constants";

describe('test rect common methods', () => {

    const rect = new RectCreator({width: 4, height: 4})
    test('get free cells', () => {
        rect.addTakenPoints({'2-2': {
                endpoint: true,
                crossLine: [LineColors[1], LineColors[2]],
                connections: defaultConnectionsWithColor(DefaultColor)
            }})
        // expect(rect.getFreeCells(['3-3'], {}, [''], [], 'strict').length).toBe(0)
        // expect(rect.getFreeCells(['0-0'], {} , [''], [], 'strict').length).toBe(2)
        // expect(rect.getFreeCells(['1-1'],  rect.takenPoints, [''], LineColors.slice(1,2), 'strict').length).toBe(4)
        // expect(rect.getFreeCells(['1-1'], rect.takenPoints, [''], LineColors.slice(3,4), 'strict').length).toBe(2)
        // expect(rect.getFreeCells(['2-1'], rect.takenPoints, [''], LineColors.slice(1,2), 'strict'))
        //     .toEqual(['2-2'])
        // expect(rect.getFreeCells(['2-3'],{}, [''], [], 'strict').length).toBe(3)

    })
    test('get free cells2', () => {
        const rect = new RectCreator({width: 5, height: 5})
        rect.addTakenPoints({
            '2-2': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            },
            '2-1': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            },
            '1-2': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true,
                crossLine: [LineColors[1], LineColors[2]]
            }
        })
        // expect(rect.getFreeCells(['1-2'], rect.takenPoints, LineColors[1])).toBe([1])
        // expect(rect.getFreeCells(['1-1', '1-2'], rect.takenPoints, '3-3', LineColors.slice(1,2), 'strict')).toEqual(['0-2', '1-3'])
    })
    test('get distant test', () => {
        expect(rect.getDistantBetweenPoints('0-0', '1-1'))
            .toBeLessThan(rect.getDistantBetweenPoints('0-0', '2-2'))
        expect(rect.getDistantBetweenPoints('0-0', '1-1'))
            .toBe(rect.getDistantBetweenPoints('1-1', '2-2'))
        expect(rect.getDistantBetweenPoints('0-0', '1-1'))
            .toBe(rect.getDistantBetweenPoints('1-1', '2-0'))
        expect(rect.getDistantBetweenPoints('0-0', '3-3'))
            .toBeGreaterThan(rect.getDistantBetweenPoints('0-0', '3-0'))
        expect(rect.getDistantBetweenPoints('2-1', '3-2'))
            .toBeLessThan(rect.getDistantBetweenPoints('1-2', '3-2'))
    })
    test('find path resolver', () => {
        const rect = new RectCreator({width: 6, height: 6})
        const points = {
            '0-1': {
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {
                        color: LineColors[2], neighbor: '1-1'
                    }
                },
                endpoint: true,
            },
            '1-1': {
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'left': {
                        color: LineColors[2], neighbor: '0-1'
                    }
                },
                endpoint: false
            },
            '2-2': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            },
            '2-1': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            },
            '2-0': {
                connections: defaultConnectionsWithColor(DefaultColor),
                endpoint: true
            },
            '1-2': {
                connections: defaultConnectionsWithColor(LineColors[5]),
                endpoint: true,
                // crossLine: [LineColors[2], LineColors[3]]
            },
            '0-5': {
                connections: defaultConnectionsWithColor(LineColors[4]),
                endpoint: true,
            },
            '5-2': {
                connections: defaultConnectionsWithColor(LineColors[6]),
                endpoint: true,
            },
            '5-3': {
                connections: defaultConnectionsWithColor(LineColors[3]),
                endpoint: true,
            },
            '4-4': {
                connections: defaultConnectionsWithColor(LineColors[6]),
                endpoint: true,
            },
            '2-5': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true,
                crossLine: [LineColors[8], LineColors[2]]
            },
            '1-5': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true,
                crossLine: [LineColors[3], LineColors[2]]
            },
        }
        expect(rect.findPathResolver('1-1', '1-2', [DefaultColor])).toEqual([])
        expect(rect.findPath('1-1', '1-2', [DefaultColor], 'test').line).toEqual([])
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('1-1', '1-2', LineColors.slice(2,3))).toEqual([])
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('1-1', '1-3', LineColors.slice(2,3))).toEqual(["0-1", "0-2", "0-3"])
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('1-1', '2-3', LineColors.slice(2,3))).toEqual(["0-1", "0-2", "0-3", "1-3"])
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('1-1', '4-0', LineColors.slice(2,3), ).length).toEqual(9)
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('0-0', '4-0', LineColors.slice(2,3)).length).toEqual(0)
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('1-5', '3-5', LineColors.slice(2,3) ).length).toEqual(2)
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('0-5', '3-5', LineColors.slice(4,5), 'strict').length).toEqual(0)
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('0-5', '3-5', LineColors.slice(4,5))).toEqual( ["0-5", "0-4", "1-4", "2-4", "3-4"])
        rect.clearAll()
        rect.addTakenPoints(points)
        expect(rect.findPathResolver('5-3', '5-0', LineColors.slice(3,4), '').length).toEqual(5)

        const rect2 = new RectCreator({width: 7, height: 7})
        const point2 = {
            '0-0': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {color: LineColors[2], neighbor: '1-0'}
                }
            },
            '1-0': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {color: LineColors[2], neighbor: '2-0'},
                    'left': {color: LineColors[2], neighbor: '0-0'}
                }
            },
            '2-0': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {color: LineColors[2], neighbor: '3-0'},
                    'left': {color: LineColors[2], neighbor: '1-0'}
                }
            },
            '3-0': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'left': {color: LineColors[2], neighbor: '2-0'}
                }
            },
            '5-0': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[4])
                }
            },
            '1-1': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[9])
            },
            '2-2': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[9])
            },
            '3-1': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[8]),
                    'right': {color: LineColors[8], neighbor: '4-1'}
                }
            },
            '4-1': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[8]),
                    'left': {color: LineColors[8], neighbor: '3-1'}
                }
            }
        }
        const points4 = {
            '0-0': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {color: LineColors[2], neighbor: '1-0'}
                }
            },
            '1-0': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'bottom': {color: LineColors[2], neighbor: '1-1'},
                    'left': {color: LineColors[2], neighbor: '0-0'}
                }
            },
            '1-1': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'left': {color: LineColors[2], neighbor: '0-1'},
                    'top': {color: LineColors[2], neighbor: '1-0'}
                }
            },
            '0-1': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    'right': {color: LineColors[2], neighbor: '1-1'},
                }
            },
        }
        rect2.addTakenPoints(point2)
        expect(rect2.findPathResolver('3-0', '6-0', LineColors.slice(2,3), ''))
            .toEqual(["0-0", "1-0", "2-0", "3-0", "4-0", "4-1", "5-1", "6-1"])
        rect2.clearAll()
        rect2.addTakenPoints(point2)
        expect(rect2.findPathResolver('3-0', '6-0', LineColors.slice(2,3), ))
            .toEqual( ["0-0", "0-1", "0-2", "1-2", "1-3", "2-3", "3-3", "3-2", "4-2", "5-2", "5-1", "6-1"])
        rect2.clearAll()
        rect2.addTakenPoints(point2)
        expect(rect2.findPathResolver('3-0', '0-1', LineColors.slice(2,3))).toEqual(['0-0'])
        rect2.clearAll()
        rect2.addTakenPoints(point2)
        expect(rect2.findPathResolver('5-0', '5-1', LineColors.slice(4,5), '')).toEqual(['5-0'])

        const point3 = {
            '0-0': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[2]),
                    // 'right': {color: LineColors[2], neighbor: '1-0'}
                }
            },
            '1-1': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[5]),
                }
            },
            '1-2': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[6]),
                }
            },
            '0-3': {
                endpoint: true,
                connections: {
                    ...defaultConnectionsWithColor(LineColors[6]),
                    'right': {color: LineColors[6], neighbor: '1-3'}
                },
                joinPoint: [LineColors[2], LineColors[6]]
            },
        }
        rect2.clearAll()
        rect2.addTakenPoints(point3)
        // console.log(rect2.takenPoints)
        expect(rect2.findPathResolver('0-0', '0-3', LineColors.slice(2, 3), 'strict')).toEqual(["0-0", "0-1", "0-2"])
        rect2.clearAll()
        rect2.addTakenPoints(points4)
        rect2.findPathResolver('0-1', '0-2', LineColors.slice(2, 3))
        // console.log(rect2.takenPoints)
        expect(rect2.getPoint('1-1')).toBe(undefined)
    })
    test('meddling calc fn', () => {
        const rect = new RectCreator({width: 4, height: 6})
        rect.lineEndpoints = {
            "2-1_3-3": {
                "coords1": [
                    2,
                    1
                ],
                "coords2": [
                    3,
                    3
                ],
                "intervals": {
                    "x": -1,
                    "y": -2
                },
                "color": "purple",
                "meddling": 7.5208835226860025,
                "line": [
                    "2-1",
                    "3-3"
                ]
            },
            "3-0_3-3": {
                "coords1": [
                    3,
                    0
                ],
                "coords2": [
                    3,
                    3
                ],
                "intervals": {
                    "x": 0,
                    "y": -3
                },
                "color": "aqua",
                "meddling": 6.462961130059517,
                "line": [
                    "3-0",
                    "3-3"
                ]
            },
            "1-1_3-3": {
                "coords1": [
                    1,
                    1
                ],
                "coords2": [
                    3,
                    3
                ],
                "intervals": {
                    "x": -2,
                    "y": -2
                },
                "color": "yellow",
                "meddling": 10.527456232305497,
                "line": [
                    "1-1",
                    "3-3"
                ]
            },
            "2-2_1-4": {
                "coords1": [
                    2,
                    2
                ],
                "coords2": [
                    1,
                    4
                ],
                "intervals": {
                    "x": 1,
                    "y": -2
                },
                "color": "green",
                "meddling": 8.382310680559055,
                "line": [
                    "2-2",
                    "1-4"
                ]
            }
        }
        expect(rect.getPointMeddling('2-0', '')).toEqual(0)
        expect(rect.getPointMeddling('1-3', '')).toEqual(2)
        expect(rect.getPointMeddling('0-0', '')).toEqual(0)
    })
})


import {RectCreator} from '../puzzle-engine/rect-creator'
import {PuzzleResolver} from '../puzzle-engine/rect-resolver'
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
        // expect(rect.getFreeCells(['3-3'], {}, '', [], 'strict').length).toBe(0)
        // expect(rect.getFreeCells(['0-0'], {} , '', [], 'strict').length).toBe(2)
        // expect(rect.getFreeCells(['1-1'],  rect.takenPoints, '', LineColors.slice(1,2), 'strict').length).toBe(4)
        // expect(rect.getFreeCells(['1-1'], rect.takenPoints, '', LineColors.slice(3,4), 'strict').length).toBe(2)
        // expect(rect.getFreeCells(['2-1'], rect.takenPoints, '', LineColors.slice(1,2), 'strict'))
        //     .toEqual(['2-2'])
        // expect(rect.getFreeCells(['2-3'],{}, '', [], 'strict').length).toBe(3)

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
        // expect(rect.getFreeCells('1-2',['1-1', '1-2'], rect.takenPoints, LineColors[1])).toBe([1])
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
        expect(rect.getDistantBetweenPoints('2-1', '3-2', true))
            .toBeLessThan(rect.getDistantBetweenPoints('1-2', '3-2', true))
    })
    test('find path ', () => {
        const rect = new RectCreator({width: 6, height: 6})
        rect.addTakenPoints({
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
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true,
            },

            // '5-2': {
            //     connections: defaultConnectionsWithColor(LineColors[6]),
            //     endpoint: true,
            // },
            '4-4': {
                connections: defaultConnectionsWithColor(LineColors[6]),
                endpoint: true,
            },
            '2-5': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true,
                crossLine: [LineColors[1], LineColors[2]]
            }
        })
        const rect2 = new RectCreator({width: 7, height: 7})

        expect(rect.findPath('1-1', '1-2', [DefaultColor])).toEqual([])
        expect(rect.findPath('1-1', '1-2', LineColors.slice(2,3))).toEqual(['1-1'])
        expect(rect.findPath('1-1', '1-3', LineColors.slice(1,2)).length).toEqual(4)
        expect(rect.findPath('1-1', '2-3', LineColors.slice(1,2)).length).toEqual(5)
        expect(rect.findPath('1-1', '4-0', LineColors.slice(1,2), ).length).toEqual(10)
        expect(rect.findPath('0-0', '4-0', LineColors.slice(2,3)).length).toEqual(10)
        expect(rect.findPath('1-5', '3-5', LineColors.slice(2,3) ).length).toEqual(2)
        expect(rect.findPath('0-5', '3-5', LineColors.slice(4,5), 'strict').length).toEqual(0)
        expect(rect.findPath('0-5', '5-4', LineColors.slice(2,3), ).length).toEqual(6)
        expect(rect.findPath('0-2', '0-5', LineColors.slice(3,4), '').length).toEqual(3)
        expect(rect.findPath('0-5', '1-5', LineColors.slice(4,5), '')).toEqual(['0-5'])
        expect(rect.findPath('5-3', '5-0', LineColors.slice(3,4), '').length).toEqual(3)

    })
    // test('check line consistent', () => {
    //     const rect3 = new RectCreator({width: 5, height: 5})
    //     rect3.addTakenPoints({
    //         '0-0': {
    //             connections: {
    //                 ...defaultConnectionsWithColor(DefaultColor),
    //                 right: {color: DefaultColor, neighbor: '1-0'}
    //             },
    //             endpoint: true,
    //         },
    //         '1-0': {
    //             connections: {
    //                 ...defaultConnectionsWithColor(DefaultColor),
    //                 bottom: {color: DefaultColor, neighbor: '1-1'},
    //                 left: {color: DefaultColor, neighbor: '0-0'}
    //             },
    //             endpoint: false
    //         },
    //         '1-1': {
    //             connections: {
    //                 ...defaultConnectionsWithColor(DefaultColor),
    //                 top: {color: DefaultColor, neighbor: '1-0'}
    //             },
    //             endpoint: false
    //         }
    //     })
        // expect(rect3.checkLineConsistent('0-0', '2-2').length).toEqual(3)
        // expect(rect3.checkLineConsistent('0-0', '2-2')[2]).toEqual('1-1')
    // })

})

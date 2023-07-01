
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
        expect(rect.getFreeCells('3-3', []).length).toBe(0)
        expect(rect.getFreeCells('0-0', [], {}).length).toBe(2)
        expect(rect.getFreeCells('1-1', [], rect.takenPoints, LineColors[1]).length).toBe(4)
        expect(rect.getFreeCells('1-1', [], rect.takenPoints, LineColors[3]).length).toBe(2)
        expect(rect.getFreeCells('2-1', ['2-1'], rect.takenPoints, LineColors[1]))
            .toEqual(['2-2'])
        expect(rect.getFreeCells('2-3', [],{}).length).toBe(3)

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
        expect(rect.getFreeCells('1-2',['1-1', '1-2'], rect.takenPoints, LineColors[1])).toEqual(['0-2', '1-3'])
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
            '2-5': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true,
                crossLine: [LineColors[1], LineColors[2]]
            }
        })
        expect(rect.findPath('1-1', '1-2', DefaultColor)).toEqual([])
        expect(rect.findPath('1-1', '1-2', LineColors[2])).toEqual(['1-1'])
        expect(rect.findPath('1-1', '1-3', LineColors[1]).length).toEqual(4)
        expect(rect.findPath('1-1', '2-3', LineColors[1]).length).toEqual(5)
        expect(rect.findPath('1-1', '4-0', LineColors[1]).length).toEqual(10)
        expect(rect.findPath('0-0', '4-0', LineColors[2]).length).toEqual(10)
        expect(rect.findPath('1-5', '3-5', LineColors[2]).length).toEqual(2)

    })
})

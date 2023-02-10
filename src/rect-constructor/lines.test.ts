import { LinedRect } from './rect-constructor' 

describe('test lines', () => {
    const rect = new LinedRect({width: 6, height: 10})
    test('create pair of points function', () => {
        rect.createRandomUtmostPoints()
        // console.log(JSON.stringify(rect.lineEndPoints))
        expect(Object.keys(rect.lineEndPoints).length).toBe(5)
    })
    test('check lines interfering fun', () => {
        // const rect = new LinedRect({width: 4, height: 4})
        rect.linesInterfering = {red: {}, green: {}}
        rect.lineEndPoints = {
            'red': {
                points: {'1-2': {xy: [1,2]}, '2-1': {xy: [2,1]}},
                intervals: {x: [1,2], y: [1,2]}
            },
            'green': {
                points: {'1-4': {xy: [1,4]}, '2-5': {xy: [2,5]}},
                intervals: {x: [1,2], y: [4,5]}
            }
        }
        rect.getRelativeDifficulty()
        console.log(rect.linesInterfering, rect.lineEndPoints)
        expect(rect.linesInterfering['red']['green']).toBe(0)
        rect.linesInterfering = {red: {}, green: {}}
        rect.lineEndPoints = {
            'red': {
                points: {'1-4': {xy: [1,4]}, '4-1': {xy: [4,1]}}, 
                intervals: {x: [1,4], y: [1,4]},
    
        },
            'green': {
                points: {'1-4': {xy: [1,4]}, '2-5': {xy: [2,5]}}, 
                intervals: {x: [1,2], y: [4,5]}
            }
        }
        rect.getRelativeDifficulty()
        expect(rect.linesInterfering['red']['green']).toBe(1.5)
        // console.log(JSON.stringify(rect.linesInterfering))
    })
    test('function meddlest line', () => {
        rect.lineEndPoints = {
            'red': {
                points: {'1-4': {xy: [1,4]}, '4-1': {xy: [4,1]}}, 
                intervals: {x: [1,4], y: [1,4]},
    
        },
            'green': {
                points: {'1-4': {xy: [1,4]}, '2-5': {xy: [2,5]}}, 
                intervals: {x: [1,2], y: [4,5]}
            }
        } 
        rect.getRelativeDifficulty()
        expect(rect.linesInterfering['red']['green']).toBe(1.5)
        expect(rect.getMeddlestUnresolvedLine()).toBe('red')
    })

    test('check interfering fun', () => {
        expect(rect.getPointInterfering(rect.lineEndPoints.red, [2, 2])).toBe(1)
        expect(rect.getPointInterfering(rect.lineEndPoints.red, [6, 6])).toBe(0)
        expect(rect.getPointInterfering(rect.lineEndPoints.red, [0, 0])).toBe(0)
        expect(rect.getPointInterfering(rect.lineEndPoints.red, [0, 1])).toBe(0)
        expect(rect.getPointInterfering(rect.lineEndPoints.red, [1, 2])).toBe(1)
    })

    test('point meddling', () => {
        rect.lineEndPoints = {
            'red': {
                points: {'0-1': {xy: [0,1]}, '3-3': {xy: [3,3]}}, 
                intervals: {x: [0,3], y: [1,3]},
    
        },
            'green': {
                points: {'0-3': {xy: [0,3]}, '1-4': {xy: [1,4]}}, 
                intervals: {x: [0, 1], y: [3, 4]}
            },
            'yellow': {
                points: {'1-5': {xy: [1,5]}, '3-4': {xy: [3,4]}}, 
                intervals: {x: [1,3], y: [4,5]}
            }
        }
        // expect(rect.getPointMeddling([4, 4], 'green')).toBe(2)
        rect.linesInterfering.red = {}
        rect.linesInterfering.green = {}
        rect.linesInterfering.yellow = {}
        rect.getRelativeDifficulty()
        // rect.setStartPointMeddlestLine()
        console.warn(rect.targetPoint, rect.lastStartPoint)
        // expect(rect.prioritizePoints(['2-4', '0-4', '1-5', '1-3'])[0]).toStrictEqual({key: '2-4', priority: 1.1})
    })

    test('create rect', () => {
        const rect = new LinedRect({width: 4, height:4})
        rect.createRect()
        // console.warn('rect created', rect.rect, rect.width, rect.height)
        expect(Object.keys(rect.rect).length).toBe(16)
    })
}) 

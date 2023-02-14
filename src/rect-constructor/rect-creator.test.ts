
import { LineDirections } from '../constant/interfaces'
import {rectCreator, RectCreator} from './rect-creator'

describe('test rect-creator methods', () => {
    const rect = new RectCreator({width: 6, height: 8})
    test('get direction', () => {
        expect(rect.determineDirection('1-2', '2-2')).toBe(LineDirections.right)
    })
})
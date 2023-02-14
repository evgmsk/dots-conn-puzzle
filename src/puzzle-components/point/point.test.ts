import { ITakenPointProps, LineDirections } from '../../constant/interfaces'
import {getOppositeDirection, getSectorsData} from './point'


test('sectors data', () => {
    const props1 = { utmost: false, connections: {blue: [LineDirections.bottom]} } as ITakenPointProps
    const props2 =  { utmost: false, connections: {blue: [LineDirections.bottom, LineDirections.top]} }  as ITakenPointProps
    const props3 =  { utmost: true, connections: {blue: [LineDirections.bottom, LineDirections.top]} }  as ITakenPointProps
    const sectors1 = getSectorsData(props1)
    const sectors2 = getSectorsData(props2)
    const sectors3 = getSectorsData(props3) 
    // console.log(sectors1, sectors2, sectors3)
    expect(sectors1[0].fill).toBe("")
    expect(sectors1[0].dir).toBe(LineDirections.top)
    expect(sectors1[3].line).toBe('blue')
    expect(sectors1[2].line).toBe('')
    expect(sectors2[2].line).toBe('')
    expect(sectors2[3].fill).toBe('')
    expect(sectors2[3].line).toBe('blue')
    expect(sectors3[3].fill).toBe('blue')
})

test('opposite direction', () => {
    expect(getOppositeDirection(LineDirections.bottom)).toBe(LineDirections.top)
})
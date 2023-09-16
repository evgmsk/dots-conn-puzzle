import { ITakenPProps, LineDirections } from '../../constant/interfaces'
import {defaultConnectionsWithColor, oppositeDirection} from '../../utils/helper-fn'
import {defaultSectors, getSectorsData} from "../../utils/helper-fn";


test('sectors data', () => {
    const props1 = { 
        endpoint: true,
        connections: {
            ...defaultConnectionsWithColor('blue'),
            [LineDirections.top]: {color: 'blue', neighbor: '1-1'},
            [LineDirections.bottom]: {color: 'blue', neighbor: '1-3'}
        }
    } as ITakenPProps
    const props2 =  { 
        endpoint: false,
        joinPoint: ['blue', 'red'],
        connections: {
            ...defaultConnectionsWithColor('blue'),
            [LineDirections.top]: {color: 'blue', neighbor: '1-1'},
            [LineDirections.bottom]: {color: 'red', neighbor: '1-3'}
        }
    }  as ITakenPProps
    const props3 =  { 
        endpoint: true,
        connections: {
            ...defaultConnectionsWithColor('blue'),
            [LineDirections.bottom]: {color: 'blue', neighbor: '1-3'}
        }
    }  as ITakenPProps
    const sectors1 = getSectorsData(props1)
    const sectors2 = getSectorsData(props2)
    const sectors3 = getSectorsData(props3) 
    // console.log(sectors1, sectors2, sectors3)
    expect(sectors1[0].fill).toBe("blue")
    expect(sectors1[0].dir).toBe(LineDirections.top)
    // expect(sectors3[0].line).toBe('blue')
    expect(sectors1[2].line).toBe('')
    expect(sectors2[0].line).toBe('blue')
    expect(sectors2[3].fill).toBe('')
    expect(sectors2[2].line).toBe('')
    expect(sectors3[3].fill).toBe('blue')
})

test('opposite direction', () => {
    expect(oppositeDirection(LineDirections.bottom)).toBe(LineDirections.top)
})

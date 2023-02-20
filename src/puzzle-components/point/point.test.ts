import { ITakenPointProps, LineDirections } from '../../constant/interfaces'
import {getOppositeDirection} from '../../helper-fns/helper-fn'
import {defaultSectors, getSectorsData} from "../../helper-fns/helper-fn";


test('sectors data', () => {
    const props1 = { 
        utmost: false, 
        connections: {
            blue: defaultSectors().map(d => {
               return d.dir === LineDirections.bottom 
                ? {dir: LineDirections.bottom, neighbor: '1-1'}
                : d
            }) } 
    } as ITakenPointProps
    const props2 =  { 
        utmost: false, 
        connections: {blue: defaultSectors().map(d => {
            return d.dir === LineDirections.bottom
                ? {dir: LineDirections.bottom, neighbor: '1-1'}
                : d
        }) } 
    }  as ITakenPointProps
    const props3 =  { 
        utmost: true, 
        connections: {
            blue: defaultSectors().map(d => {
                if (d.dir === LineDirections.bottom) {
                    return {dir: LineDirections.bottom, neighbor: '1-2'}
                }
                if (d.dir === LineDirections.top) {
                    return {dir: LineDirections.top, neighbor: '1-0'}
                }
                return d
            })
        } }  as ITakenPointProps
    const sectors1 = getSectorsData(props1)
    const sectors2 = getSectorsData(props2)
    const sectors3 = getSectorsData(props3) 
    // console.log(sectors1, sectors2, sectors3)
    expect(sectors1[0].fill).toBe("")
    expect(sectors1[0].dir).toBe(LineDirections.top)
    expect(sectors1[2].line).toBe('blue')
    expect(sectors1[3].line).toBe('')
    expect(sectors2[3].line).toBe('')
    expect(sectors2[3].fill).toBe('')
    expect(sectors2[2].line).toBe('blue')
    expect(sectors3[3].fill).toBe('blue')
})

test('opposite direction', () => {
    expect(getOppositeDirection(LineDirections.bottom)).toBe(LineDirections.top)
})

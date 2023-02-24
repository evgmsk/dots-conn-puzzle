import { memo, useEffect} from "react"
import { IDotSectorProps, ITakenPointProps } from "../../constant/interfaces"

import './point.scss'
import {getSectorsData} from "../../helper-fns/helper-fn";

export const compareProps = (prevProps: ITakenPointProps, nextProps: ITakenPointProps) => {
    const equal = prevProps.utmost === nextProps.utmost 
        && Object.keys(prevProps.connections).length === 
        Object.keys(nextProps.connections).length
    // console.log(equal, prevProps, nextProps)
    if (!equal) return equal
    for (const color in nextProps.connections) {
        const prevSectors = prevProps.connections[color]
        const nextSectors = nextProps.connections[color]
        if (!prevSectors || prevSectors.length !== nextSectors.length) {
            return false
        }
        for (const index in nextSectors) {
            if (nextSectors[index].dir !== prevSectors[index].dir
                || nextSectors[index].neighbor !== prevSectors[index].neighbor) {
                    return false
                }
        }
    }
    return equal
}

export const PointComponent: React.FC<ITakenPointProps> = (props: ITakenPointProps) => {
    
    const sectorsData = getSectorsData(props)
    useEffect(() => {
        // console.log('point', props, sectorsData)
    }, [])
    
    return <>
        <div className="point-wrapper">
            {
                sectorsData.map((sec, i) => {
                    const {dir, fill} = sec as IDotSectorProps
                    const fillCl = !!fill ? ` fill-${fill}` : ''
                    const sectorName = `puzzle-point_${dir}${fillCl}`
                    return !!fill 
                        ? <div className={sectorName} key={i + props.inv!}></div> 
                        : null
                })
            }
        </div>
        {
            sectorsData.map((sec) => {
                const {dir, turn, line} = sec as IDotSectorProps
                const lineCl = !!line ? ` line-${line}` : ''
                const turnCl = !turn ? '' : ` turn-${turn}`
                const lineName = `line-${dir}${lineCl}${turnCl}`
                return !!line 
                    ? <div className={lineName} key={dir + props.inv}></div> 
                    : null
            })
        }
    </>
}

export const Point = memo(PointComponent)

import {memo, useEffect, useState} from "react"
import { ITakenPProps, IDotSectorProps } from "../../constant/interfaces"

import './point.scss'
import {getSectorsData} from "../../utils/helper-fn";


export const PointComponent: React.FC<ITakenPProps> = (props: ITakenPProps) => {
    const [animation, setAnimation] = useState('')
    const sectorsData = getSectorsData(props)
    const {crossLine, joinPoint, indKey, highlighted} = props
    const joinClass = joinPoint ? ` join-${joinPoint.length}` : ''
    const crossLineClass = !crossLine ? '' : ' cross-line'
    const highlightedCl = `${highlighted ? ' highlighted' : ''}`
    const wrapperCl = `point-wrapper${joinPoint ? ' join' : ''}${crossLineClass}${highlightedCl}`

    useEffect(() => {
        if (props.connections && !animation) {
            setAnimation(' animated')
        } else if (!props.connections) {
            setAnimation('')
        }
    }, [props])
    return <>
        <div className={wrapperCl}>
            {
                sectorsData.map((sec, i) => {
                    const {dir, fill} = sec as IDotSectorProps
                    const fillCl = !!fill ? ` fill-${fill}` : ''
                    const sectorName = `puzzle-point_sector-${dir}${fillCl}${joinClass}${animation}`
                    return !!fill 
                        ? <div className={sectorName} key={i + indKey!}> </div>
                        : null
                })
            }
        </div>
        {
            sectorsData.map((sec) => {
                const {dir, turn, line} = sec as IDotSectorProps
                const lineCl = !!line ? ` line-${line}` : ''
                const turnCl = !turn ? '' : ` turn-${turn}`
                const lineName = `line-${dir}${lineCl}${turnCl}${animation}`
                return !!line 
                    ? <div className={lineName} key={dir + indKey} />
                    : null
            })
        }
    </>
}

export const Point = memo(PointComponent)

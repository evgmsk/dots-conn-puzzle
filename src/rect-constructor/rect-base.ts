import { Height, Width } from '../constant/constants'
import {
    IDotConnections,
    ILinedRect,
    IRectCell,
    IRectDimension, ISLines,
    ITakenPointProps,
    ITakenPoints,
    LineDirections,
} from '../constant/interfaces'
import {copyObj, isDev} from '../helper-fns/helper-fn'


export class LinedRectBase implements ILinedRect {
    _width: number
    _height: number
    rect = {} as IRectCell
    _takenPoints = {} as ITakenPoints
    lines = {} as ISLines
    pointsUpdateCB = (p: ITakenPoints) => {}
    constructor(size: IRectDimension) {
        this._width = size.width
        this._height = size.height
        this.createRect()
    }

    setPointsUpdateCB = (cb: (p: ITakenPoints) => {}) => {
        this.pointsUpdateCB = cb
    }

    get takenPoints() {
        return copyObj(this._takenPoints) as ITakenPoints
    }
    
    getPoint = (key: string) => {
        return copyObj(this._takenPoints[key]) as ITakenPointProps
    }

    addTakenPoints = (points: ITakenPoints) => {
        const pts = this.takenPoints
        for (const key in points) {
            pts[key] = points[key]
        }
        this._takenPoints = pts
        this.pointsUpdateCB(this._takenPoints)
        if (!isDev()) return
        // console.warn('add points', points, this.takenPoints)
    }

    deletePoint = (key: string) => {
        const pts = this.takenPoints
        delete pts[key]
        this._takenPoints = pts
        this.pointsUpdateCB(this._takenPoints)
    }

    clearPoints = () => {
        this._takenPoints = {} as ITakenPoints
        this.pointsUpdateCB(this._takenPoints)
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    setWidth(width: number) {
        this._width = width
        this._takenPoints = {} as ITakenPoints
        this.createRect()
        this.pointsUpdateCB(this._takenPoints)
    }

    setHeight(height: number) {
        this._height = height
        this._takenPoints = {} as ITakenPoints
        this.createRect()
        this.pointsUpdateCB(this._takenPoints)
    }

    createRect = () => {
        const {_width: width, _height: height} = this
        const rect = {} as IRectCell
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const key = `${j}-${i}`
                const neighbors = this.getSquareNeighbors(j, i)
                rect[key] = {neighbors, point: [j, i]}
            }
        }
        this.rect = rect
        return rect 
    }

    checkCircleLine = (point: string, color: string): boolean => {
        const line = [point]
        const lineNeighbors = this.getLineNeighbors(point, color)
        let passed = point
        const stopFn = (nextPoint: string) => {
            const {endpoint, connections} = this.getPoint(nextPoint)
            if (!connections) {
                console.error('invalid next', nextPoint, this.takenPoints)
            }
            const lineNeighbors = this.getLineNeighbors(connections, color)
            const totalNeighbors = this.rect[nextPoint].neighbors
            for (const neighbor of totalNeighbors) {
                if (lineNeighbors.includes(neighbor)) continue
                if (line.includes(neighbor)) {
                    break
                }
            }
            line.push(nextPoint)
            return endpoint
        }
        lineNeighbors.forEach(next => {
            this.goToLinePoint(next, passed, stopFn, color)
        })
        return line.length > 1
    }

    getSquareNeighbors = (x: number, y: number): string[] => {
        const neighbors = [] as string[]
        if (x > 0) {
            neighbors.push(`${x - 1}-${y}`)
        }
        if (y > 0) {
            neighbors.push(`${x}-${y - 1}`)
        }
        if (y < this._height - 1) {
            neighbors.push(`${x}-${y + 1}`)
        }
        if (x < this._width - 1) {
            neighbors.push(`${x + 1}-${y}`)
        }
        return neighbors
    }

    getLineNeighbors = (
        props: string | IDotConnections,
        color?: string,
        points = this._takenPoints
    ) => {
        const connections = typeof props === 'string'
            ? points[props]?.connections
            : props
        if (!connections || !connections[LineDirections.top]) {
            console.error('invalid props get line neighbors', props, points, connections)
            return []
        }
        const neighbors = []
        for (const dir in connections) {
            const neighbor = (!color || connections[dir].color === color)
                && connections[dir].neighbor
            neighbor && neighbors.push(neighbor)
        }
        return neighbors
    }

    goToLinePoint = (
        from: string, // start line point
        passed: string, // passed line point to set moving direction
        stopFn: Function, // function to determine condition to stop loop (target point reached)
        color?: string,
        index?: number, // required to select neighbor (prevPoint) in case of more than one valid neighbors of start point
        points = this._takenPoints, // function to call with params of a current line point
        ): string => {
            let current = from
            let prevPoint = passed
            let lineNeighbors = this.getLineNeighbors(current, color, points)
            let nextPoint = lineNeighbors.filter(n => n !== passed)[0]
            if (!lineNeighbors.length || (!prevPoint && lineNeighbors.length !== 1)) {
                isDev() && console.error('invalid props because of two ways or no ways', color,
                    current, prevPoint, lineNeighbors, nextPoint, index)
                return ''
            }
            while(!stopFn(current, index)) {
                prevPoint = current
                current = nextPoint
                if (!current) {
                    return ''
                }
                lineNeighbors = this.getLineNeighbors(nextPoint, color, points)
                // eslint-disable-next-line no-loop-func
                nextPoint = lineNeighbors.filter(n => n !== prevPoint)[0]
            }
            return current
    }

    getLineDirections = (props: string | IDotConnections, color?: string) => {
        const connections = typeof props === 'string'
            ? this.getPoint(props)?.connections
            : props
        if (!connections) {
            console.error('invalid props line direction', props, connections, this.takenPoints)
            return []
        }
        const directions = []
        for (const dir in connections) {
            const neighbor = (!color || connections[dir].color === color)
                && connections[dir].neighbor
            neighbor && directions.push(dir)
        }
        return directions
    }

    getLinePartPoints = (
        color: string,
        current: string,
        prev= '',
        points = this._takenPoints
    ): string[] => {
        const {connections, endpoint, crossLine} = points[current] || {}
        if (!connections || (!prev && (crossLine || !endpoint))) {
            console.error('invalid start line point', color, current, crossLine, points)
            return []
        }
        const linePoints = prev ? [prev] : [current]
        const neighbors = this.getLineNeighbors(current, color, points)
        if (!prev && neighbors.length !== 1) {
            isDev() && console.error('broken line', neighbors, linePoints, prev, current)
            return []
        }
        const stopFn = (key: string) => {
            linePoints.push(key)
            return connections && this.getLineNeighbors(key, color, points).length < 2
        }
        !prev && this.goToLinePoint(neighbors[0], current, stopFn, color, 0, points)
        prev && this.goToLinePoint(current, prev, stopFn, color, 0, points)
        // console.log('line', linePoints)
        return linePoints
    }

    sameEndpointOrSameLine = (next: string, prev: string, color: string) => {
        const resLine1 = this.checkIfSameLinePoints(next, prev, color)
        const resLine2 = this.checkIfSameLinePoints(prev, next, color)
        return resLine1.same
            || resLine2.same
            || (resLine1.endpoint && resLine2.endpoint === resLine1.endpoint)
    }

    checkIfSameLinePoints = (targetPoint: string, passedPoint: string, color: string) => {
        const prevPoint = this.getPoint(passedPoint)
        const neighbors = this.getLineNeighbors(passedPoint, color)
        let sameStart = {same: false, endpoint: ''}
        if (!passedPoint || !neighbors) {
            console.error('invalid props', targetPoint, prevPoint, color, this.takenPoints)
            return sameStart
        }
        if (neighbors.includes(targetPoint)) {
            sameStart.same = true
            return sameStart
        }
        const fn = (point: string) => {
            if (point === targetPoint) {
                sameStart.same = true
                return true
            }
            return this.getLineNeighbors(point, color).length < 2
        }
        const startPoints = neighbors.map(n => {
            return this.goToLinePoint(n, passedPoint, fn, color)
        })
        sameStart.endpoint = startPoints[0]
        return sameStart
    }

    getColors = (props: string | IDotConnections): string[] => {
        const connections = typeof props === "string"
            ? this.getPoint(props)?.connections
            : props
        const colors = {} as {[key: string]: boolean}
        for (const dir in connections) {
            const color = connections[dir].color
            if (!colors[color]) {
                colors[color] = true
            }
        }
        return Object.keys(colors)
    }

    determineDirection = (nextPoint: string, prevPoint: string) => {
        const next = nextPoint.split('-').map(c => parseInt(c))
        const previous = prevPoint.split('-').map(c => parseInt(c))
        if (next[0] < previous[0]) {
            return LineDirections.right
        }
        if (next[0] > previous[0]) {
            return LineDirections.left
        }
        if (next[1] < previous[1]) {
            return LineDirections.bottom
        }
        if (next[1] > previous[1]) {
            return LineDirections.top
        }
        console.error('invalid props to determine direction', nextPoint, prevPoint)
        return '' as LineDirections
    }
}

export const rectBase = new LinedRectBase({width: Width, height: Height})

import { Height, Width } from '../constant/constants'
import {
    IDotConnections,
    ILinedRect,
    IRectCell,
    IRRectDimension,
    IStartPoints,
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
    _utmostPoints = {} as IStartPoints 
    constructor(size: IRRectDimension) {
        this._width = size.width
        this._height = size.height
        this.createRect()
    }

    get startPoints() {
        return copyObj(this._utmostPoints)
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
        if (!isDev()) return
        for (const key in points) {
            if (!this.checkPointConnections(key, points[key])) {
                console.error('invalid point connections',
                    Object.values(points[key].connections).length, key, points[key])
                return
            }
        }
        // console.warn('add points', points, this.takenPoints)
    }

    checkStartPointUtmost = (next: string, prev: string) => {
        console.log('check start point', next, prev)
        if (!this.getPoint(next)) {
            console.error('invalid props to check start point', next, this.takenPoints)
            return false
        }
        const stopFn = (key: string) => {
            return this.getPoint(key)?.utmost
        }
        const last = this.goToLinePoint(next, prev, stopFn)
        return !!this.getPoint(last)?.utmost
    }

    checkPointConnections = (point: string, pointProps: ITakenPointProps) => {
        const {connections, utmost} = pointProps
        if (!connections) return false
        const neighbors = this.getLineNeighbors(connections)
        const validNeighbors = !neighbors.includes(point) && (!!neighbors.length || utmost)
        let connectedToUtmost = false
        if (validNeighbors && !utmost) {
            for (const nei of neighbors) {
                const neiPoint = this.getPoint(nei)
                if (neiPoint && this.checkStartPointUtmost(nei, point)) {
                    connectedToUtmost = true
                    break
                }
            }
        }
        return Object.keys(connections).length === 4
            && (utmost ? validNeighbors : connectedToUtmost)
    }

    deletePoint = (key: string) => {
        const pts = this.takenPoints
        delete pts[key]
        this._takenPoints = pts
    }

    clearPoints = () => {
        this._takenPoints = {} as ITakenPoints
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    setWidth(width: number) {
        this._width = width
        this.createRect()
    }

    setHeight(height: number) {
        this._height = height
        this.createRect()
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
        let circle = false
        const lineNeighbors = this.getLineNeighbors(point, color)
        let passed = point
        const stopFn = (nextPoint: string) => {
            const {utmost, connections} = this.getPoint(nextPoint)
            if (!connections) {
                console.error('invalid next', nextPoint, this.takenPoints)
            }
            const lineNeighbors = this.getLineNeighbors(connections, color)
            const totalNeighbors = this.rect[nextPoint].neighbors
            for (const neighbor of totalNeighbors) {
                if (lineNeighbors.includes(neighbor)) continue
                if (line.includes(neighbor)) {
                    circle = true
                    return true
                }
            }
            line.push(nextPoint)
            return utmost
        }
        lineNeighbors.forEach(next => {
            this.goToLinePoint(next, passed, stopFn)
        })
        return circle
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

    getLineNeighbors = (props: string | IDotConnections, color?: string) => {
        const connections = typeof props === 'string'
            ? this.getPoint(props)?.connections
            : props
        if (!connections || !connections[LineDirections.top]) {
            console.error('invalid props get line neighbors', props, this.takenPoints)
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

    goToLinePoint(
        from: string, // start line point
        passed: string, // passed line point to set moving direction
        stopFn: Function, // function to determine condition to stop loop (target point reached)
        index?: number,
        stepCB?: Function, // function to call with params of a current line point
        ): string {
            let current = from
            let prevPoint = passed
            let lineNeighbors = this.getLineNeighbors(current)
            let nextPoint = lineNeighbors.filter(n => n !== passed)[0]
            if (!prevPoint && lineNeighbors.length > 1) {
                console.error('invalid props because of two ways',
                    current, prevPoint, lineNeighbors, nextPoint, index)
                return ''
            }
            isDev() && console.warn('go to', from, passed, nextPoint, lineNeighbors)
            while(!stopFn(current, index)) {
                stepCB &&  stepCB(current)
                prevPoint = current
                current = nextPoint
                if (!current) {
                    return ''
                }
                lineNeighbors = this.getLineNeighbors(nextPoint)
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

    getStartPoint(start: string, prev: string): string {
        let last = start
        const stopFn = (key: string) => {
            last = key
            const {utmost, connections} = this.getPoint(key) || {}
            return connections
                && (utmost || this.getLineNeighbors(connections).length < 2)
        }
        console.log('start point', last, this.goToLinePoint(start, prev, stopFn))
        return this.goToLinePoint(start, prev, stopFn) || last
    }

    sameUtmostOrSameLine = (next: string, prev: string, color: string) => {
        const resLine1 = this.checkIfSameLinePoints(next, prev, color)
        const resLine2 = this.checkIfSameLinePoints(prev, next, color)
        return resLine1.same
            || resLine2.same
            || (resLine1.utmost
                && resLine2.utmost === resLine1.utmost)
    }

    checkIfSameLinePoints = (next: string, prev: string, color: string) => {
        const prevPoint = this.getPoint(prev)
        const neighbors = this.getLineNeighbors(prev, color)
        let sameStart = {same: false, utmost: ''}
        if (!prev || !neighbors) {
            console.error('invalid props', next, prevPoint, color, this.takenPoints)
            return sameStart
        }
        if (neighbors.includes(next)) {
            sameStart.same = true
            return sameStart
        }
        const fn = (point: string) => {
            if (point === next) {
                sameStart.same = true
                return true
            }
            return this.getPoint(point)?.utmost
        }
        const startPoints = neighbors.map(n => {
            return this.goToLinePoint(n, prev, fn)
        })
        sameStart.utmost = startPoints[0]
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

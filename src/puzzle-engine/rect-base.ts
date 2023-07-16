import {Height, Width} from '../constant/constants'
import {
    IDLines,
    IDotConnections,
    ILinedRect,
    IRectCell,
    IRectDimension,
    ITakenPointProps,
    ITakenPoints,
    LineDirections,
} from '../constant/interfaces'
import {copyObj, isDev} from '../utils/helper-fn'
import {Observable} from "../app-services/observable";


export class LinedRectBase implements ILinedRect {
    _width = Width
    _height = Height
    rect = {} as IRectCell
    _takenPoints = {} as ITakenPoints
    lines = {} as IDLines
    $points = new Observable<ITakenPoints>(this._takenPoints)
    $width = new Observable<number>(this._width)
    $height = new Observable<number>(this._height)

    constructor(size: IRectDimension) {
        this._width = size.width
        this._height = size.height
        this.createRect()
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
        this.$points.emit(this.takenPoints)
        if (!isDev()) return
        this.checkPoints(points)
        // console.log('updated Points' ,this.takenPoints, this.$points.subscribers)
    }

    checkPoints = (points: ITakenPoints) => {
        for (const key in points) {
            const {connections, endpoint, crossLine, joinPoint} = points[key]
            if (endpoint && !crossLine && !joinPoint
                && this.getColors(connections).length !== 1) {
                console.error('invalid props', key, points, connections)
            }
        }
    }

    deletePoint = (key: string) => {
        const pts = this.takenPoints
        delete pts[key]
        this._takenPoints = pts
        this.$points.emit(this.takenPoints)
    }

    clearPoints = () => {
        this._takenPoints = {} as ITakenPoints
        this.$points.emit(this.takenPoints)
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }

    setDimension(props: {width?: number, height?: number}) {
        const {width, height} = props
        if (!width && !height) {return}

        if (width) {
            this._width = width
            if (this.height < width || this.height > width * 1.5) {
                this._height = Math.round(width * 1.2)

            }
        } else if (height) {
            this._height = height
            if (height > this.width * 1.5 || height < this.width) {
                this._width = Math.round(height / 1.2)

            }
        }
        this._takenPoints = {} as ITakenPoints
        this.createRect()
        this.$points.emit(this.takenPoints)
        this.$width.emit(this._width)
        this.$height.emit(this._height)
    }

    setWidth(width: number) {
        this.setDimension({width})
    }

    setHeight(height: number) {
        this.setDimension({height})
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
        points = this.takenPoints
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
        points = this.takenPoints, // function to call with params of a current line point
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

    getLineDirections = (
        props: string | IDotConnections,
        color?: string,
        points = this.takenPoints) => {
        const connections = typeof props === 'string'
            ? points[props]?.connections
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

    getFullLineFromAnyPoint = (
        point: string,
        color: string,
        neighbors?: string[],
        points = this.takenPoints
    ): string[] => {

        const _neighbors = neighbors || this.getLineNeighbors( point, color, points)
        isDev() && console.log('get full line', point, color, _neighbors)
        if (!_neighbors.length) {
            return [point]
        }
        if (_neighbors.length === 1) {
            return this.getLinePartPoints(color, point, '', points)
        }
        const linePart1 = this.getLinePartPoints(color, _neighbors[0], point, points)
        const linePart2 = this.getLinePartPoints(color, _neighbors[1], point, points)
        const line = linePart1.reverse().concat(linePart2.slice(1))
        return points[line[line.length -1]].endpoint ? line : line.reverse()
    }

    getLinePartPoints = (
        color: string,
        current: string,
        prev= '',
        points = this.takenPoints
    ): string[] => {
        const {connections, crossLine} = points[current] || {}

        if (!connections) {
            isDev() && console.error('invalid start line point', color, current, crossLine, points)
            return []
        }
        const linePoints = prev ? [prev] : [current]
        const neighbors = this.getLineNeighbors(current, color, points)
        isDev() && console.log('get line part', color, current, prev, connections, neighbors)
        if (!neighbors.length) {
            return [current]
        }
        if (!prev && neighbors.length !== 1 ) {
            isDev() && console.error('invalid props to get line points', neighbors, linePoints, prev, current)
            return []
        }
        const stopFn = (key: string) => {
            linePoints.push(key)
            return connections && this.getLineNeighbors(key, color, points).length < 2
        }
        !prev && this.goToLinePoint(neighbors[0], current, stopFn, color, 0, points)
        prev && this.goToLinePoint(current, prev, stopFn, color, 0, points)
        isDev() && console.log('line', linePoints, neighbors)
        return linePoints
    }

    checkIfPointBelongsToLine = (line: string[], point: string, secondPoint?: string): string[] => {
        const indexOf = line.indexOf(point)
        if (indexOf < 0) return []
        const indexOf2 = secondPoint ? line.indexOf(secondPoint) : -1
        console.log('belong', line, point, secondPoint, this.getPoint(line[line.length - 1]))
        const stPoint = this.getPoint(line[0])
        const endPoint = this.getPoint(line[line.length - 1])
        if (indexOf2 < 0) {
            return stPoint.endpoint
                ? line.slice(indexOf)
                : line.slice(0, indexOf + 1)
        }
        if (stPoint.endpoint && endPoint.endpoint) {
            return indexOf > indexOf2
                ? line.slice(indexOf2, indexOf + 1)
                : line.slice(indexOf, indexOf2 + 1)
        }
        if (stPoint.endpoint) {
            return indexOf < indexOf2
                ? line.slice(indexOf2)
                : line.slice(indexOf)
        }
        if (endPoint.endpoint) {
            return indexOf > indexOf2
                ? line.slice(0, indexOf + 1)
                : line.slice(0, indexOf2 + 1)
        }
        return []
    }

    checkIfPointsBelongToSameLine = (
        next: string,
        prev: string,
        color: string,
        points = this.takenPoints
    ) => {
        const nextNeighbors = this.getLineNeighbors(next, color, points)
        const line = this.getFullLineFromAnyPoint(next, color, nextNeighbors, points)
        // isDev() && console.log('check same line', line, this.takenPoints, next, prev, color)
        return this.checkIfPointBelongsToLine(line, prev, next)
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

    getColorsOfConnections = (props: string | IDotConnections): string[] => {
        const connections = typeof props === "string"
            ? this.getPoint(props)?.connections
            : props
        const colors = [] as string[]
        for (const dir in connections) {
            if (connections[dir].neighbor) {
                colors.push(connections[dir].color)
            }
        }
        return colors
    }

    determineDirection = (nextPoint: string, prevPoint: string) => {
        if (!nextPoint || !prevPoint) {
            console.error('invalid props to determine direction', nextPoint, prevPoint)
            return '' as LineDirections
        }
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

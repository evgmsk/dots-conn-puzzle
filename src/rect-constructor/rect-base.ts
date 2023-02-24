import { Height, Width } from '../constant/constants'
import { 
    IConnection,
    ILinedRect, IRectCell, 
    IRRectDimension,
    IStartPoints, 
    ITakenPointProps, 
    ITakenPoints,
    LineDirections,
} from '../constant/interfaces'
import { copyObj } from '../helper-fns/helper-fn'


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

    isUtmost = (key: string) => {
        return this._takenPoints[key].utmost
    }

    addTakenPoints = (points: ITakenPoints) => {
        // console.warn(points)
        const pts = this.takenPoints
        for (const key in points) {
            if (!this.checkPointConnections(points[key])) {
                console.error('invalid point connections', Object.values(points[key].connections).length, key, points[key])
                return 
            }
            pts[key] = points[key]
        }
        this._takenPoints = pts
    }

    checkPointConnections = (point: ITakenPointProps) => {
        let dirNum = 0;
        for (const color in point.connections) {
            dirNum += point.connections[color].length
        }
        return dirNum === 4
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
                const neighbors = this.getNeighbors(j, i)
                rect[key] = {neighbors, point: [j, i]}
            }
        }
        this.rect = rect
        return rect 
    }

    getSectorIndex = (dir: LineDirections, connections: IConnection[]) => {
        const index = connections.findIndex((c) => c.dir === dir)
        if (index < 0) {
            console.error('invalid props for index sector', connections, dir)
        }
        return index
    }

    checkCircleLine = (key: string, color: string): boolean => {
        const line = [key]
        const point = this.getPoint(key)
        let circle = false
        if (!point || !point.connections[color]) {
            console.error('invalid props', key, color, this.takenPoints)
            return false
        }
        const lineNeighbors = this.getLineNeighbors(key, color)
        const stopFn = (key2: string, col = color) => {
            const nPoint = this.getPoint(key2)
            const outLineNeighborsSameColorSameLine = this.rect[key2].neighbors.filter(n => {
                return nPoint.connections[col].findIndex(c => c.neighbor === n) < 0
                    && this.getPoint(n)
                    && this.getPoint(n).connections 
                    && this.getPoint(n).connections[col]
                    && line.includes(n)
            }).length
            if (outLineNeighborsSameColorSameLine) {
                circle = true
                return true
            }
            line.push(key2)
            return nPoint.utmost
        }
        lineNeighbors.forEach(n => {
            this.goToLinePoint(n, key, color, stopFn)
        })
       
        return circle
    }

    getNeighbors = (x: number, y: number): string[] => {
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

    isNeighbors = (key: string, key2: string) =>{
        return this.rect[key].neighbors.includes(key2)
    }

    haveNeighbor = (pointKey: string, neighbor: string, color: string): boolean => {
        const point = this.getPoint(pointKey)
        if (!point) {
            console.error('inv props', pointKey, neighbor, color, this.takenPoints)
            return false
        }
        const {connections} = point
        return !!connections[color].filter(con => con.neighbor === neighbor).length
    }

    getLineNeighbors = (key: string, color: string) => {
        const point = this.getPoint(key)
        return point.connections[color]?.reduce((acc, s) => {
            if (s.neighbor) {
                acc.push(s.neighbor)
            }
            return acc
        }, [] as string[])
    }

    goToLinePoint(
        from: string, // start line point
        passed: string, // passed line point to set moving direction
        color: string,  // line color
        stopFn: Function, // function to determine condition to stop loop (target point reached)
        stepCB?: Function, // function to call with params of a current line point
        ): string {
            let current = from
            let prevPoint = passed
            let connections = this.getPoint(current)?.connections[color]
            // console.log(from, passed, color, prevPoint)
            if (!connections) console.error(current, passed, this.takenPoints, color)
            while(!stopFn(current, color)) {
                passed = current
                stepCB && stepCB(current)
                // eslint-disable-next-line no-loop-func
                current = connections.filter( c => c.neighbor && c.neighbor !== prevPoint)[0]?.neighbor || ''
                // console.warn(current, connections, prevPoint)
                if (!current) {
                    return ''
                }
                connections = this.getPoint(current).connections[color]
                prevPoint = passed
            }
            return current
    }

    getStartPoint(key: string, color: string, prevKey = ''): string[] {
        let connections = this.takenPoints[key].connections[color]
        if (connections.length > 1 && !prevKey) {
            return connections.map((con, i) => {
                return this.goToLinePoint(con.neighbor!, key, color, this.isUtmost)
            }).filter(key => key)
        }
        if (!prevKey && connections.length === 1) {
            const nextKey = connections[0].neighbor
            return [this.goToLinePoint(nextKey!, key, color, this.isUtmost)]
        }
        return [this.goToLinePoint(key, prevKey, color, this.isUtmost)]
    }

    checkIfSameLineNeighbors = (key: string, key2: string, color: string) => {
        const point1 = this.getPoint(key)
        console.error(key, key2, point1.connections[color])
        return point1 && point1.connections[color]
            .findIndex((c) => c.neighbor && c.neighbor === key2) >= 0
    }

    checkIfSameLinePoints = (key: string, key2: string, color: string) => {
        const point2 = this.getPoint(key2)
        if (!point2) {
            console.error('invalid props', key, key2, color, this.takenPoints)
            return false
        }
        const neighbors = this.getLineNeighbors(key2, color)
        if (neighbors.includes(key)) {
            return true
        }
        const sameStart = {same: false}
        const fn = (point: string) => {
            if (point === key) {
                sameStart.same = true
                return true
            }
            return !!this.getPoint(point).utmost
        }
        neighbors.forEach(n => [
            this.goToLinePoint(n, key2, color, fn)
        ])
        return sameStart.same
    }

    determineDirection = (key: string, key2: string) => {
        const current = key.split('-').map(c => parseInt(c))
        const previous = key2.split('-').map(c => parseInt(c))
        if (current[0] < previous[0]) {
            return LineDirections.right
        }
        if (current[0] > previous[0]) {
            return LineDirections.left
        }
        if (current[1] < previous[1]) {
            return LineDirections.bottom
        }
        if (current[1] > previous[1]) {
            return LineDirections.top
        }
        console.error('invalid props to determine direction', key, key2)
        return '' as LineDirections
    }

   
}

export const rectBase = new LinedRectBase({width: Width, height: Height})

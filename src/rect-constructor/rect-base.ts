
import { Height, Width } from '../constant/constants'
import { 
    ILinedRect, IRectCell, 
    IRectDimention, 
    IStartPoints, 
    ITakenPoints,
    LineDirections,
} from '../constant/interfaces'
import { rectCreator } from './rect-creator'

export class LinedRectBase implements ILinedRect {
    _width: number
    _height: number
    rect = {} as IRectCell
    _takenPoints = {} as ITakenPoints
    _utmostPoints = {} as IStartPoints 
    constructor(size: IRectDimention) {
        this._width = size.width
        this._height = size.height
        this.createRect()
    }

    dimention(size: IRectDimention) {
        this._width = size.width
        this._height = size.height
        this.createRect()
    }

    width(width: number) {
        this._width = width
        this.createRect()
    }

    height(height: number) {
        this._height = height
        this.createRect()
    }

    createRect = () => {
        const {_width: width, _height: height} = this
        const rect = {} as IRectCell
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const key = `${j}-${i}`
                const neighbors = this.getNeihgbors(j, i)
                rect[key] = {neighbors, point: [j, i]}
            }
        }
        this.rect = rect
        return rect 
    }

    getNeihgbors = (x: number, y: number): string[] => {
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
    
    get startPoints() {
        return this._utmostPoints
    }

    get takenPoints() {
        return this._takenPoints as ITakenPoints
    }

    getStartPoint(key: string, ): string {
        let nextKey = key
        let prevKey = ''
        while (!this._takenPoints[nextKey].utmost) {
            const connection = rectCreator.takenPoints[nextKey].connections
            const neighbors = this.rect[nextKey].neighbors
        }
        return ''
    }

    checkIfDifferentStartPoints = (key: string, key2: string, color: string) => {
        // const 
        return false
    }

    addTakenPoints(point: ITakenPoints) {
        Object.keys(point).forEach(k => {
            this._takenPoints[k] =  point[k]
        })
    }

    clearPoints = () => {
        this._takenPoints = {} as ITakenPoints
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
        console.error('invalid props to determine direction')
        return '' as LineDirections
    }
}

export const rectBase = new LinedRectBase({width: Width, height: Height})

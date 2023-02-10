
import { Height, Width } from '../constant/constants'
import { 
    ILinedRect, IRectCell, 
    IRectDimention, 
    ITakenPoints,
    LineDirections,
} from '../constant/interfaces'

export class LinedRectBase implements ILinedRect {
    _width: number
    _height: number
    rect: IRectCell
    _takenPoints = {} as ITakenPoints
    constructor(size: IRectDimention) {
        this._width = size.width
        this._height = size.height
        this.rect = this.createRect()
    }

    dimention(size: IRectDimention) {
        this._width = size.width
        this._height = size.height
        this.rect = this.createRect()
    }

    width(width: number) {
        this._width = width
    }

    height(height: number) {
        this._height = height
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
    
    get lines() {
        return this._takenPoints
    }

    get takenPoints() {
        return this._takenPoints as ITakenPoints
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
        const previous = key.split('-').map(c => parseInt(c))
        if (current[0] < previous[0]) {
            return LineDirections.right
        }
        if (current[0] > previous[0]) {
            return LineDirections.left
        }
        if (current[1] < previous[1]) {
            return LineDirections.top
        }
        if (current[1] > previous[1]) {
            return LineDirections.bottom
        }
    }
}

export const rectBase = new LinedRectBase({width: Width, height: Height})

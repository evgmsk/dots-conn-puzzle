import { Height, Width } from "../constant/constants";
import { IPointConnections } from "../constant/interfaces";
import { LinedRectBase } from "./rect-base";


export class RectCreator extends LinedRectBase {

    resolveMouseUp = (key1: string, key2: string, color: string) => {
       
    }

    resolveNewPointDown(key: string, color: string) {
        const neighbors = this.rect[key].neighbors
        console.warn('new down rect', key, color)
        const sameColorNeighbors = neighbors.filter(k => {
            return this._takenPoints[k][color]
        })
        if (!sameColorNeighbors.length) {
            this._takenPoints[key] = {
                [color]: []
            } as IPointConnections
        } else {
            const directions = sameColorNeighbors.map(d => this.determineDirection(key, d))
            this._takenPoints[key] =  {
                [color]: directions
            } as IPointConnections
        }
    }

    resolveMouseDown = (key: string, color: string, sp?: string) => {
        console.warn('down rect', key, color)
        if (!sp && !this._takenPoints[key]) {
            this.resolveNewPointDown(key, color)
        }
        
    }

    resolveMouseEnter = (key: string, key2: string, color: string) => {

    }

    resolveMouseLeave = (key: string, key2: string, color: string) => {

    }
}

export const rectCreator = new RectCreator({width: Width, height: Height})

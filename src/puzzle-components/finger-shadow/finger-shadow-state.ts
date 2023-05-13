import {IPos, LineDirections} from "../../constant/interfaces";


export class FingerShadowState {
    mouseDown = ''
    color = ''
    current = {} as IPos
    dir = '' as LineDirections
    updateCB = (() => {}) as Function

    setMouseDown = (md: string, pos: IPos) => {
        this.mouseDown = md
        this.current = pos
        this.updateCB({color: this.color, pos: this.current, dir: this.dir})
    }

    setUpdateCB = (cb: Function) => {
        this.updateCB = cb
    }

    setColor = (color: string) => {
        console.log('set color', color)
        this.color = color
        this.updateCB({color: this.color, pos: this.current, dir: this.dir})
    }

    detectDirection = (pos: IPos) => {
        const {x, y} = this.current
        const _x = x - pos.x
        const _y = y - pos.y
        const topOrBottom = Math.abs(_y) > Math.abs(_x)
        this.dir = topOrBottom
            ? (_y > 0 ? LineDirections.top : LineDirections.bottom)
            : (_x > 0 ? LineDirections.left : LineDirections.right)
        this.current = pos
        this.mouseDown && this.updateCB({color: this.color, pos: this.current, dir: this.dir})
    }
}

export const shadowState = new FingerShadowState()

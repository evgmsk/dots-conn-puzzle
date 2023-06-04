import {IPos, LineDirections} from "../constant/interfaces";
import {Observable} from "./observable";
import {DefaultColor} from "../constant/constants";


export class FingerShadowState {
    mouseDown = ''
    color = DefaultColor
    current = {} as IPos
    dir = '' as LineDirections
    $color = new Observable<string>(this.color)
    $shadowState = new Observable({color: this.color, dir: this.dir, pos: this.current})

    setMouseDown = (md: string, pos: IPos) => {
        this.mouseDown = md
        this.current = pos
        this.$shadowState.emit({color: this.color, dir: this.dir, pos: this.current})
    }


    setColor = (color: string) => {
        this.color = color
        this.$shadowState.emit({color: this.color, dir: this.dir, pos: this.current})
        this.$color.emit(this.color)
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
        this.$shadowState.emit({color: this.color, dir: this.dir, pos: this.current})
    }
}

export const shadowState = new FingerShadowState()

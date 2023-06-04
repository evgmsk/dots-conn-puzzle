import {Observable} from "./observable";


export class ModeService {
    mode = 'create'
    pause = false
    $mode = new Observable(this.mode)
    $pause = new Observable(this.pause)

    setPause = (pause: boolean) => {
        this.pause = pause
        console.log('pause', pause)
        this.$pause.emit(this.pause)
    }

    changeMode = (mode: string) => {
        this.mode = mode
        console.log('new mode', mode)
        this.$mode.emit(this.mode)
    }
}

export const modeService = new ModeService()

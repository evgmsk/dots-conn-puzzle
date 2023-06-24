import {Observable} from "./observable";


export class AddsService {
    addsTimeout = 5
    addsShown = true
    adds = {} as {[k: string]: any}
    $addsShown = new Observable(this.addsShown)

    setAddsTimeout = (timeout: number) => {
        this.addsTimeout = timeout
    }

    addAdds = (adds: any) => {
        this.adds[Object.keys(this.adds).length] = adds
    }

    removeAdds = (key: string) => {
        delete this.adds[key]
    }

    getAdds = () => {

    }

    // setGraded = (grade: boolean) => {
    //     this.graded = grade
    //     this.$graded.emit(this.graded)
    // }

    setAddsShown = (shown: boolean) => {
        console.log(shown)
        this.addsShown = shown
        this.$addsShown.emit(this.addsShown)
    }
}

export const addsService = new AddsService()


import {
    BaseDevUrl,
    BaseProdUrl,
    LSPuzzles as LSP,
    LSName,
    LSLevel,
    LSToken, LSPuzzles
} from "../constant/constants";

import {
    getPuzzlesFromStorage,
    isDev,
    tokenizedHeadersGet,
    tokenizedHeadersPost
} from "../helper-fns/helper-fn";

import {IPuzzle} from "../constant/interfaces";
import {Observable} from "./observable";


export async function makeFetch(urlSuffix: string, opts: {[k: string]: any} = {method: 'GET'}) {
    opts.headers = {...opts.headers, ...tokenizedHeadersGet()}
    const baseUrl = isDev() ? BaseDevUrl : BaseProdUrl
    const url = `${baseUrl}/${urlSuffix}`
    try {
        const res = await fetch(url, opts)
        let resData = await res.json()
        isDev() && console.log('resData', res, resData, url)
        if (res.ok) {
            return { resData }
        } else {
            return {error: resData}
        }
    } catch (e) {
        console.log('error', e)
        return { error: e }
    }
}

export class PuzzlesManager {
    puzzles = getPuzzlesFromStorage()
    token = localStorage.getItem(LSToken)
    loading = false
    error = {} as {message: string}
    level = parseInt(localStorage.getItem(LSLevel) || '0')
    url = `puzzles/${this.level}`
    userName = localStorage.getItem(LSName) || ''
    options = {method: 'GET'} as {[k:string]: any}
    timeout = 1000
    attempts = 0
    unresolvedPuzzle = {} as IPuzzle
    $puzzles = new Observable<IPuzzle[]>(this.puzzles)
    $unresolved = new Observable<IPuzzle>(this.unresolvedPuzzle)
    $loading = new Observable<boolean>(this.loading)
    $error = new Observable<{message: string}>(this.error)

    constructor() {
        if (this.puzzles.length < 2) {
            console.log('get puzzles', this.puzzles.length)
            this.updatePuzzles().then(() => console.log('updated'))
        }
        if (!this.token) {
            this.getToken().then(() => {
                console.log('token received')
            })
        }
    }

    handleSavePuzzle = async (puzzle = this.unresolvedPuzzle, puzzles = [] as IPuzzle[]) => {
        const _puzzles = puzzles.concat(puzzle)
        localStorage.setItem(LSPuzzles, JSON.stringify(_puzzles))
        const options = {
            method: 'POST',
            headers: tokenizedHeadersPost(),
            body: JSON.stringify({data: puzzle})
        }
        const url = 'puzzles/new'
        await makeFetch(url, options)
    }

    setUnresolved = (puzzle = null as unknown as IPuzzle) => {
        this.unresolvedPuzzle = puzzle
        console.log(this.$unresolved.subscribers)
        this.$unresolved.emit(this.unresolvedPuzzle)
    }

    getToken = async () => {
        await makeFetch('auth/token').then(res => {
            const {resData, error} = res
            this.saveResult(resData?.token, LSToken)
            this.saveResult(resData?.name, LSName)
            error && this.saveError(error.message)
        });
    }

    setLevel = (level: number) => {
        this.level = level
    }

    setOptions = (opts: {[k:string]: any}) => {
        this.options = opts
    }

    setUrl = (url: string) => {
        this.url = url
    }

    setIsLoading = (loading: boolean) => {
        this.loading = loading
    }

    saveResult = (data: any, lsKey: string) => {
        console.log(data, lsKey)
        if (lsKey === LSPuzzles) {
            return this.savePuzzles(data, lsKey)
        } else {
            localStorage.setItem(lsKey, data)
            if (lsKey === LSName) {
                this.userName = data
            }
            if (lsKey === LSToken) {
                this.token = data
            }
        }
    }

    savePuzzles = (data: any, lsKey: string) => {
        console.log(data, lsKey)
        if (data.length && !this.puzzles.length) {
            localStorage.setItem(lsKey, JSON.stringify(data))
            this.puzzles = data
        } else if (data.length) {
            const puzzles = this.puzzles.concat(data)
            localStorage.setItem(lsKey, JSON.stringify(puzzles))
            this.puzzles = puzzles
        }
        this.$puzzles.emit(this.puzzles)
    }

    saveError = (message: string) => {
        this.error.message = message
    }

    updatePuzzles = async (url = this.url, options = this.options) => {
        console.log(this.token)
        if (this.token) {
            this.setIsLoading(true)
            makeFetch(url, options).then(res => {
                const {resData, error} = res
                resData && this.saveResult(resData, LSPuzzles)
                error && this.saveError(error.message)
            });
            this.setIsLoading(false)
            return
        }
        await this.getToken()
        makeFetch(url, options).then(res => {
            const {resData, error} = res
            resData && this.saveResult(resData, LSPuzzles)
            error && this.saveError(error.message)
        });
        this.setIsLoading(true)

        this.setIsLoading(false)
    }
}

export const puzzlesManager = new PuzzlesManager()


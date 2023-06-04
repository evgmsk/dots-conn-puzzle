import { LSPuzzles } from "../constant/constants";

import {
    getPuzzlesFromStorage,
    getUserPuzzlesFromStorage,
    // isDev,
} from "../helper-fns/helper-fn";

import {authService} from './auth-service'

import {IPuzzle} from "../constant/interfaces";
import {Observable} from "./observable";
import {addsService} from "./adds-service";

export class PuzzlesManager {
    puzzles = getPuzzlesFromStorage()
    customPuzzles = getUserPuzzlesFromStorage()
    loading = false
    error = {} as {message: string}
    options = {method: 'GET'} as {[k:string]: any}
    unresolvedPuzzle = null as unknown as IPuzzle
    createdBefore = new Date()
    createdAfter =  new Date()
    creator = authService.user.followed || [] as string[]
    rating = 0
    addsTimeout = 30
    numberOfGrades = 0
    square = {from: 9, to: undefined}
    diffFrom = authService.user.level
    diffTo = 0
    graded = true
    $puzzles = new Observable<IPuzzle[]>(this.puzzles)
    $unresolved = new Observable<IPuzzle>(this.unresolvedPuzzle)
    $loading = new Observable<boolean>(this.loading)
    $error = new Observable<{message: string}>(this.error)
    $customPuzzles = new Observable<IPuzzle[]>(this.customPuzzles)
    $graded = new Observable(this.graded)
    $creator = new Observable(this.creator)

    constructor() {
        this.createdBefore.setDate(this.createdBefore.getDate() - 1)
        if (this.puzzles.length < 10) {
            console.log('get puzzles', this.puzzles.length)
            this.updatePuzzles().then(() => console.log('updated'))
        }
        if (!authService.token) {
            authService.getToken().then(() => {
                console.log('token received')
            })
        }
    }

    addCreatorToFollow = (creator: string) => {
        this.creator = creator
        this.$creator.emit(this.creator)
    }

    setGraded = (grade: boolean) => {
        this.graded = grade
        if (grade) {
            this.setUnresolved()
            addsService.setAddsShown(false)
        }
        this.$graded.emit(this.graded)
    }

    setDiffFrom = (diff: number) => {
        this.diffFrom = diff
    }

    setDiffTo = (diff: number) => {
        this.diffTo = diff
    }

    setNumberOfGrades = (number: number) => {
        this.numberOfGrades = number
    }

    setCreator = (creator: string) => {
        this.creator = creator
    }

    setRating = (rating: number) => {
        this.rating = rating
    }

    setBefore = (days: number) => {
        this.createdBefore = new Date()
        this.createdBefore.setDate(this.createdBefore.getDate() - days)
    }

    setAfter = (days: number) => {
        this.createdAfter = new Date()
        this.createdAfter.setDate(this.createdBefore.getDate() - days)
    }

    handleSavePuzzle = async (puzzle = this.unresolvedPuzzle, puzzles = [] as IPuzzle[]) => {
        const _puzzles = puzzles.concat(puzzle)
        localStorage.setItem(LSPuzzles, JSON.stringify(_puzzles))
        const options = {
            method: 'POST',
            headers: authService.tokenizedHeadersPost(),
            body: JSON.stringify({data: puzzle})
        }
        const url = 'puzzles/new'
        await authService.makeFetch(url, options)
    }

    setUnresolved = (puzzle = null as unknown as IPuzzle) => {
        this.unresolvedPuzzle = puzzle
        // console.log(this.$unresolved.subscribers, puzzle)
        this.$unresolved.emit(this.unresolvedPuzzle)
    }

    setOptions = (opts: {[k:string]: any}) => {
        this.options = opts
    }

    getUrlForSystemPuzzles = () => {
        const admin = authService.user.name === 'admin'
        const level = (authService.user.level || 0) + (this.puzzles.length ? 5 : 0)
        return !admin
            ? `puzzles?system=true&difficulty=${level}_${level + (this.puzzles.length ? 5 : 10)}`
            : `puzzles?system=true&difficulty=${0}`
    }

    getUrl = (system = true, _url = 'puzzles') => {
        if (system) {
           return this.getUrlForSystemPuzzles()
        }
        const diff = this.diffFrom ? `&difficulty=${this.diffFrom}_${this.diffTo || ''}` : ''
        const square = this.square.to
            ? `&square=${this.square.from}_${this.square.to}`
            : (this.square.from === 9 ? '' : '&square=' + this.square.from)
        const createdAt = this.createdAfter ? `&createdAt=${this.createdAfter}-${this.createdBefore}` : ''
        const creator = this.createdAfter ? `&createdAt=${this.createdAfter}-${this.createdBefore}` : ''
        const url = `${_url}${diff}${createdAt}${square}`
        return url
    }

    setIsLoading = (loading: boolean) => {
        this.loading = loading
        this.$loading.emit(this.loading)
    }

    saveMainPuzzles = (data: IPuzzle[]) => {
        if (data.length && !this.puzzles.length) {
            localStorage.setItem(LSPuzzles, JSON.stringify(data))
            this.puzzles = data
        } else if (data.length) {
            const puzzles = this.puzzles.concat(data)
            localStorage.setItem(LSPuzzles, JSON.stringify(puzzles))
            this.puzzles = puzzles
        }
        this.$puzzles.emit(this.puzzles)
    }

    saveCustomPuzzles = (puzzles: IPuzzle[]) => {
        this.customPuzzles = this.customPuzzles.concat(puzzles).slice(-20)
        this.$customPuzzles.emit(this.customPuzzles)
    }

    saveError = (message: string) => {
        this.error.message = message
        this.$error.emit(this.error)
    }

    updatePuzzles = async (
        url = this.getUrl(),
        options = this.options,
        system = true
    ) => {
        if (authService.token) {
            this.setIsLoading(true)
            authService.makeFetch(url, options).then(res => {
                const {resData, error} = res
                error && this.saveError(error.message)
                if (resData) {
                    system && this.saveMainPuzzles(resData)
                    !system && this.saveCustomPuzzles(resData)
                }
            });
            this.setIsLoading(false)
            return
        }
        this.setIsLoading(true)
        await authService.getToken().then(() => {})
        await authService.makeFetch(url, options).then(res => {
            const {resData, error} = res
            if (resData) {
                system && this.saveMainPuzzles(resData)
                !system && this.saveCustomPuzzles(resData)
            }
            error && this.saveError(error.message)
        })
        this.setIsLoading(false)
    }
}

export const puzzlesManager = new PuzzlesManager()

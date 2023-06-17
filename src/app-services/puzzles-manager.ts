import {Admin, LSPuzzles, LSUserPuzzles, OneDay, StartDate} from "../constant/constants";

import {
    getPuzzlesFromStorage,
    getUserPuzzlesFromStorage, getUTCDate, isDev,
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
    queryOptions = {
        createdAt: {
            date: StartDate,
            after: true},
        rating: {value: 0, over: true},
        numberOfGrades: {value: 0, over: true},
        square: {value: 9, from: true},
        difficulty: {
            level: authService.user.role === Admin ? 0 :authService.user.level || 0,
            over: true
        },
        followed: true
    }
    graded = true
    requestingSystem = false
    lastRequest = Date.now() - OneDay

    $requestSystem = new Observable<boolean>(this.requestingSystem)
    $puzzles = new Observable<IPuzzle[]>(this.puzzles)
    $unresolved = new Observable<IPuzzle>(this.unresolvedPuzzle)
    $loading = new Observable<boolean>(this.loading)
    $error = new Observable<{message: string}>(this.error)
    $customPuzzles = new Observable<IPuzzle[]>(this.customPuzzles)
    $graded = new Observable(this.graded)

    // $creator = new Observable(this.creator)

    constructor() {
        if (!authService.token) {
            authService.getToken().then(() => {
                console.log('token received')
            })
        }
        this.checkIfPuzzlesUpToDate()
    }

    checkIfPuzzlesUpToDate = () => {
        // console.log('puzzles length', this.puzzles.length, this.customPuzzles.length)
        if (this.puzzles.length <= 5) {
            this.updatePuzzles(true).then(() => console.log('system updated'))
        }
        if (Date.now() - this.lastRequest >= OneDay) {
            this.queryOptions.createdAt.date = getUTCDate() - OneDay
            this.updatePuzzles(false).then((a) => console.log('custom updated', a))
            this.lastRequest = Date.now()
        }
    }

    setRequestSystem = (sys: boolean) => {
        this.requestingSystem = sys
        this.$requestSystem.emit(this.requestingSystem)
    }

    setGraded = (grade: boolean) => {
        this.graded = grade
        if (grade) {
            this.setUnresolved()
            addsService.setAddsShown(false)
        }
        this.$graded.emit(this.graded)
    }

    setDifficultyOption = (diff: number) => {
        this.queryOptions.difficulty.level = diff
    }

    setDiffLowerLimit = (lim: boolean) => {
        this.queryOptions.difficulty.over = lim
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
        // console.log(this.unresolvedPuzzle, puzzle)
        this.$unresolved.emit(this.unresolvedPuzzle)
    }

    setOptions = (opts: {[k:string]: any}) => {
        this.options = opts
    }

    getDiffQuery = (admin = authService.user.role === Admin) => {
        const {level, over} = this.queryOptions.difficulty
        return over ? `?difficulty=${level}` : `?difficulty=${[0, level]}`
    }

    getDateQuery = () => {
        const {date, after} = this.queryOptions.createdAt
        return after ? `&createdAt=${date}` : `&createdAt=${[StartDate, date]}`
    }

    getRatingQuery = () => {
        const {value, over} = this.queryOptions.rating
        return over ? `&rating=${value}` : `&rating=${[0, value]}`
    }

    getGradesQuery = () => {
        const {value, over} = this.queryOptions.numberOfGrades
        return over ? `&grade=${value}` : `&grade=${[0, value]}`
    }

    getUserQuery = () => {
        const {followed} = this.queryOptions
        const followedUsers = authService.user.followed
        const blockedUsers = authService.user.blocked
        if (followed && followedUsers?.length) {
            return `&createdBy=${['$in', ...followedUsers]}`
        }
        if (!followed && blockedUsers?.length) {
            return `&createdBy=${['$nin', ...blockedUsers]}`
        }
        return ''
    }

    getUrlForSystemPuzzles = () => {
        const admin = authService.user.name === Admin
        const level = (authService.user.level || 0) + (this.puzzles.length ? 5 : 0)
        return !admin
            ? `puzzles?system=true&difficulty=${[level, level + (this.puzzles.length ? 5 : 10)]}`
            : `puzzles?system=true&difficulty=${0}`
    }

    getUrl = (system = this.requestingSystem, _url = 'puzzles') => {
        if (system) {
           return this.getUrlForSystemPuzzles()
        }
        const diff = this.getDiffQuery()
        const date = this.getDateQuery()
        const rating = this.getRatingQuery()
        const grade = this.getGradesQuery()
        const user = this.getUserQuery()
        return `${_url}${diff}${rating}${user}`
    }

    setIsLoading = (loading: boolean) => {
        this.loading = loading
        this.$loading.emit(this.loading)
        console.log('is loading', this.loading)
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
        this.customPuzzles = this.customPuzzles.concat(puzzles)
        localStorage.setItem(LSUserPuzzles, JSON.stringify(this.customPuzzles.slice(-40)))
        this.$customPuzzles.emit(this.customPuzzles)
    }

    saveError = (message: string) => {
        this.error.message = message
        this.$error.emit(this.error)
    }

    deletePuzzle = async () => {
        if (authService.user.role !== Admin) return
        const url = `puzzles/:${this.unresolvedPuzzle._id}`
        await authService.makeFetch(url, {method: 'DELETE'})
            .then(d => console.log(d))
            .catch(e => console.log(e))
    }

    updatePuzzle = () => {
        if (authService.user.role !== Admin) return
        const url = `puzzles/:${this.unresolvedPuzzle._id}`
        authService.makeFetch(url, {method: 'DELETE'})
            .then(d => console.log(d))
            .catch(e => console.log(e))
    }

    updatePuzzles = async (
        system = this.requestingSystem,
        url = this.getUrl(system),
        options = this.options
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
                // isDev() && console.log('data', resData, system, this.puzzles, this.customPuzzles)
            });
            this.setIsLoading(false)
            return
        }
        this.setIsLoading(true)
        await authService.getToken().then()
        authService.makeFetch(url, options).then(res => {
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

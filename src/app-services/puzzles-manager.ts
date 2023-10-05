import {Admin, LSPuzzles, LSUserPuzzles, OneDay, StartDate} from "../constant/constants";

import {
    getPuzzlesFromStorage,
    getUserPuzzlesFromStorage, getUTCDate
    // isDev,
} from "../utils/helper-fn";

import {authService} from './auth-service'

import {IPuzzle, IQueryOption, IQueryOptions} from "../constant/interfaces";
import {Observable} from "./observable";
import {addsService} from "./adds-service";
import {PuzzleResolver} from "../puzzle-engine/rect-resolver";

export class PuzzlesManager {
    puzzles = getPuzzlesFromStorage()
    customPuzzles = getUserPuzzlesFromStorage()
    loading = false
    error = {} as {message: string}
    options = {method: 'GET'} as {[k:string]: any}
    unresolvedPuzzle = null as unknown as IPuzzle
    resolveCreated = false
    queryOptions: IQueryOptions = {
        createdAt: {
            date: StartDate,
            andAfter: true},
        rating: {value: 0, andAbove: true},
        grades: {value: 0, andAbove: true},
        size: {value: 12, size: '3x4'},
        difficulty: {
            value: authService.user.role === Admin ? 0 :authService.user.level || 0,
            andAbove: true
        },
        authors: {
            followed: authService.user.followed || [],
            blocked: authService.user.blocked || []
        }
    }
    graded = true
    requestingSystem = false
    lastRequest = Date.now() - OneDay
    resolver = {} as PuzzleResolver
    filters = false

    $queryOptions = new Observable<IQueryOptions>(this.queryOptions)
    $filters = new Observable<boolean>(this.filters)
    $requestSystem = new Observable<boolean>(this.requestingSystem)
    $puzzles = new Observable<IPuzzle[]>(this.puzzles)
    $unresolved = new Observable<IPuzzle>(this.unresolvedPuzzle)
    $loading = new Observable<boolean>(this.loading)
    $error = new Observable<{message: string}>(this.error)
    $customPuzzles = new Observable<IPuzzle[]>(this.customPuzzles)
    $graded = new Observable(this.graded)
    $resolveCreated = new Observable(this.resolveCreated)

    // $creator = new Observable(this.creator)

    constructor() {
        if (!authService.token) {
            authService.getToken().then(() => {
                console.log('token received')
            })
        }
        this.checkIfPuzzlesUpToDate()
    }

    setFilters = () => {
        this.filters = !this.filters
        this.$filters.emit(this.filters)
    }

    updateQueryOptions = (options: Partial<IQueryOptions>) => {
        this.queryOptions = {...this.queryOptions, ...options}
        this.$queryOptions.emit(this.queryOptions)
    }

    setResolver = (resolver: PuzzleResolver) => {
        this.resolver = resolver
    }

    checkIfPuzzlesUpToDate = () => {
        // console.log('puzzles length', this.puzzles.length, this.customPuzzles.length)
        if (this.puzzles.length <= 5) {
            this.getPuzzles(true).then(() => console.log('system updated'))
        }
        if (Date.now() - this.lastRequest >= OneDay) {
            this.queryOptions.createdAt.date = getUTCDate() - OneDay
            this.getPuzzles(false).then((a) => console.log('custom updated', a))
            this.lastRequest = Date.now()
        }
    }

    setRequestSystem = (sys: boolean) => {
        this.requestingSystem = sys
        if (puzzlesManager.filters) {
            puzzlesManager.setFilters()
        }
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

    setDifficultyOption = (data: IQueryOption) => {
        this.queryOptions.difficulty = data
    }

    setDiffLowerLimit = (lim: boolean) => {
        this.queryOptions.difficulty.andAbove = lim
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
        this.$unresolved.emit(this.unresolvedPuzzle)
    }

    setOptions = (opts: {[k:string]: any}) => {
        this.options = opts
    }

    setResolveCreated = () => {
        this.resolveCreated = !this.resolveCreated
        this.$resolveCreated.emit(this.resolveCreated)
    }

    getDiffQuery = (admin = authService.user.role === Admin) => {
        if (admin) {
            return '?difficulty=0'
        }
        const {value, andAbove} = this.queryOptions.difficulty
        return andAbove ? `?difficulty=${value}` : `?difficulty=${[0, value]}`
    }

    getDateQuery = () => {
        const {date, andAfter} = this.queryOptions.createdAt
        return andAfter ? `&createdAt=${date}` : `&createdAt=${[StartDate, date]}`
    }

    getRatingQuery = () => {
        const {value, andAbove} = this.queryOptions.rating
        return andAbove ? `&rating=${value}` : `&rating=${[0, value]}`
    }

    getGradesQuery = () => {
        const {value, andAbove} = this.queryOptions.grades
        return andAbove ? `&grade=${value}` : `&grade=${[0, value]}`
    }

    getUserQuery = () => {
        const {authors: {followed, blocked}} = this.queryOptions
        if (followed && followed?.length) {
            return `&createdBy=${['$in', ...followed]}`
        }
        if (!followed && blocked?.length) {
            return `&createdBy=${['$nin', ...blocked]}`
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
        console.log('puzzles', this.puzzles)
        this.$puzzles.emit(this.puzzles)
    }

    saveCustomPuzzles = (puzzles: IPuzzle[]) => {
        this.customPuzzles = this.customPuzzles.concat(puzzles)
        localStorage.setItem(LSUserPuzzles, JSON.stringify(this.customPuzzles.slice(-40)))
        console.log('custom puzzles', this.customPuzzles, puzzles)
        this.$customPuzzles.emit(this.customPuzzles)
    }

    saveError = (message: string) => {
        this.error.message = message
        this.$error.emit(this.error)
    }

    deletePuzzle = async () => {
        if (authService.user.role !== Admin) return
        console.log(this.unresolvedPuzzle._id)
        const url = `puzzles/${this.unresolvedPuzzle._id}`
        await authService.makeFetch(url, {method: 'DELETE'})
            .then(d => console.log(d))
            .catch(e => console.log(e))
    }

    updatePuzzle = () => {
        if (authService.user.role !== Admin) return
        const url = `puzzles/${this.unresolvedPuzzle._id}`
        console.log(url)
        authService.makeFetch(url, {method: 'PUT',
            headers: authService.tokenizedHeadersPost(),
            body: JSON.stringify({data: this.unresolvedPuzzle})})
            .then(d => console.log(d))
            .catch(e => console.log(e))
    }

    getPuzzles = async (
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

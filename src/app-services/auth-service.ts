import {Observable} from "./observable";
import {BaseDevUrl, BaseProdUrl, LSToken, LSUser} from "../constant/constants";
import {IUser} from "../constant/interfaces";
import {isDev} from "../helper-fns/helper-fn";


export class AuthService {
    private _token = localStorage.getItem(LSToken)
    private _user = JSON.parse(localStorage.getItem(LSUser) || '{}') as IUser
    $user = new Observable(this._user)
    $token = new Observable(this._token)
    tokenError = {} as {message: string}
    $tokenError = new Observable(this.tokenError)
    guestTokenUrl = 'auth/token'
    adminTokenUrl = 'auth/admin'

    getAdminToken = async (password: string) => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify({password})
        }
        await this.makeFetch(this.adminTokenUrl, options).then(res => {
            const {resData, error} = res
            console.log(resData)
            this.setToken(resData?.token)
            this.setUser(resData?.user)
            if (error) {
                this.tokenError.message = error.message
                this.$tokenError.emit(this.tokenError)
            }
        });
    }

    async makeFetch(urlSuffix: string, opts: {[k: string]: any} = {method: 'GET'}) {
        opts.headers = {...opts.headers, ...this.tokenizedHeaders()}
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

    tokenizedHeaders = () => ({
        Authentication: `bearer-${this._token}`,
    })

    tokenizedHeadersPost = () => ({
        Authentication: `bearer-${this._token}`,
        "Content-Type": "application/json",
    })

    getToken = async () => {
        await this.makeFetch(this.guestTokenUrl).then(res => {
            const {resData, error} = res
            console.log(resData)
            this.setToken(resData?.token)
            this.setUser(resData?.user)
            if (error) {
                this.tokenError.message = error.message
            }
        });
    }

    setLevel = (level: number) => {
        this._user.level = level
        localStorage.setItem(LSUser, JSON.stringify(this._user))
        this.$user.emit()
    }

    setUser = (user: IUser) => {
        this._user = user
        localStorage.setItem(LSUser, JSON.stringify(this._user))
        console.log('new user', user)
        this.$user.emit(this._user)
    }

    setToken = (token: string) => {
        this._token = token
        localStorage.setItem(LSToken, token)
        this.$token.emit(this._token)
    }

    get user() {
        return this._user
    }

    get token() {
        return this._token
    }
}

export const authService = new AuthService()

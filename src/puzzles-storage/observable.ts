import {isDev} from "../helper-fns/helper-fn";

export class Observable<T> {
    data: T
    subscribers = {} as {[k: string]: Function}
    constructor(data: T = null as unknown as T) {
        this.data = data
    }

    emit = (data: T) => {
        this.data = data
        for (const key in this.subscribers) {
            this.subscribers[key](this.data)
        }
    }

    subscribe = (sub: Function) => {
        const key = `${Math.floor(Math.random()*10000)}-${sub.name}`
        this.subscribers[key] = sub
        isDev() && console.log(key, this.subscribers)
        return this.unsubscribe(key)
    }

    unsubscribe = (key: string) => {
        return () => {
            delete this.subscribers[key]
        }
    }
}

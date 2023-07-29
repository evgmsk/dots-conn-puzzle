// export enum LineError {
//     broken = 'broken',
//     endpoint = 'one endpoint',
//     extra = 'extra points',
//     no = 'no error'
// }

export interface IUser {
    name: string,
    level: number,
    role: 'admin' | 'user',
    followed: SA,
    blocked: SA,
    resolved?: SA,
    [k: string]: any
}

export interface IFingerShadow {
    dir: string
    color: string
    pos: IPos
}

export interface IPos {x: number, y: number}

export interface IRectProps {
    dimension: IRectDimension
    points: ITPoints
    mouseColor?: string
    mouseDown?: string
    creator?: boolean
    highlightedEndpoints?: SA
}

// export type GameMode = 'create' | 'resolve' | 'generate'

export interface IPuzzleProps extends IRectProps {
    handlers: IHandlers
}

export interface IHandlers {
    [key: string]: Function
}

export interface IDotSectorProps {
    dir: LineDirections,
    turn?: LineDirections,
    fill?: string,
    line?: string
    crossLine?: string
    joinPoint?: string
}

export interface IColorBTN {
    selected: boolean
    color: string
}

export interface IRectDimension {
    width: number
    height: number
}

export interface ISector {
    dir: LineDirections
}

export interface IConnection {
    neighbor?: string
    color: string
}

export interface IDotConnections {
    [dir: string | LineDirections]: IConnection
}

// export interface IPointValue {
//     xy: number[]
// }

export enum LineDirections {
    bottom = 'bottom',
    left = 'left',
    right = 'right',
    top = 'top', 
}

export interface IDLines {
    [key: string]: {line: SA, color: string}
}

export interface ISLines {
    [color: string]: SA[]
}

export interface ILines {
    [color: string]: ITPoints
}

export interface IPuzzle {
    _id?: number | string
    name: string
    createdAt?: number
    createdBy: string | number
    lines?: ISLines
    width: number
    height: number
    difficulty: number
    points: ITPoints
}

// export interface IStartPoints {
//     [color: string]: SA
// }

export interface IPath {
    dist: number,
    path: SA,
    target: string,
    index?: number
}

export interface ITakenPointProps {
    endpoint: boolean
    connections: IDotConnections
    indKey?: string
    crossLine?: SA
    joinPoint?: SA
    highlighted?: boolean
    startPoint?: boolean
}

export type SA = string[]

export interface ITPoints {
    [key: string]: ITakenPointProps
}

export interface IEndpoints {
    [key: string]: IEndpointsValue
}

export interface IEndpointsValue {
    coords1: number[]
    coords2: number[]
    intervals: {x: number, y: number}
    meddling: number
    color: string
    keys: SA
    resolved?: boolean
}

// export interface IPoint {
//    [key: string]: IPointValue
// }

export interface IRectCell {
    [key: string]: {neighbors: SA, point: number[]}
}

export interface ILinedRect {
    _width: number
    _height: number
    rect: IRectCell
    _takenPoints: ITPoints
}

export interface ICollision {
    sameColor?: boolean
    joinPoint?: boolean
    sameLine?: SA
}

export interface IScrollBar {
    container: HTMLElement
    numberOfRows?: number
    currentScroll?: number
    orientation?: number
    behavior?: ScrollBehavior
}

export interface IScroll {
    container: HTMLElement | string
    progressBar: HTMLElement | string
    slider: HTMLElement | string
    numberOfRows: number
    currentScroll: number
    orientation: number
}

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
    followed: string[],
    blocked: string[],
    resolved?: string[],
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
    points: ITakenPoints
    mouseColor?: string
    mouseDown?: string
    creator?: boolean
    highlightedEndpoints?: string[]
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

export interface ISLines {
    [color: string]: string[][]
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

export interface ILines {
    [color: string]: ITakenPoints
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
    points: ITakenPoints
}

// export interface IStartPoints {
//     [color: string]: string[]
// }

export interface ITakenPointProps {
    endpoint: boolean
    connections: IDotConnections
    indKey?: string
    crossLine?: string[]
    joinPoint?: string[]
    highlighted?: boolean
    startPoint?: boolean
}

export interface ITakenPoints {
    [key: string]: ITakenPointProps
}

export interface IEndpoints {
    [color: string]: IEndpointsValue[]
}

export interface IEndpointsValue {
    pairKey: string
    coords1: number[]
    coords2: number[]
    intervals: {x: number, y: number}
    difficulty?: number
    resolved?: boolean
}

// export interface IPoint {
//    [key: string]: IPointValue
// }

export interface IRectCell {
    [key: string]: {neighbors: string[], point: number[]}
}

export interface ILinedRect {
    _width: number
    _height: number
    rect: IRectCell
    _takenPoints: ITakenPoints
}

// export interface CurrentLine {
//     [startPoint: string]: {
//         points: string[]
//         resolved?: boolean
//     }
// }

// export interface CurrentLines {
//     [color: string]: CurrentLine
// }

export interface ICollision {
    sameColor?: boolean
    joinPoint?: boolean
    sameLine?: string[]
}

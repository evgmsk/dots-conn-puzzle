export interface IRectProps {
    dimension: IRRectDimension,
    points: ITakenPoints,
    mouseColor?: string
}

export type PuzzleMode = 'create' | 'resolve' | 'generate'

export interface IPuzzleProps extends IRectProps {
    handlers: IHandlers
}

export interface IPuzzles {
    puzzles: IRectProps[]
    handlers?: IHandlers
}

export interface IHandlers {
    [key: string]: Function
}

export interface ISwitcherProps {
    handlers: IHandlers
    mode: PuzzleMode
}

export interface IDotSectorProps {
    dir: LineDirections,
    line: string,
    turn?: LineDirections,
    fill: string
}

export interface IColorBTN {
    selected: boolean
    color: string
}

export interface IRRectDimension {
    width: number
    height: number
}

export interface IConnection {
    dir: LineDirections,
    neighbor?: string
}

export interface IDotConnections {
    [color: string]: IConnection[]
}

export interface IPointValue {
    xy: number[]
}

export enum LineDirections {
    bottom = 'bottom',
    left = 'left',
    right = 'right',
    top = 'top', 
}

export interface ILineProps {
    dots?: ITakenPoints
    defaultDotsNumber: number
    currentDotsNumber: boolean
    resolved: boolean
}

export interface ILines {
    [color: string]: ILineProps
}

export interface IPuzzle {
    name: string
    startPoints: ITakenPoints
    dotsSegragatedByColor: {[key: string]: ITakenPoints}
    width: number
    height: number
    difficulty?: number
}

export interface IStartPoint {
    key: string,
    coordinates?: number[],
    color?: string
    connections?: IDotConnections
}

export interface ITakenPointProps {
    utmost: boolean
    connections: IDotConnections
    inv?: string
}

export interface ITakenPoints {
    [key: string]: ITakenPointProps
}

export interface IStartPoints {
    [color: string]: IStartPoint[]
}


export interface IUtmostPoints {
    [color: string]: UtmostPointsValue
}

export interface IUpContext {
    freeCells: boolean
    sameColorNeighbors?: ISameColorNeighbor
}

export interface ISameColorNeighbor {
    utmost?: boolean
    sameLine?: boolean
    key: string
}

export interface UtmostPointsValue {
    points?: IPoint
    key: string
    intervals?: {x: number[], y: number[]}
    difficulty?: number
    resolved?: boolean
}

export interface IPoint {
   [key: string]: IPointValue
}

export interface IRectCell {
    [key: string]: {neighbors: string[], point: number[]}
}

export interface ILinedRect {
    _width: number
    _height: number
    rect: IRectCell
    _takenPoints: ITakenPoints
    _utmostPoints: IStartPoints
}

export interface ICollision {
    sameColor?: boolean
    joinPoint?: boolean
    sameLine?: boolean
}

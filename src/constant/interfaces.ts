export interface IRectProps {
    dimention: IRectDimention,
    points: ITakenPoints,
}

export type PuzzleMode = 'create_custom' | 'resolve' | 'generate'

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

export interface IPointSectorProps {
    dir: LineDirections,
    line: boolean,
    turn: LineDirections | null,
    color: string,
    fill: string
}

export interface IColorBTN {
    selected: boolean
    color: string
}

export interface IRectDimention {
    width: number
    height: number
}

export interface IPointConnections {
    [color: string]: LineDirections[]
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

export interface IStartPoint {
    key: string,
    coordinates: number[],
    color: string,
    connections: IPointConnections
}

export interface ITakenPoints {
    [key: string]: IPointConnections
}

export interface IUtmostPoints {
    [key: string]: UtmostPointsValue
}

export interface UtmostPointsValue {
    points: IPoint
    intervals: {x: number[], y: number[]}
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
}


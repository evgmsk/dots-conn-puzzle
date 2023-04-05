import {IConnection, LineDirections} from "./interfaces";

export const MinLinesNumber = 4
export const LineColors = [
    'lightgray', 'blue', 'green', 'red', 'orange', 'yellow', 'purple', 'aqua', 'brown', 
]

export const DefaultSectors = [
    {dir: LineDirections.top},
    {dir: LineDirections.right},
    {dir: LineDirections.left},
    {dir: LineDirections.bottom},
]

export const DefaultColor = LineColors[0]

export const DefaultConnections = {
    [LineDirections.top]: {color: DefaultColor} as IConnection,
    [LineDirections.left]: {color: DefaultColor} as IConnection,
    [LineDirections.right]: {color: DefaultColor} as IConnection,
    [LineDirections.bottom]: {color: DefaultColor} as IConnection
}

export const Width = 6
export const Height = 6 

export const LocalStorageName = 'dot_puzzles'

export const Congratulations = [
    'Great!', 'Fantastic!', 'Awesome!', 'Incredible!', 'Good!', 'Perfect!'
]

export const ResolveModalQuestions = {
    next: 'Open next puzzle?',
    new: 'Create own puzzle'
}



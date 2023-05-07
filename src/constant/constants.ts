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

export const LSName = 'dot_puzzles_name'
export const LSToken = 'dot_puzzles_token'
export const LSLevel = 'dot_puzzles_level'
export const LSAdmin = 'dot_puzzles_admin'
export const LSPuzzles = 'dot_puzzles'

export const Admin = 'admin'

export const Congratulations = [
    'Great!', 'Fantastic!', 'Awesome!', 'Incredible!', 'Good!', 'Perfect!'
]

export const ResolveModalQuestions = {
    next: 'Open next puzzle?',
    new: 'Create own puzzle'
}

export const BaseDevUrl = 'http://localhost:5000'
export const BaseProdUrl = ''

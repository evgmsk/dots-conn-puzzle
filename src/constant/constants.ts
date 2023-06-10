import {IConnection, LineDirections} from "./interfaces";

export const StartDate = 1685221672630
export const OneDay = 24 * 3600000

export const MinLinesNumber = 4
export const LineColors = [
    'lightgrey',
    'red',
    'orange',
    'amber',
    // 'brown',
    'yellow',
    'lime',
    'green',
    'darkgreen',
    // 'cian',
    'aqua',
    'blue',
    // 'darkblue',
    'violet',
    'purple',
    // 'fuchsia',
    'pink',
    'rose',
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
export const Height = 8

export const LSUser = 'dot_puzzles_user'
export const LSToken = 'dot_puzzles_token'
export const LSPuzzles = 'dot_puzzles'
export const LSUserPuzzles = 'dot_puzzles_custom'
export const LSUserCreatedPuzzle = 'dot_puzzles_created-puzzle'

export const Admin = 'admin'

export const Congratulations = [
    'Great!', 'Fantastic!', 'Awesome!', 'Incredible!', 'Good!', 'Perfect!'
]

export const BaseDevUrl = 'http://localhost:5000'
export const BaseProdUrl = ''

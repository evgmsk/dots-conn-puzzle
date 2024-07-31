import {IConnection, LineDirections, SA} from "./interfaces";
import {square} from "../utils/helper-fn";

export const StartDate = 1685221672630
export const OneDay = 24 * 3600000

export const MinLinesNumber = 4

export const MaxPuzzleWidth = 18
export const MaxPuzzleHeight = 22
export const MinPuzzleHeight = 4
export const MinPuzzleWidth = 3

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

export const ErrorTiming = 10000

export const Sizes = ['3x4', '4x5', '5x6', '5x7', '6x7', '6x8', '7x8', '7x9',
    '8x9', '8x10', '9x10', '9x11', '9x12', '10x11', '10x12', '10x13', '11x12',
    '11x13', '11x14', '12x13', '12x14', '12x15', '12x16', '13x14', '13x15', '13x16',
    '14x15', '14x16', '14x17', '14x18', '15x16', '15x17', '15x18', '15x19', '16x17', '16x18', '16x19',
    '16x20', '18x19', '18x20', '18x21', '18x22', '20x21', '20x22', '20x23', '20x24']

const sortSizesBySquare = (sizes: SA) => sizes.sort((a, b) => {
    return square(a) - square(b)
})

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

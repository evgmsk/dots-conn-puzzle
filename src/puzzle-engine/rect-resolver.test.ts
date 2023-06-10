
import {PuzzleResolver} from './rect-resolver'
import {IPuzzle} from "../constant/interfaces";
// import {defaultConnectionsWithColor, isDev, sectorIndex} from '../helper-fns/helper-fn'
// import {DefaultColor} from "../constant/constants";
// import {LineDirections} from "../constant/interfaces";
// import {manager} from '../puzzles-storage/puzzles-manager'


describe('test rect-resolver methods', () => {
    const puzzleData: IPuzzle = {
        'createdBy': '',
        'createdAt': Date.now(),
        "name": "puzzle4x4_colors4",
        "difficulty": 17,
        "lines": {'yellow': [['0-0', '1-0', '2-0']]},
        "points": {
            "0-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "yellow"
                    },
                    "left": {
                        "color": "yellow"
                    },
                    "right": {
                        "color": "yellow",
                        "neighbor": "1-0"
                    },
                    "bottom": {
                        "color": "yellow"
                    }
                }
            },
            "1-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "yellow"
                    },
                    "left": {
                        "color": "yellow",
                        "neighbor": "0-0"
                    },
                    "right": {
                        "color": "yellow",
                        "neighbor": "2-0"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "1-1"
                    }
                }
            },
            "2-0": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "yellow"
                    },
                    "left": {
                        "color": "yellow",
                        "neighbor": "1-0"
                    },
                    "right": {
                        "color": "yellow"
                    },
                    "bottom": {
                        "color": "yellow",
                        "neighbor": "2-1"
                    }
                }
            },
            "2-1": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "yellow",
                        "neighbor": "2-0"
                    },
                    "left": {
                        "color": "red",
                        "neighbor": "1-1"
                    },
                    "right": {
                        "color": "red",
                        "neighbor": "3-1"
                    },
                    "bottom": {
                        "color": "yellow",
                        "neighbor": "2-2"
                    }
                }
            },
            "2-2": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "yellow",
                        "neighbor": "2-1"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "1-2"
                    },
                    "right": {
                        "color": "aqua",
                        "neighbor": "3-2"
                    },
                    "bottom": {
                        "color": "yellow",
                        "neighbor": "2-3"
                    }
                }
            },
            "2-3": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "yellow",
                        "neighbor": "2-2"
                    },
                    "left": {
                        "color": "yellow",
                        "neighbor": "1-3"
                    },
                    "right": {
                        "color": "yellow"
                    },
                    "bottom": {
                        "color": "yellow"
                    }
                }
            },
            "1-3": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "yellow"
                    },
                    "left": {
                        "color": "yellow"
                    },
                    "right": {
                        "color": "yellow",
                        "neighbor": "2-3"
                    },
                    "bottom": {
                        "color": "yellow"
                    }
                }
            },
            "1-1": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "1-0"
                    },
                    "left": {
                        "color": "red",
                        "neighbor": "0-1"
                    },
                    "right": {
                        "color": "red",
                        "neighbor": "2-1"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "1-2"
                    }
                }
            },
            "1-2": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "1-1"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "0-2"
                    },
                    "right": {
                        "color": "aqua",
                        "neighbor": "2-2"
                    },
                    "bottom": {
                        "color": "purple"
                    }
                }
            },
            "0-1": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "red"
                    },
                    "left": {
                        "color": "red"
                    },
                    "right": {
                        "color": "red",
                        "neighbor": "1-1"
                    },
                    "bottom": {
                        "color": "red"
                    }
                }
            },
            "3-1": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "red",
                        "neighbor": "3-0"
                    },
                    "left": {
                        "color": "red",
                        "neighbor": "2-1"
                    },
                    "right": {
                        "color": "red"
                    },
                    "bottom": {
                        "color": "red"
                    }
                }
            },
            "3-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "red"
                    },
                    "left": {
                        "color": "red"
                    },
                    "right": {
                        "color": "red"
                    },
                    "bottom": {
                        "color": "red",
                        "neighbor": "3-1"
                    }
                }
            },
            "3-3": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "3-2"
                    },
                    "left": {
                        "color": "aqua"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                }
            },
            "3-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "2-2"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "3-3"
                    }
                }
            },
            "0-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua"
                    },
                    "left": {
                        "color": "aqua"
                    },
                    "right": {
                        "color": "aqua",
                        "neighbor": "1-2"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "0-3"
                    }
                }
            },
            "0-3": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "0-2"
                    },
                    "left": {
                        "color": "aqua"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                }
            },
        },
        "width": 4,
        "height": 4
    }

    const puzzle = new PuzzleResolver(puzzleData)
    // console.warn(puzzle.getPoint('1-0'))
    test('handle enter', () => {
        expect(Object.keys(puzzle.takenPoints).length).toBe(11)
        expect((puzzle.getPoint('1-0')).joinPoint!.length).toBe(2)
        // expect(puzzle.getPoint('1-1').crossLine!.length).toBe(2)
        // expect(puzzle.getPoint('1-0').crossLine).toBe(undefined)
    })

})


import {PuzzleResolver} from './rect-resolver'
import {IPuzzle} from "../constant/interfaces";
// import {defaultConnectionsWithColor, isDev, sectorIndex} from '../helper-fns/helper-fn'
// import {DefaultColor} from "../constant/constants";
// import {LineDirections} from "../constant/interfaces";
// import {manager} from '../puzzles-storage/puzzles-manager'


describe('test rect-resolver methods', () => {
    const puzzleData: IPuzzle = {
        'date': "Mon Mar 13 2023 15:14:10 GMT+0400 (Georgia Standard Time)",
        "name": "puzzle4x4_colors4",
        "difficulty": 17,
        "lines": {
            "yellow": {
                "0-0": {
                    "utmost": true,
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
                    "utmost": true,
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
                    "utmost": false,
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
                    "utmost": true,
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
                    "utmost": true,
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
                    "utmost": false,
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
                    "utmost": true,
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
                }
            },
            "purple": {
                "1-0": {
                    "utmost": true,
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
                "1-1": {
                    "utmost": true,
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
                    "utmost": true,
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
                }
            },
            "red": {
                "2-1": {
                    "utmost": true,
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
                "0-1": {
                    "utmost": true,
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
                "1-1": {
                    "utmost": true,
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
                "3-1": {
                    "utmost": false,
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
                    "utmost": true,
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
                }
            },
            "aqua": {
                "2-2": {
                    "utmost": true,
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
                "3-3": {
                    "utmost": true,
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
                    "utmost": false,
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
                    "utmost": false,
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
                    "utmost": true,
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
                "1-2": {
                    "utmost": true,
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
                }
            }
        },
        "width": 4,
        "height": 4
    }

    const puzzle = new PuzzleResolver(puzzleData)
    test('handle enter', () => {
        expect(Object.keys(puzzle.takenPoints).length).toBe(11)
        expect(puzzle.getPoint('1-0').joinPoint!.length).toBe(2)
        expect(puzzle.getPoint('1-1').crossLine!.length).toBe(2)
        expect(puzzle.getPoint('1-0').crossLine).toBe(undefined)
    })

})

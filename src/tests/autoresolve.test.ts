import {RectCreator} from "../puzzle-engine/rect-creator";
import {defaultConnectionsWithColor} from "../utils/helper-fn";
import {LineColors} from "../constant/constants";

const rect = new RectCreator({width: 6, height: 8})

rect.addTakenPoints({
    "0-0": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "aqua"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "0-1"
            }
        }
    },
    "0-1": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "0-0"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "0-2"
            }
        }
    },
    "0-2": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "0-1"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "0-3"
            }
        }
    },
    "0-3": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "0-2"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua",
                "neighbor": "1-3"
            },
            "bottom": {
                "color": "aqua"
            }
        }
    },
    "1-3": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "1-2"
            },
            "left": {
                "color": "aqua",
                "neighbor": "0-3"
            },
            "right": {
                "color": "aqua",
                "neighbor": "2-3"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "1-4"
            }
        },
        "crossLine": [
            "purple",
            "aqua"
        ]
    },
    "2-3": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua"
            },
            "left": {
                "color": "aqua",
                "neighbor": "1-3"
            },
            "right": {
                "color": "aqua",
                "neighbor": "3-3"
            },
            "bottom": {
                "color": "aqua"
            }
        }
    },
    "3-3": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua"
            },
            "left": {
                "color": "aqua",
                "neighbor": "2-3"
            },
            "right": {
                "color": "aqua",
                "neighbor": "4-3"
            },
            "bottom": {
                "color": "aqua"
            }
        }
    },
    "4-3": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua"
            },
            "left": {
                "color": "aqua",
                "neighbor": "3-3"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "4-4"
            }
        }
    },
    "4-4": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "4-3"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "4-5"
            }
        }
    },
    "4-5": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "4-4"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua",
                "neighbor": "5-5"
            },
            "bottom": {
                "color": "aqua"
            }
        }
    },
    "5-5": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua"
            },
            "left": {
                "color": "aqua",
                "neighbor": "4-5"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "5-6"
            }
        }
    },
    "5-6": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "5-5"
            },
            "left": {
                "color": "aqua"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua",
                "neighbor": "5-7"
            }
        }
    },
    "5-7": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "aqua",
                "neighbor": "5-6"
            },
            "left": {
                "color": "aqua",
                "neighbor": "4-7"
            },
            "right": {
                "color": "aqua"
            },
            "bottom": {
                "color": "aqua"
            }
        }
    },
    "4-7": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "yellow",
                "neighbor": "4-6"
            },
            "left": {
                "color": "orange",
                "neighbor": "3-7"
            },
            "right": {
                "color": "aqua",
                "neighbor": "5-7"
            },
            "bottom": {
                "color": "aqua"
            }
        },
        "joinPoint": [
            "yellow",
            "orange",
            "aqua"
        ]
    },
    "5-1": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "5-0"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "5-0": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple",
                "neighbor": "4-0"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "5-1"
            }
        }
    },
    "4-0": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple",
                "neighbor": "3-0"
            },
            "right": {
                "color": "purple",
                "neighbor": "5-0"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "3-0": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple",
                "neighbor": "2-0"
            },
            "right": {
                "color": "purple",
                "neighbor": "4-0"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "2-0": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple",
                "neighbor": "1-0"
            },
            "right": {
                "color": "purple",
                "neighbor": "3-0"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "1-0": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple",
                "neighbor": "2-0"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "1-1"
            }
        }
    },
    "1-1": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "1-0"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "1-2"
            }
        }
    },
    "1-2": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "1-1"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "1-3"
            }
        }
    },
    "1-4": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "1-3"
            },
            "left": {
                "color": "purple",
                "neighbor": "0-4"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "0-4": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple",
                "neighbor": "1-4"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "0-5"
            }
        }
    },
    "0-5": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "0-4"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "0-6"
            }
        }
    },
    "0-6": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "0-5"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple",
                "neighbor": "0-7"
            }
        }
    },
    "0-7": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "purple",
                "neighbor": "0-6"
            },
            "left": {
                "color": "purple"
            },
            "right": {
                "color": "purple",
                "neighbor": "1-7"
            },
            "bottom": {
                "color": "purple"
            }
        }
    },
    "1-7": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "lime",
                "neighbor": "1-6"
            },
            "left": {
                "color": "purple",
                "neighbor": "0-7"
            },
            "right": {
                "color": "purple"
            },
            "bottom": {
                "color": "purple"
            }
        },
        "joinPoint": [
            "lime",
            "purple"
        ]
    },
    "4-1": {
        "connections": {
            "top": {
                "color": "violet"
            },
            "left": {
                "color": "violet",
                "neighbor": "3-1"
            },
            "right": {
                "color": "violet"
            },
            "bottom": {
                "color": "violet",
                "neighbor": "4-2"
            }
        },
        "endpoint": false
    },
    "4-2": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "violet",
                "neighbor": "4-1"
            },
            "left": {
                "color": "violet"
            },
            "right": {
                "color": "violet",
                "neighbor": "5-2"
            },
            "bottom": {
                "color": "violet"
            }
        }
    },
    "5-2": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "violet"
            },
            "left": {
                "color": "violet",
                "neighbor": "4-2"
            },
            "right": {
                "color": "violet"
            },
            "bottom": {
                "color": "violet",
                "neighbor": "5-3"
            }
        }
    },
    "5-3": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "violet",
                "neighbor": "5-2"
            },
            "left": {
                "color": "violet"
            },
            "right": {
                "color": "violet"
            },
            "bottom": {
                "color": "violet",
                "neighbor": "5-4"
            }
        }
    },
    "5-4": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "violet",
                "neighbor": "5-3"
            },
            "left": {
                "color": "violet"
            },
            "right": {
                "color": "violet"
            },
            "bottom": {
                "color": "violet"
            }
        }
    },
    "3-1": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "violet"
            },
            "left": {
                "color": "violet"
            },
            "right": {
                "color": "violet",
                "neighbor": "4-1"
            },
            "bottom": {
                "color": "violet"
            }
        }
    },
    "2-1": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "green"
            },
            "left": {
                "color": "green"
            },
            "right": {
                "color": "green"
            },
            "bottom": {
                "color": "green",
                "neighbor": "2-2"
            }
        }
    },
    "2-2": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "green",
                "neighbor": "2-1"
            },
            "left": {
                "color": "green"
            },
            "right": {
                "color": "green",
                "neighbor": "3-2"
            },
            "bottom": {
                "color": "green"
            }
        }
    },
    "3-2": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "green"
            },
            "left": {
                "color": "green",
                "neighbor": "2-2"
            },
            "right": {
                "color": "green"
            },
            "bottom": {
                "color": "green"
            }
        }
    },
    "3-4": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "lime"
            },
            "left": {
                "color": "lime",
                "neighbor": "2-4"
            },
            "right": {
                "color": "lime"
            },
            "bottom": {
                "color": "lime"
            }
        }
    },
    "2-4": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "lime"
            },
            "left": {
                "color": "lime"
            },
            "right": {
                "color": "lime",
                "neighbor": "3-4"
            },
            "bottom": {
                "color": "lime",
                "neighbor": "2-5"
            }
        }
    },
    "2-5": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "lime",
                "neighbor": "2-4"
            },
            "left": {
                "color": "lime",
                "neighbor": "1-5"
            },
            "right": {
                "color": "lime"
            },
            "bottom": {
                "color": "lime"
            }
        }
    },
    "1-5": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "lime"
            },
            "left": {
                "color": "lime"
            },
            "right": {
                "color": "lime",
                "neighbor": "2-5"
            },
            "bottom": {
                "color": "lime",
                "neighbor": "1-6"
            }
        }
    },
    "1-6": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "lime",
                "neighbor": "1-5"
            },
            "left": {
                "color": "lime"
            },
            "right": {
                "color": "lime"
            },
            "bottom": {
                "color": "lime",
                "neighbor": "1-7"
            }
        }
    },
    "2-6": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "orange"
            },
            "left": {
                "color": "orange"
            },
            "right": {
                "color": "orange"
            },
            "bottom": {
                "color": "orange",
                "neighbor": "2-7"
            }
        }
    },
    "2-7": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "orange",
                "neighbor": "2-6"
            },
            "left": {
                "color": "orange"
            },
            "right": {
                "color": "orange",
                "neighbor": "3-7"
            },
            "bottom": {
                "color": "orange"
            }
        }
    },
    "3-7": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "orange"
            },
            "left": {
                "color": "orange",
                "neighbor": "2-7"
            },
            "right": {
                "color": "orange",
                "neighbor": "4-7"
            },
            "bottom": {
                "color": "orange"
            }
        }
    },
    "3-5": {
        "endpoint": true,
        "connections": {
            "top": {
                "color": "yellow"
            },
            "left": {
                "color": "yellow"
            },
            "right": {
                "color": "yellow"
            },
            "bottom": {
                "color": "yellow",
                "neighbor": "3-6"
            }
        }
    },
    "3-6": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "yellow",
                "neighbor": "3-5"
            },
            "left": {
                "color": "yellow"
            },
            "right": {
                "color": "yellow",
                "neighbor": "4-6"
            },
            "bottom": {
                "color": "yellow"
            }
        }
    },
    "4-6": {
        "endpoint": false,
        "connections": {
            "top": {
                "color": "yellow"
            },
            "left": {
                "color": "yellow",
                "neighbor": "3-6"
            },
            "right": {
                "color": "yellow"
            },
            "bottom": {
                "color": "yellow",
                "neighbor": "4-7"
            }
        }

    }

})

describe('test autotresolve', function () {
    test('check path', () => {
        const rect = new RectCreator({width: 6, height: 8})
        rect.addTakenPoints(
        {
            "1-2": {
            "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "0-2"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "2-2"
                },
                "bottom": {
                    "color": "orange"
                }
            },
            "endpoint": false
        },
            "0-2": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange",
                        "neighbor": "0-1"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "1-2"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "0-1": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange",
                        "neighbor": "0-0"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange",
                        "neighbor": "0-2"
                }
            }
        },
            "0-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "1-0"
                },
                "bottom": {
                    "color": "orange",
                        "neighbor": "0-1"
                }
            }
        },
            "1-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "0-0"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "2-0"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "2-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "1-0"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "3-0"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "3-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "2-0"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "4-0"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "4-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "3-0"
                },
                "right": {
                    "color": "orange",
                        "neighbor": "5-0"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "5-0": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "4-0"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange",
                        "neighbor": "5-1"
                }
            }
        },
            "5-1": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange",
                        "neighbor": "5-0"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange",
                        "neighbor": "5-2"
                }
            }
        },
            "5-2": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "orange",
                        "neighbor": "5-1"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange",
                        "neighbor": "5-3"
                }
            }
        },
            "5-3": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "orange",
                        "neighbor": "5-2"
                },
                "left": {
                    "color": "orange"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "1-1": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green",
                        "neighbor": "2-1"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "2-1": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green",
                        "neighbor": "1-1"
                },
                "right": {
                    "color": "green",
                        "neighbor": "3-1"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "3-1": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green",
                        "neighbor": "2-1"
                },
                "right": {
                    "color": "green",
                        "neighbor": "4-1"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "4-1": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green",
                        "neighbor": "3-1"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "4-2"
                }
            }
        },
            "4-2": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "4-1"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "4-3"
                }
            }
        },
            "4-3": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "4-2"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "4-4"
                }
            }
        },
            "4-4": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "4-3"
                },
                "left": {
                    "color": "green",
                        "neighbor": "3-4"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "3-4": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green",
                        "neighbor": "4-4"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "3-5"
                }
            }
        },
            "3-5": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "3-4"
                },
                "left": {
                    "color": "green",
                        "neighbor": "2-5"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "2-5": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green",
                        "neighbor": "3-5"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "2-6"
                }
            }
        },
            "2-6": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "2-5"
                },
                "left": {
                    "color": "green",
                        "neighbor": "1-6"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "1-6": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green",
                        "neighbor": "0-6"
                },
                "right": {
                    "color": "green",
                        "neighbor": "2-6"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "0-6": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "green"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green",
                        "neighbor": "1-6"
                },
                "bottom": {
                    "color": "green",
                        "neighbor": "0-7"
                }
            }
        },
            "0-7": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "green",
                        "neighbor": "0-6"
                },
                "left": {
                    "color": "green"
                },
                "right": {
                    "color": "green"
                },
                "bottom": {
                    "color": "green"
                }
            }
        },
            "5-7": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "purple",
                        "neighbor": "5-6"
                },
                "left": {
                    "color": "purple"
                },
                "right": {
                    "color": "purple"
                },
                "bottom": {
                    "color": "purple"
                }
            }
        },
            "5-6": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "purple"
                },
                "left": {
                    "color": "purple",
                        "neighbor": "4-6"
                },
                "right": {
                    "color": "purple"
                },
                "bottom": {
                    "color": "purple",
                        "neighbor": "5-7"
                }
            }
        },
            "4-6": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "blue",
                        "neighbor": "4-5"
                },
                "left": {
                    "color": "purple",
                        "neighbor": "3-6"
                },
                "right": {
                    "color": "purple",
                        "neighbor": "5-6"
                },
                "bottom": {
                    "color": "blue",
                        "neighbor": "4-7"
                }
            },
            "crossLine": [
                "blue",
                "purple"
            ]
        },
            "3-6": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "purple"
                },
                "left": {
                    "color": "purple"
                },
                "right": {
                    "color": "purple",
                        "neighbor": "4-6"
                },
                "bottom": {
                    "color": "purple",
                        "neighbor": "3-7"
                }
            }
        },
            "3-7": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "purple",
                        "neighbor": "3-6"
                },
                "left": {
                    "color": "purple",
                        "neighbor": "2-7"
                },
                "right": {
                    "color": "purple"
                },
                "bottom": {
                    "color": "purple"
                }
            }
        },
            "2-7": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "purple"
                },
                "left": {
                    "color": "purple",
                        "neighbor": "1-7"
                },
                "right": {
                    "color": "purple",
                        "neighbor": "3-7"
                },
                "bottom": {
                    "color": "purple"
                }
            }
        },
            "1-7": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "purple"
                },
                "left": {
                    "color": "purple"
                },
                "right": {
                    "color": "purple",
                        "neighbor": "2-7"
                },
                "bottom": {
                    "color": "purple"
                }
            }
        },
            "4-7": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "blue",
                        "neighbor": "4-6"
                },
                "left": {
                    "color": "blue"
                },
                "right": {
                    "color": "blue"
                },
                "bottom": {
                    "color": "blue"
                }
            }
        },
            "4-5": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "blue"
                },
                "left": {
                    "color": "blue"
                },
                "right": {
                    "color": "blue",
                        "neighbor": "5-5"
                },
                "bottom": {
                    "color": "blue",
                        "neighbor": "4-6"
                }
            }
        },
            "5-5": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "blue",
                        "neighbor": "5-4"
                },
                "left": {
                    "color": "blue",
                        "neighbor": "4-5"
                },
                "right": {
                    "color": "blue"
                },
                "bottom": {
                    "color": "blue"
                }
            }
        },
            "5-4": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "blue"
                },
                "left": {
                    "color": "blue"
                },
                "right": {
                    "color": "blue"
                },
                "bottom": {
                    "color": "blue",
                        "neighbor": "5-5"
                }
            }
        },
            "2-2": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "orange"
                },
                "left": {
                    "color": "orange",
                        "neighbor": "1-2"
                },
                "right": {
                    "color": "orange"
                },
                "bottom": {
                    "color": "orange"
                }
            }
        },
            "3-2": {
            "endpoint": true,
                "connections": {
                "top": {
                    "color": "yellow"
                },
                "left": {
                    "color": "yellow"
                },
                "right": {
                    "color": "yellow"
                },
                "bottom": {
                    "color": "yellow",
                        "neighbor": "3-3"
                }
            }
        },
            "3-3": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "yellow",
                        "neighbor": "3-2"
                },
                "left": {
                    "color": "yellow",
                        "neighbor": "2-3"
                },
                "right": {
                    "color": "yellow"
                },
                "bottom": {
                    "color": "yellow"
                }
            }
        },
            "2-3": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "yellow"
                },
                "left": {
                    "color": "yellow"
                },
                "right": {
                    "color": "yellow",
                        "neighbor": "3-3"
                },
                "bottom": {
                    "color": "yellow",
                        "neighbor": "2-4"
                }
            }
        },
            "2-4": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "yellow",
                        "neighbor": "2-3"
                },
                "left": {
                    "color": "yellow",
                        "neighbor": "1-4"
                },
                "right": {
                    "color": "yellow"
                },
                "bottom": {
                    "color": "yellow"
                }
            }
        },
            "1-4": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "yellow"
                },
                "left": {
                    "color": "yellow"
                },
                "right": {
                    "color": "yellow",
                        "neighbor": "2-4"
                },
                "bottom": {
                    "color": "yellow",
                        "neighbor": "1-5"
                }
            }
        },
            "1-5": {
            "endpoint": false,
                "connections": {
                "top": {
                    "color": "yellow",
                        "neighbor": "1-4"
                },
                "left": {
                    "color": "yellow",
                        "neighbor": "0-5"
                },
                "right": {
                    "color": "yellow"
                },
                "bottom": {
                    "color": "yellow"
                }
            }
        },
            "0-5": {
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
                        "neighbor": "1-5"
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
                    "color": "aqua"
                },
                "left": {
                    "color": "aqua",
                        "neighbor": "0-3"
                },
                "right": {
                    "color": "aqua"
                },
                "bottom": {
                    "color": "aqua"
                }
            }
        },
            "0-3": {
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
                        "neighbor": "1-3"
                },
                "bottom": {
                    "color": "aqua",
                        "neighbor": "0-4"
                }
            }
        },
            "0-4": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "0-3"
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
            }
        })
        rect.preparePuzzleEvaluation()
        rect.evaluatePuzzle()
        rect.prepareToResolve()
        const {connections, endpoint} = rect.getPoint('0-5')
        const color = rect.getColors(connections)[0]
        rect.addTakenPoints({
            '0-5': {
                endpoint,
                connections: {
                    ...connections,
                    'right': {
                        color, neighbor: '1-5'
                    }
                }
            },
            '1-5': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(color),
                    'left': {
                        color, neighbor: '0-5'
                    },
                    'right': {
                        color, neighbor: '2-5'
                    }
                }
            },
            '2-5': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(color),
                    'left': {
                        color, neighbor: '1-5'
                    },
                    'top': {
                        color, neighbor: '2-4'
                    }
                }
            },
            '2-4': {
                endpoint: false,
                connections: {
                    ...defaultConnectionsWithColor(color),
                    'bottom': {
                        color, neighbor: '2-5'
                    }
                }
            }
        })
        const key = rect.lineEndpoints['0-5_3-2'] ? '0-5_3-2' : '3-2_0-5'
        const res = rect.checkNeighbor(
            '1-4',
            ['3-2', '3-3'],
            [color],
            ['0-5', '1-5', '2-5', '2-4'],
            {paths: []},
            {},
            key
        )
        // expect(res).toBe(1)

    })
    test('find path', () => {
        const rect = new RectCreator({width: 5, height: 6})
        rect.addTakenPoints({
            "0-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "purple"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "0-1"
                    }
                },
                lineEndpoints: ['4-5']
            },
            "0-1": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "0-0"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "0-2"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "0-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "0-1"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple",
                        "neighbor": "1-2"
                    },
                    "bottom": {
                        "color": "purple"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "1-2": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "1-1"
                    },
                    "left": {
                        "color": "purple",
                        "neighbor": "0-2"
                    },
                    "right": {
                        "color": "purple",
                        "neighbor": "2-2"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "1-3"
                    }
                },
                "crossLine": [
                    "aqua",
                    "purple"
                ],
                lineEndpoints: ['0-0', '4-5']
            },
            "2-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple"
                    },
                    "left": {
                        "color": "purple",
                        "neighbor": "1-2"
                    },
                    "right": {
                        "color": "purple",
                        "neighbor": "3-2"
                    },
                    "bottom": {
                        "color": "purple"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "3-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple"
                    },
                    "left": {
                        "color": "purple",
                        "neighbor": "2-2"
                    },
                    "right": {
                        "color": "purple",
                        "neighbor": "4-2"
                    },
                    "bottom": {
                        "color": "purple"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "4-2": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple"
                    },
                    "left": {
                        "color": "purple",
                        "neighbor": "3-2"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "4-3"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "4-3": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "4-2"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "4-4"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "4-4": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "4-3"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple",
                        "neighbor": "4-5"
                    }
                },
                lineEndpoints: ['0-0', '4-5']
            },
            "4-5": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "purple",
                        "neighbor": "4-4"
                    },
                    "left": {
                        "color": "purple"
                    },
                    "right": {
                        "color": "purple"
                    },
                    "bottom": {
                        "color": "purple"
                    }
                },
                lineEndpoints: ['0-0']
            },
            "4-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua"
                    },
                    "left": {
                        "color": "aqua"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "4-1"
                    }
                },
                lineEndpoints: ['0-5']
            },
            "4-1": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "4-0"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "3-1"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "3-1": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "2-1"
                    },
                    "right": {
                        "color": "aqua",
                        "neighbor": "4-1"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "2-1": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "1-1"
                    },
                    "right": {
                        "color": "aqua",
                        "neighbor": "3-1"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "1-1": {
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
                        "neighbor": "2-1"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "1-2"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "1-3": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "1-2"
                    },
                    "left": {
                        "color": "aqua",
                        "neighbor": "0-3"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "0-3": {
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
                        "neighbor": "1-3"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "0-4"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "0-4": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "0-3"
                    },
                    "left": {
                        "color": "aqua"
                    },
                    "right": {
                        "color": "aqua"
                    },
                    "bottom": {
                        "color": "aqua",
                        "neighbor": "0-5"
                    }
                },
                lineEndpoints: ['0-5', '4-0']
            },
            "0-5": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "aqua",
                        "neighbor": "0-4"
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
                },
                lineEndpoints: ['4-0']
            },
            "1-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "green"
                    },
                    "left": {
                        "color": "green"
                    },
                    "right": {
                        "color": "green",
                        "neighbor": "2-0"
                    },
                    "bottom": {
                        "color": "green"
                    }
                },
                lineEndpoints: ['3-0']
            },
            "2-0": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "green"
                    },
                    "left": {
                        "color": "green",
                        "neighbor": "1-0"
                    },
                    "right": {
                        "color": "green",
                        "neighbor": "3-0"
                    },
                    "bottom": {
                        "color": "green"
                    }
                },
                lineEndpoints: ['1-0', '3-0']
            },
            "3-0": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "green"
                    },
                    "left": {
                        "color": "green",
                        "neighbor": "2-0"
                    },
                    "right": {
                        "color": "green"
                    },
                    "bottom": {
                        "color": "green"
                    }
                },
                lineEndpoints: ['1-0']
            },
            "3-3": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "blue"
                    },
                    "left": {
                        "color": "blue",
                        "neighbor": "2-3"
                    },
                    "right": {
                        "color": "blue"
                    },
                    "bottom": {
                        "color": "blue"
                    }
                },
                lineEndpoints: ['1-0', '3-0']
            },
            "2-3": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "blue"
                    },
                    "left": {
                        "color": "blue"
                    },
                    "right": {
                        "color": "blue",
                        "neighbor": "3-3"
                    },
                    "bottom": {
                        "color": "blue",
                        "neighbor": "2-4"
                    }
                },
                lineEndpoints: ['3-3', '1-5']
            },
            "2-4": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "blue",
                        "neighbor": "2-3"
                    },
                    "left": {
                        "color": "blue",
                        "neighbor": "1-4"
                    },
                    "right": {
                        "color": "blue"
                    },
                    "bottom": {
                        "color": "blue"
                    }
                },
                lineEndpoints: ['3-3', '1-5']
            },
            "1-4": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "blue"
                    },
                    "left": {
                        "color": "blue"
                    },
                    "right": {
                        "color": "blue",
                        "neighbor": "2-4"
                    },
                    "bottom": {
                        "color": "blue",
                        "neighbor": "1-5"
                    }
                },
                lineEndpoints: ['3-3', '1-5']
            },
            "1-5": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "blue",
                        "neighbor": "1-4"
                    },
                    "left": {
                        "color": "blue"
                    },
                    "right": {
                        "color": "blue"
                    },
                    "bottom": {
                        "color": "blue"
                    }
                },
                lineEndpoints: ['3-3']
            },
            "3-4": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "violet"
                    },
                    "left": {
                        "color": "violet"
                    },
                    "right": {
                        "color": "violet"
                    },
                    "bottom": {
                        "color": "violet",
                        "neighbor": "3-5"
                    }
                },
                lineEndpoints: ['2-5']
            },
            "3-5": {
                "endpoint": false,
                "connections": {
                    "top": {
                        "color": "violet",
                        "neighbor": "3-4"
                    },
                    "left": {
                        "color": "violet",
                        "neighbor": "2-5"
                    },
                    "right": {
                        "color": "violet"
                    },
                    "bottom": {
                        "color": "violet"
                    }
                },
                lineEndpoints: ['3-4', '2-5']
            },
            "2-5": {
                "endpoint": true,
                "connections": {
                    "top": {
                        "color": "violet"
                    },
                    "left": {
                        "color": "violet"
                    },
                    "right": {
                        "color": "violet",
                        "neighbor": "3-5"
                    },
                    "bottom": {
                        "color": "violet"
                    }
                },
                lineEndpoints: ['3-4']
            }
        })
        rect.preparePuzzleEvaluation()
        rect.evaluatePuzzle()
        rect.prepareToResolve()
        expect(rect.findPath('2-5', '3-4', LineColors.slice(10, 11), '2-5_3-4'))
            .toEqual(['2-5', '2-4', '3-4'])
    })
    test('th', () => {
        const rect = new RectCreator({width: 5, height: 5})
        rect.addTakenPoints({
            '1-2': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[6]),
                lineEndpoints: ['0-3']
            },
            '0-2': {
                endpoint: false,
                connections: defaultConnectionsWithColor(LineColors[6]),
                lineEndpoints: ['0-3', '1-2']
            },
            '0-3': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[6]),
                lineEndpoints: ['1-2']
            },
            '0-4': {
                endpoint: true,
                joinPoint: [LineColors[5], LineColors[6]],
                connections: defaultConnectionsWithColor(LineColors[5]),
                lineEndpoints: ['1-3']
            },
            '2-4': {
                endpoint: true,
                connections: defaultConnectionsWithColor((LineColors[8])),
                lineEndpoints: ['4-4']
            },
            '1-3': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[5]),
                lineEndpoints: ['0-4']
            }
        })

        expect(rect.findPath('1-3', '0-4', LineColors.slice(5,6), '1-3_0-4'))
            .toEqual(["1-3", "1-4", "0-4"])
    })
    test('circle path', () => {
        const rect = new RectCreator({width: 6, height: 8})
        const points = {
            '2-0': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true
            },
            '4-0': {
                connections: defaultConnectionsWithColor(LineColors[2]),
                endpoint: true
            },
            '3-0': {
                connections: defaultConnectionsWithColor(LineColors[3]),
                endpoint: true
            },
            '4-1': {
                connections: defaultConnectionsWithColor(LineColors[3]),
                endpoint: true
            },
            '3-2': {
                connections: defaultConnectionsWithColor(LineColors[4]),
                endpoint: true
            },
            '1-2': {
                connections: defaultConnectionsWithColor(LineColors[6]),
                endpoint: true
            },
            '2-3': {
                connections: defaultConnectionsWithColor(LineColors[5]),
                endpoint: true
            }
        }
        rect.addTakenPoints(points)
        // expect(rect.findPath('2-0', '4-0', LineColors.slice(2,3), '2-0_4-0').length)
        //     .toEqual(17)
    })
    test('crossline repath', () => {
        const rect = new RectCreator({width: 4, height: 6})
        const points = {
            '0-0': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[3])
            },
            '1-1': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[4])
            },
            '2-2': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[5])
            },
            '1-3': {
                endpoint: true,
                crossLine: [LineColors[3], LineColors[7]],
                connections: defaultConnectionsWithColor()
            },
            '1-5': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[3])
            }
        }
        rect.addTakenPoints(points)
        // expect(rect.findPath('0-0', '1-5', LineColors.slice(3,4), '0-0_1-5'))
        //     .toEqual(["0-0", "0-1", "0-2", "1-2", "1-3", "1-4", "1-5"])
    })
    test('noose fn', () => {
        const rect = new RectCreator({width: 5, height: 6})
        expect(rect.checkPathForNoose(['0-0', '0-1', '0-2', '1-2', '1-1'])).toBe(false)
        expect(rect.checkPathForNoose(['0-0', '0-1', '0-2', '1-2', '1-3'])).toBe(true)
        expect(rect.checkPathForNoose(['0-0', '0-1', '0-2', '1-2', '1-3', '0-3', '0-4', ])).toBe(false)

    })
    test('re-path validating', () => {
        const rect = new RectCreator({width: 5, height: 6})
        rect.addTakenPoints({
            '1-1': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[3])
            },
            '1-4': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[3])
            },
            '2-2': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[4])
            },
            '1-3': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[5])
            },
            '3-4': {
                endpoint: true,
                connections: defaultConnectionsWithColor(LineColors[5])
            }

        })
        const path1 = rect.findPath('1-1', '1-4', LineColors.slice(3,4), '1-1_1-4')
        const path2 = rect.findPath('1-4', '1-1', LineColors.slice(3,4), '1-1_1-4')
        const validRePath = rect.validateRePath(['1-1', '2-1', '2-0', '3-0'], ['1-4'], LineColors.slice(3,4), ['1-1', '2-1', '3-1', '3-0'])
        expect(validRePath).toEqual(false)
        expect(rect.validateRePath(['3-4', '3-5', '4-5'], ['1-3'], LineColors.slice(5,6), ['3-4', '3-5'])).toEqual(false)
        expect(path1).toEqual(path2.reverse())
        console.error( path2)
        console.error( path1)
        const valPath1 = rect.validatePath(['1-1', '0-1'], ['1-4'], LineColors.slice(3,4), '1-1_1-4')
        const valPath2 = rect.validatePath(['1-1', '1-0'], ['1-4'], LineColors.slice(3,4), '1-1_1-4')
        // expect(valPath1).toEqual(valPath2)
    })

});


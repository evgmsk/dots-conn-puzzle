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
        rect.key = '2-5_3-4'
        expect(rect.findPath('2-5', '3-4', LineColors.slice(10, 11), ).line)
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
        rect.key = '1-3_0-4'
        expect(rect.findPath('1-3', '0-4', LineColors.slice(5,6), ).line)
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
        rect.key = '1-1_1-4'
        const path1 = rect.findPath('1-1', '1-4', LineColors.slice(3,4), )
        const path2 = rect.findPath('1-4', '1-1', LineColors.slice(3,4), )
        const validRePath = rect.validateRePath(['1-1', '2-1', '2-0', '3-0'], ['1-4'], LineColors.slice(3,4), ['1-1', '2-1', '3-1', '3-0'])
        expect(validRePath).toEqual(false)
        expect(rect.validateRePath(['3-4', '3-5', '4-5'], ['1-3'], LineColors.slice(5,6), ['3-4', '3-5'])).toEqual(false)
        expect(path1.line).toEqual(path2.line.reverse())
        rect.forceRePath = true
        const valPath1 = rect.validatePath(['1-1', '0-1'], ['1-4'], LineColors.slice(3,4), '1-1_1-4')
        const valPath2 = rect.validatePath(['1-1', '1-0'], ['1-4'], LineColors.slice(3,4), '1-1_1-4')
        expect(valPath1).toEqual(valPath2)
    })

    test('rep test', () => {
        const ev = new RectCreator({width: 8, height: 10})
        expect(ev.checkLinesCircle(['a', 'b', 'a', 'b'], 'b')).toEqual(['a', 'b'])
        expect(ev.checkLinesCircle(['a', 'b', 'a', 'b', 'a'], 'a')).toEqual(['b', 'a'])
        expect(ev.checkLinesCircle(['a', 'b', 'c', 'b', 'a'], 'a')).toEqual([])
        expect(ev.checkLinesCircle(['a', 'b', 'c', 'a', 'b'], 'a')).toEqual([])
    })
    test('1-st puzzle resolve', () => {
        const rect = new RectCreator({width: 10, height: 12})

        const puzzle = {
            "name": "admin_size-10x12_diff-21",
            "difficulty": 21,
            "createdBy": "6452a7c26ae92c229cc8304c",
            "width": 10,
            "height": 12,
            "points": {
                "1-3": {
                    "endpoint": true,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "0-3"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "5-8",
                        "5-8"
                    ]
                },
                "5-8": {
                    "endpoint": true,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "4-8"
                        },
                        "right": {
                            "color": "aqua",
                            "neighbor": "6-8"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "1-3",
                        "0-4",
                        "1-3",
                        "0-4",
                        "1-3",
                        "0-4"
                    ],
                    "joinPoint": [
                        "violet",
                        "aqua"
                    ]
                },
                "1-9": {
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
                            "neighbor": "1-10"
                        }
                    },
                    "lineEndpoints": [
                        "1-2",
                        "1-2",
                        "1-2"
                    ]
                },
                "1-2": {
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
                            "color": "purple"
                        }
                    },
                    "endpoint": true,
                    "lineEndpoints": [
                        "1-9",
                        "1-9",
                        "1-9"
                    ]
                },
                "2-2": {
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
                            "neighbor": "3-2"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-9"
                    ]
                },
                "2-9": {
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "3-9"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "endpoint": true,
                    "lineEndpoints": [
                        "2-2",
                        "2-2",
                        "2-2"
                    ]
                },
                "0-4": {
                    "endpoint": true,
                    "connections": {
                        "top": {
                            "color": "aqua"
                        },
                        "left": {
                            "color": "aqua"
                        },
                        "right": {
                            "color": "aqua",
                            "neighbor": "1-4"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "5-8",
                        "5-8"
                    ]
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
                            "color": "yellow"
                        },
                        "bottom": {
                            "color": "yellow",
                            "neighbor": "0-6"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "5-4",
                        "5-4"
                    ]
                },
                "5-4": {
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
                            "neighbor": "5-5"
                        }
                    },
                    "lineEndpoints": [
                        "0-5"
                    ]
                },
                "1-5": {
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
                            "neighbor": "1-6"
                        }
                    },
                    "lineEndpoints": [
                        "4-5"
                    ]
                },
                "4-5": {
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
                            "neighbor": "4-6"
                        }
                    },
                    "endpoint": true,
                    "lineEndpoints": [
                        "1-5",
                        "1-5",
                        "1-5"
                    ]
                },
                "4-4": {
                    "endpoint": true,
                    "connections": {
                        "top": {
                            "color": "rose"
                        },
                        "left": {
                            "color": "rose",
                            "neighbor": "3-4"
                        },
                        "right": {
                            "color": "rose"
                        },
                        "bottom": {
                            "color": "rose"
                        }
                    },
                    "lineEndpoints": [
                        "2-5",
                        "2-5",
                        "2-5"
                    ]
                },
                "2-5": {
                    "connections": {
                        "top": {
                            "color": "rose"
                        },
                        "left": {
                            "color": "rose"
                        },
                        "right": {
                            "color": "rose",
                            "neighbor": "3-5"
                        },
                        "bottom": {
                            "color": "rose"
                        }
                    },
                    "endpoint": true,
                    "lineEndpoints": [
                        "4-4",
                        "4-4",
                        "4-4"
                    ]
                },
                "1-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "1-9"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "2-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "2-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "1-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "3-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "3-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "2-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "4-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "4-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "3-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "5-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "5-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "4-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "6-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "6-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "5-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "7-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "7-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "6-10"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "8-10"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-9"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "7-10"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-8"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-10"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-7"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-9"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-6"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-8"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-5"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-7"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-4"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-6"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-3"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-5"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-2"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-4"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple",
                            "neighbor": "8-1"
                        },
                        "left": {
                            "color": "purple"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-3"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "8-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "7-1"
                        },
                        "right": {
                            "color": "purple"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "8-2"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "7-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "6-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "8-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "6-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "5-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "7-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "5-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "4-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "6-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "4-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "3-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "5-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "3-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "2-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "4-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "2-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "purple"
                        },
                        "left": {
                            "color": "purple",
                            "neighbor": "1-1"
                        },
                        "right": {
                            "color": "purple",
                            "neighbor": "3-1"
                        },
                        "bottom": {
                            "color": "purple"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "1-1": {
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
                            "neighbor": "2-1"
                        },
                        "bottom": {
                            "color": "purple",
                            "neighbor": "1-2"
                        }
                    },
                    "lineEndpoints": [
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2",
                        "1-9",
                        "1-2"
                    ]
                },
                "3-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "2-2"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "4-2"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "4-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "3-2"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "5-2"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "5-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "4-2"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "6-2"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "6-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "5-2"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "7-2"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "6-2"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-3"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-2"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-4"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-3"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-5"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-4"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-6"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-5"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-7"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-6"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-8"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-7"
                        },
                        "left": {
                            "color": "green"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green",
                            "neighbor": "7-9"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "7-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green",
                            "neighbor": "7-8"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "6-9"
                        },
                        "right": {
                            "color": "green"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "6-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "5-9"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "7-9"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "5-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "4-9"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "6-9"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "4-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "3-9"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "5-9"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "3-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "green"
                        },
                        "left": {
                            "color": "green",
                            "neighbor": "2-9"
                        },
                        "right": {
                            "color": "green",
                            "neighbor": "4-9"
                        },
                        "bottom": {
                            "color": "green"
                        }
                    },
                    "lineEndpoints": [
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9",
                        "2-2",
                        "2-9"
                    ]
                },
                "4-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "3-8"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "5-8"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "3-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "2-8"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "4-8"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "3-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow"
                        },
                        "left": {
                            "color": "yellow",
                            "neighbor": "2-7"
                        },
                        "right": {
                            "color": "yellow",
                            "neighbor": "4-7"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "2-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow"
                        },
                        "left": {
                            "color": "yellow",
                            "neighbor": "1-7"
                        },
                        "right": {
                            "color": "yellow",
                            "neighbor": "3-7"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "1-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow"
                        },
                        "left": {
                            "color": "yellow",
                            "neighbor": "0-7"
                        },
                        "right": {
                            "color": "yellow",
                            "neighbor": "2-7"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "1-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "0-8"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "2-8"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "1-8"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-9"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-8"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-10"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-9"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-11"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-10"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "1-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "1-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "0-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "2-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "2-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "1-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "3-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "3-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "2-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "4-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "4-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "3-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "5-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "5-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "4-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "6-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "6-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "5-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "7-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "7-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "6-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "8-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "8-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "7-11"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "9-11"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-11": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-10"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "8-11"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-10": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-9"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-11"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-9": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-8"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-10"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-7"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-9"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-6"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-8"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-5"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-7"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-4"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-6"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-3"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-5"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-2"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-4"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-1"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-3"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "9-0"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-2"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "9-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "8-0"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "9-1"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "8-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "7-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "9-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "7-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "6-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "8-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "6-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "5-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "7-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "5-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "4-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "6-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "4-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "3-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "5-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "3-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "2-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "4-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "2-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "1-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "3-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "1-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "0-0"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "2-0"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-0": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "1-0"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-1"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-1": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-0"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-2"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-2": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-1"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet"
                        },
                        "bottom": {
                            "color": "violet",
                            "neighbor": "0-3"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "0-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet",
                            "neighbor": "0-2"
                        },
                        "left": {
                            "color": "violet"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "1-3"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "5-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow",
                            "neighbor": "5-4"
                        },
                        "left": {
                            "color": "yellow"
                        },
                        "right": {
                            "color": "yellow"
                        },
                        "bottom": {
                            "color": "yellow",
                            "neighbor": "5-6"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "5-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow",
                            "neighbor": "5-5"
                        },
                        "left": {
                            "color": "yellow"
                        },
                        "right": {
                            "color": "yellow"
                        },
                        "bottom": {
                            "color": "yellow",
                            "neighbor": "5-7"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "4-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "orange",
                            "neighbor": "4-5"
                        },
                        "left": {
                            "color": "orange",
                            "neighbor": "3-6"
                        },
                        "right": {
                            "color": "orange"
                        },
                        "bottom": {
                            "color": "orange"
                        }
                    },
                    "lineEndpoints": [
                        "4-5",
                        "1-5",
                        "1-5",
                        "4-5",
                        "1-5",
                        "4-5"
                    ]
                },
                "3-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "orange"
                        },
                        "left": {
                            "color": "orange",
                            "neighbor": "2-6"
                        },
                        "right": {
                            "color": "orange",
                            "neighbor": "4-6"
                        },
                        "bottom": {
                            "color": "orange"
                        }
                    },
                    "lineEndpoints": [
                        "4-5",
                        "1-5",
                        "1-5",
                        "4-5",
                        "1-5",
                        "4-5"
                    ]
                },
                "2-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "orange"
                        },
                        "left": {
                            "color": "orange",
                            "neighbor": "1-6"
                        },
                        "right": {
                            "color": "orange",
                            "neighbor": "3-6"
                        },
                        "bottom": {
                            "color": "orange"
                        }
                    },
                    "lineEndpoints": [
                        "4-5",
                        "1-5",
                        "1-5",
                        "4-5",
                        "1-5",
                        "4-5"
                    ]
                },
                "1-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "orange",
                            "neighbor": "1-5"
                        },
                        "left": {
                            "color": "orange"
                        },
                        "right": {
                            "color": "orange",
                            "neighbor": "2-6"
                        },
                        "bottom": {
                            "color": "orange"
                        }
                    },
                    "lineEndpoints": [
                        "4-5",
                        "1-5",
                        "1-5",
                        "4-5",
                        "1-5",
                        "4-5"
                    ]
                },
                "0-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow",
                            "neighbor": "0-5"
                        },
                        "left": {
                            "color": "yellow"
                        },
                        "right": {
                            "color": "yellow"
                        },
                        "bottom": {
                            "color": "yellow",
                            "neighbor": "0-7"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "6-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "6-7"
                        },
                        "left": {
                            "color": "aqua",
                            "neighbor": "5-8"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "6-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "6-6"
                        },
                        "left": {
                            "color": "aqua"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "6-8"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "6-6": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "6-5"
                        },
                        "left": {
                            "color": "aqua"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "6-7"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "6-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "6-4"
                        },
                        "left": {
                            "color": "aqua"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "6-6"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "6-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "6-3"
                        },
                        "left": {
                            "color": "aqua"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "6-5"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "6-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua"
                        },
                        "left": {
                            "color": "aqua",
                            "neighbor": "5-3"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "6-4"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "5-3": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua"
                        },
                        "left": {
                            "color": "aqua",
                            "neighbor": "4-3"
                        },
                        "right": {
                            "color": "aqua",
                            "neighbor": "6-3"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
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
                            "color": "aqua",
                            "neighbor": "5-3"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
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
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "2-3": {
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
                            "neighbor": "3-3"
                        },
                        "bottom": {
                            "color": "aqua",
                            "neighbor": "2-4"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "2-8": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "violet"
                        },
                        "left": {
                            "color": "violet",
                            "neighbor": "1-8"
                        },
                        "right": {
                            "color": "violet",
                            "neighbor": "3-8"
                        },
                        "bottom": {
                            "color": "violet"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3",
                        "5-8",
                        "1-3"
                    ]
                },
                "1-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua"
                        },
                        "left": {
                            "color": "aqua",
                            "neighbor": "0-4"
                        },
                        "right": {
                            "color": "aqua",
                            "neighbor": "2-4"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "2-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "aqua",
                            "neighbor": "2-3"
                        },
                        "left": {
                            "color": "aqua",
                            "neighbor": "1-4"
                        },
                        "right": {
                            "color": "aqua"
                        },
                        "bottom": {
                            "color": "aqua"
                        }
                    },
                    "lineEndpoints": [
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4",
                        "5-8",
                        "0-4"
                    ]
                },
                "0-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow",
                            "neighbor": "0-6"
                        },
                        "left": {
                            "color": "yellow"
                        },
                        "right": {
                            "color": "yellow",
                            "neighbor": "1-7"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "4-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow"
                        },
                        "left": {
                            "color": "yellow",
                            "neighbor": "3-7"
                        },
                        "right": {
                            "color": "yellow",
                            "neighbor": "5-7"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "5-7": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "yellow",
                            "neighbor": "5-6"
                        },
                        "left": {
                            "color": "yellow",
                            "neighbor": "4-7"
                        },
                        "right": {
                            "color": "yellow"
                        },
                        "bottom": {
                            "color": "yellow"
                        }
                    },
                    "lineEndpoints": [
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5",
                        "5-4",
                        "0-5"
                    ]
                },
                "3-4": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "rose"
                        },
                        "left": {
                            "color": "rose"
                        },
                        "right": {
                            "color": "rose",
                            "neighbor": "4-4"
                        },
                        "bottom": {
                            "color": "rose",
                            "neighbor": "3-5"
                        }
                    },
                    "lineEndpoints": [
                        "4-4",
                        "2-5",
                        "4-4",
                        "2-5",
                        "4-4",
                        "2-5"
                    ]
                },
                "3-5": {
                    "endpoint": false,
                    "connections": {
                        "top": {
                            "color": "rose",
                            "neighbor": "3-4"
                        },
                        "left": {
                            "color": "rose",
                            "neighbor": "2-5"
                        },
                        "right": {
                            "color": "rose"
                        },
                        "bottom": {
                            "color": "rose"
                        }
                    },
                    "lineEndpoints": [
                        "4-4",
                        "2-5",
                        "4-4",
                        "2-5",
                        "4-4",
                        "2-5"
                    ]
                }
            }
        }
        rect.addTakenPoints(puzzle.points)
        rect.preparePuzzleEvaluation()
        rect.handleAutoResolvePuzzle()
        expect(Object.keys(rect.takenPoints).length).toBe(118)
    })
});


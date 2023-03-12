import { DefaultColor } from "../constant/constants";
import { ITakenPointProps, ITakenPoints, LineDirections } from "../constant/interfaces";
import {defaultConnectionsWithColor, isDev, oppositeDirection} from "../helper-fns/helper-fn";
import { LinedRectBase } from "./rect-base";


export class PuzzleCommons extends LinedRectBase {

    prepareUtmostPointForResolver = (point: ITakenPointProps): ITakenPointProps => {
        const {utmost, connections} = point
        const colors = this.getColors(connections)
        const lineNeighbors = this.getLineNeighbors(point.connections)
        const firstColorNeighbors = this.getLineNeighbors(point.connections, colors[0])
        const crossLine = lineNeighbors.length === 4 && firstColorNeighbors.length === 2
            ? colors
            : undefined
        const joinPoint = utmost && !crossLine && lineNeighbors.length > 1
            ? colors
            : undefined
        const color = crossLine || joinPoint ? DefaultColor : colors[0]
        return {
            connections: defaultConnectionsWithColor(color),
            crossLine,
            joinPoint,
            utmost
        }
    }

    addNextPoint = (nextPoint: string, prevPoint: string, color: string) => {
        const dir = this.determineDirection(nextPoint, prevPoint)
        const point = {
            [nextPoint]: {
                utmost: false,
                connections: {
                    ...defaultConnectionsWithColor(color),
                    [dir]: {color, neighbor: prevPoint}
                }
            }
        }
        console.log('continue line', nextPoint, prevPoint, point)
        this.addTakenPoints(point)
    }

    createJoinPoint = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        sameColor = false) => {
            const {connections, utmost ,joinPoint ,crossLine} = this.getPoint(nextPoint)
            const dir = this.determineDirection(nextPoint, prevPoint)
            console.log('create join')
            const updatedPointProps = { 
                utmost: !sameColor || utmost,
                connections: {
                    ...connections,
                    [dir]: {color, neighbor: prevPoint}
                },
                joinPoint,
                crossLine
            }
            this.addTakenPoints({[nextPoint]: updatedPointProps})
    }

    tryContinueLine = (next: string, prev: string, color: string): string => {
        const {utmost, connections, crossLine, joinPoint} = this.getPoint(prev) || {}
        if (!connections) {
            console.error('invalid props for the dots connecting')
            return ''
        }
        const nextNeighbors = this.rect[next].neighbors
        const prevNeighbors = this.rect[prev].neighbors
        for (const neighbor of nextNeighbors) {
            if (prevNeighbors.includes(neighbor) && !this.getPoint(neighbor)) {
                const dirToPrev = this.determineDirection(neighbor, prev)
                this.addTakenPoints({
                    [neighbor]: {
                        utmost: false,
                        connections: {
                            ...defaultConnectionsWithColor(color),
                            [dirToPrev]: {color, neighbor: prev}
                        }
                    },
                    [prev]: {
                        utmost,
                        crossLine,
                        joinPoint,
                        connections: {
                            ...connections,
                            [oppositeDirection(dirToPrev)]: {
                                color, neighbor: neighbor
                            }
                        }
                    }
                })
                return neighbor
            }
        }
        return ''
    }

    lineContinuationIsImpossible = (nextPoint: string, prevPoint: string, color: string) =>
        !this.getColors(prevPoint).includes(color) || !this.getPoint(prevPoint)

    isLast = (point: ITakenPointProps, prev: string, endPoint: string, color: string) => {
        const neighbors = this.getLineNeighbors(point.connections, color)
        const neighbor = neighbors.filter(n => n !== prev)[0]
        const last = neighbor === endPoint
            || this.getPoint(neighbor)?.utmost
            || (prev && neighbors.length === 1)
        isDev() && console.log('last point', point, prev, endPoint, neighbors, neighbor,
            neighbor === endPoint, )
        return last ? neighbor : ''
    }

    removeLineToUtmostPoint = (start: string, prev: string, color: string) => {
        console.warn('remove part line to utmost', start, prev)
        let passed = prev
        const toFn = (key: string) => {
            const {utmost} = this.getPoint(key)
            !utmost && this.deletePoint(key)
            if (utmost) {
                this.updateLastPoint(key, passed, color)
            }
            passed = key
            return utmost
        }
        this.goToLinePoint(start, prev, toFn)
    }
    
    removeLineCirclePart(prevP: string, next: string, color: string) {
        const {connections, utmost} = this.getPoint(prevP)
        console.warn('remove circle', prevP, next, connections, utmost)
        if (utmost) return
        const lineNeighbors = this.getLineNeighbors(connections)
        if (lineNeighbors.length > 1) {
            const nextPointExtraNeighbor = this.getLineNeighbors(next)
                .filter(n => n !== prevP)[0]
            if (!nextPointExtraNeighbor) return
            console.warn('next extra')
            const nextDir = this.determineDirection(next, nextPointExtraNeighbor)
            const nextPoint = this.getPoint(next)
            this.addTakenPoints({
                [next]: {
                    ...nextPoint,
                    connections: {
                        ...nextPoint.connections,
                        [nextDir]: {color}
                    }
                }
            })
            return this.removeLineFork(nextPointExtraNeighbor, next, color)
        }
        let prev = ''
        const toFn = (key: string) => {
            const point = this.getPoint(key)
            if (!point?.connections) { return true }
            const last = this.isLast(point, prev, next, color)
            prev = key
            this.deletePoint(key)
            if (last) {
                this.updateLastPoint(last, prev, color)
            }
            return last
        }
        this.goToLinePoint(prevP, next, toFn)
    }

    removeForks = (start: string, color: string) => {
        const {utmost, connections, crossLine, joinPoint} = this.getPoint(start)
        const lineNeighbors = this.getLineNeighbors(start)
        let firstUtmost = ''
        console.log('rem fork', start, color, lineNeighbors)
        if (lineNeighbors.length < 2) {
            return
        }
        for (const neighbor of lineNeighbors) {
            const lastPointUtmost = this.checkStartPointUtmost(neighbor, start)
            if (!lastPointUtmost) {
                this.removeLineFork(neighbor, start, color)
            } else {
                (firstUtmost || utmost) && this.removeLineToUtmostPoint(neighbor, start, color)
                firstUtmost = !firstUtmost ? neighbor : firstUtmost;
            }
        }
        const dir = this.determineDirection(start, firstUtmost)
        const dirToClean = this.getLineDirections(start).filter(d => d !== dir)[0]
        this.addTakenPoints({
            [start]: {
                joinPoint,
                crossLine,
                utmost,
                connections: {
                    ...connections,
                    [dirToClean]: {color}
                }
            }
        })
    }

    removeUtmostExtraLine = (next: string, prev: string, color: string) => {
        console.log( 'remove utmost fork')
        let passed = prev
        const stopFn = (key: string) => {
            const {utmost, crossLine} = this.getPoint(key) || {}
            const next = this.getLineNeighbors(key, color).filter(n => n !== prev)[0]
            !utmost && this.deletePoint(key)
            const col = crossLine ? DefaultColor : color
            utmost && this.updateLastPoint(key, passed, col)
            return !next
        }
        this.goToLinePoint(next, prev, stopFn)
    }

    removeLineFork = (next: string, prev: string, color: string) => {
        console.warn('remove forked line', next, prev)
        let passed = prev
        const toFn = (key: string) => {
            const point = this.getPoint(key)
            const last = this.isLast(point, passed, 'none', color)
            passed = key
            this.deletePoint(key)
            if (last) {
                this.updateLastPoint(last, passed, color)
            }
            return last
        }
        this.goToLinePoint(next, prev, toFn)
    }

    updateLineStart = (
        nextPoint: string,
        prevPoint: string,
        color: string,
        removeFork = true
    ) => {
        const {connections, utmost, joinPoint, crossLine} = this.getPoint(prevPoint)
            || {} as ITakenPointProps
        if (!connections) return
        const dir = this.determineDirection(prevPoint, nextPoint)
        if (removeFork && utmost && !crossLine && !joinPoint) {
            const neighbors = Object.keys(connections).reduce((acc, d) => {
                const neighbor = d !== dir && connections[d].neighbor
                neighbor && acc.push(neighbor)
                return acc
            }, [] as string[])
            console.warn('rem utmost fork', nextPoint, prevPoint, color, neighbors, crossLine)
            for (const nei of neighbors) {
                const dir = this.determineDirection(prevPoint, nei)
                this.addTakenPoints({
                    [prevPoint]: {
                        utmost,
                        connections: {
                            ...connections,
                            [dir]: {color: connections[dir].color}
                        },
                        crossLine,
                        joinPoint
                    }
                })
                this.removeUtmostExtraLine(nei, prevPoint, color)
            }
        }
        const updatedPoint = {
            [prevPoint]: {
                crossLine,
                joinPoint,
                utmost,
                connections: {
                    ...this.getPoint(prevPoint).connections,
                    [dir]: {
                        color, neighbor: nextPoint
                    }
                }
            }
        } as ITakenPoints
        isDev() && console.log('update line start', dir, updatedPoint, this.getPoint(prevPoint).connections, nextPoint, prevPoint, utmost, removeFork)
        this.addTakenPoints(updatedPoint)
    }


    updateLastPoint = (last: string, prev: string, color?: string) => {
        const {utmost, connections, crossLine, joinPoint} = this.getPoint(last)
        const dir = this.determineDirection(last, prev)
        const lineColor = color || connections[dir].color
        const newColor = crossLine ? DefaultColor : lineColor
        const directions = this.getLineDirections(connections, lineColor)
        const oneDir = !crossLine
            || (crossLine && directions.length < 2)
        const extraDir = directions.filter(d => d !== dir)[0]

        isDev() && console.warn('update last', last, prev, color, this.getPoint(last),
            'dir', dir, directions, 'line color', lineColor, newColor, extraDir)
        if (oneDir) {
            this.addTakenPoints({
                [last]: {
                    utmost,
                    crossLine,
                    joinPoint,
                    connections: {
                        ...connections,
                        [dir]: {color: newColor}
                    }
                }
            })
        } else {
            this.addTakenPoints({
                [last]: {
                    utmost,
                    crossLine,
                    joinPoint,
                    connections: {
                        ...connections,
                        [dir]: {color: DefaultColor},
                        [extraDir]: {color: DefaultColor}
                    }
                }
            })
            const extraConn = connections[extraDir].neighbor
            extraConn && this.removeLineFork(extraConn, last, lineColor)
        }
    }


    removeInterferedLines = (start: string) => {
        const startConnections = this.getPoint(start).connections
        const lineNeighbors = this.getLineNeighbors(startConnections)
        const lineColor = startConnections[LineDirections.top].color
        this.deletePoint(start)
        let prevPoint = [start, start, start, start]
        console.log('remove interfere', start, startConnections)
        const stopFn = (pointKey: string, index = 0) => {
            const {connections, utmost, crossLine, joinPoint} = this.getPoint(pointKey)
            const lineNeighbors = this.getLineNeighbors(connections)
            const last = utmost || lineNeighbors.length < 2
            if (!utmost) {
                this.deletePoint(pointKey)
                prevPoint[index] = pointKey
            } else {
                const dir = this.determineDirection(pointKey, prevPoint[index])
                const LastPointProps: ITakenPointProps = {
                    utmost,
                    joinPoint,
                    crossLine,
                    connections: !(crossLine || joinPoint)
                        ? defaultConnectionsWithColor(lineColor)
                        : {
                            ...connections,
                            [dir]: {color: DefaultColor}
                        }
                }
                this.addTakenPoints({[pointKey]: LastPointProps})
            }
            return last
        }
        for (let i = 0;  i < lineNeighbors.length; i++) {
            const neighbor = lineNeighbors[i]
            this.goToLinePoint(neighbor, start, stopFn, lineColor, i)
        }
    }
}

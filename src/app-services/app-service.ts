export class AppService {
    agent = navigator.userAgent
    agentData = (navigator as any).userAgentData as any

    isMobile = () => this.agentData.mobile
    isMozilla = () => !this.agentData
    isChrome = () => this.agentData.brands[0] === 'Chromium'
    isEdge = () => this.agentData.brands[0] === 'Microsoft Edge'
    getZoom = () => {
        if (!this.isMozilla) {
            const zoom = (window.outerWidth/window.innerWidth)
            const relZoom =  .9 - zoom
            return relZoom < 0 ? 1 - relZoom : 1
        }
        return .9
    }
}

export const appService = new AppService()

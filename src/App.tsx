import { Grommet } from 'grommet'
import React, { useEffect, type ReactElement } from 'react'
import { AppContextProvider } from './AppContext'
import Header from './Header'
import theme from './index.style'
import Radio from './Radio'
import { resizeToMinimum } from './util'

const App = (): ReactElement => {
    useEffect(() => {
        window.addEventListener('resize', resizeToMinimum)
        window.addEventListener('load', resizeToMinimum)

        return () => {
            window.removeEventListener('resize', resizeToMinimum)
            window.removeEventListener('load', resizeToMinimum)
        }
    }, [])
    return (
        <Grommet full theme={theme}>
            <AppContextProvider>
                <Header />
                <Radio />
            </AppContextProvider>
        </Grommet>
    )
}

export default App

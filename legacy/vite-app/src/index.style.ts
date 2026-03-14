import { dark, ThemeType } from 'grommet/themes'
import { deepMerge } from 'grommet/utils'

const theme: ThemeType = deepMerge(dark, {
    global: {
        drop: {
            background: '#444444',
            shadowSize: 'medium',
            extend: `
          border-bottom-left-radius: 12px;
          border-bottom-right-radius: 12px;
          overflow: hidden;
        `,
        },
        elevation: {
            dark: {
                medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            },
            light: {
                medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
            },
        },
        font: {
            size: '14px',
            family: 'Sora',
        },
        input: {
            weight: 400,
        },
    },
})

export default theme

import styled from 'styled-components'
import { Box, Button, ButtonExtendedProps } from 'grommet'

const Container = styled.div<{ expanded: boolean }>`
    display: flex;
    justify-content: ${(props) => (props.expanded ? 'center' : 'left')};
    align-items: center;
    font-size: 16px;
    gap: ${(props) => (props.expanded ? '50px' : '10px')};
    padding: ${(props) => (props.expanded ? '10px' : undefined)};
    width: ${(props) => (props.expanded ? '100%' : undefined)};
    flex-direction: ${(props) => (props.expanded ? 'column' : 'row')};
    cursor: pointer;
`

const MediaArtContainer = styled(Box)<{ expanded: boolean }>`
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width ${(props) => (props.expanded ? '100%' : undefined)};
    padding: 0 15px
`
const MediaArtWrapper = styled.div<{ expanded?: boolean }>`
    position: relative;
    width: ${(props) => (props.expanded ? '50vh' : '60px')};
    max-height: 50vh;
    max-width: ${(props) => (props.expanded ? '50vh' : '60px')};
`

const MediaArt = styled.img`
    transition: max-width 0.15s ease-in-out;
    border-radius: 6px;
    width: 100%;
    height: 100%;
`

const IconButton = styled(Button)<ButtonExtendedProps>`
    padding: ${(props) => (props.size === 'large' ? '18px' : '12px')};
`

const MediaStatusContainer = styled.div`
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    display: flex;
`

export {
    Container,
    MediaArtContainer,
    MediaArt,
    IconButton,
    MediaArtWrapper,
    MediaStatusContainer,
}

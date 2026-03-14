import { render, screen } from '@testing-library/react'
import App from './App'
import React from 'react'

test('renders logo', async () => {
    render(<App />)
    const logo = await screen.findByAltText('Logo')
    expect(logo).toBeInTheDocument()
})

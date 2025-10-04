import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeContext'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
global.localStorage = localStorageMock

// Test component that uses the theme context
const TestComponent = () => {
  const { currentTheme, updateSettings, resetSettings } = useTheme()
  
  return (
    <div>
      <div data-testid="current-theme">{currentTheme}</div>
      <button onClick={() => updateSettings({ theme: 'light' })}>
        Set Light Theme
      </button>
      <button onClick={() => updateSettings({ theme: 'dark' })}>
        Set Dark Theme
      </button>
      <button onClick={resetSettings}>
        Reset Settings
      </button>
    </div>
  )
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear()
    localStorageMock.setItem.mockClear()
  })

  test('provides initial theme settings', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
  })

  test('updates theme when updateSettings is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const lightButton = screen.getByText('Set Light Theme')
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })
  })

  test('resets settings when resetSettings is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    // First set a custom theme
    const lightButton = screen.getByText('Set Light Theme')
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('light')
    })

    // Then reset
    const resetButton = screen.getByText('Reset Settings')
    fireEvent.click(resetButton)

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark')
    })
  })

  test('loads settings from localStorage on mount', () => {
    const savedSettings = JSON.stringify({ theme: 'light' })
    localStorageMock.getItem.mockReturnValue(savedSettings)

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(localStorageMock.getItem).toHaveBeenCalledWith('nasa-explorer-theme-settings')
  })

  test('saves settings to localStorage when updated', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    const lightButton = screen.getByText('Set Light Theme')
    fireEvent.click(lightButton)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })
})
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Navbar from '../Navbar'
import { I18nProvider } from '../../contexts/I18nContext'
import { ThemeProvider } from '../../contexts/ThemeContext'

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '/',
  }),
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const TestWrapper = ({ children }) => {
  const queryClient = createTestQueryClient()
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </I18nProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

describe('Navbar', () => {
  test('renders navbar with logo and navigation links', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    )

    expect(screen.getByText('NASA Explorer')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Missions')).toBeInTheDocument()
    expect(screen.getByText('Exoplanets')).toBeInTheDocument()
    expect(screen.getByText('Satellites')).toBeInTheDocument()
  })

  test('renders language switcher', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    )

    expect(screen.getByText('English')).toBeInTheDocument()
  })

  test('renders theme toggle', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    )

    // Theme toggle button should be present
    const themeButton = screen.getByRole('button', { name: /switch to/i })
    expect(themeButton).toBeInTheDocument()
  })

  test('opens mobile menu when hamburger button is clicked', () => {
    render(
      <TestWrapper>
        <Navbar />
      </TestWrapper>
    )

    const hamburgerButton = screen.getByRole('button', { name: /menu/i })
    fireEvent.click(hamburgerButton)

    // Mobile menu should be visible
    expect(screen.getByText('Home')).toBeInTheDocument()
  })
})
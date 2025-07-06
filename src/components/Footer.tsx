export function Footer() {
  return (
    <footer
      style={{
        textAlign: 'center',
        padding: '1rem',
        fontSize: '0.85rem',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 'auto',
      }}
    >
      Made with ❤️ by{' '}
      <a
        href="https://iamgeorge.dev/"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: '#2ec4b6',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'color 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#26b3a6'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#2ec4b6'
        }}
      >
        George
      </a>
    </footer>
  )
}

import netlifyIdentity from 'netlify-identity-widget'

if (document.location.pathname === '/' || process.admin) {
  window.netlifyIdentity = netlifyIdentity

  netlifyIdentity.on('init', user => (user ||
    netlifyIdentity.on('login', () => {
      document.location.href = '/admin/'
    })
  ))

  netlifyIdentity.init()
}

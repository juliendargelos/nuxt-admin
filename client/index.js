if (process.browser) {
  const path = document.location.pathname
  const indexPath = path === '/'
  const adminPath = path.split('/')[1] === 'admin'

  if (indexPath || adminPath) {
    window.netlifyIdentity = require('netlify-identity-widget')
    window.netlifyIdentity.on('init', user => (user ||
      window.netlifyIdentity.on('login', () => {
        document.location.href = '/admin/'
      })
    ))
    window.netlifyIdentity.init()
  }
}

export const config = process.env.adminConfig


export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/app"
  },
  {
    "renderMode": 0,
    "route": "/app/feeds"
  },
  {
    "renderMode": 0,
    "route": "/app/feeds/hashtag/*"
  },
  {
    "renderMode": 0,
    "route": "/app/feeds:slug"
  },
  {
    "renderMode": 0,
    "route": "/"
  },
  {
    "renderMode": 0,
    "route": "/blog"
  },
  {
    "renderMode": 0,
    "route": "/blog/tag"
  },
  {
    "renderMode": 0,
    "route": "/blog/tag/*"
  },
  {
    "renderMode": 0,
    "route": "/blog/category"
  },
  {
    "renderMode": 0,
    "route": "/blog/category/*"
  },
  {
    "renderMode": 0,
    "route": "/blog/*"
  }
],
  assets: {
    'index.csr.html': {size: 19436, hash: 'aa56ee9d49c5a63cbb1e36771dcb281a914c112c68757d4f7e93a8ca3c2864f8', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 8114, hash: 'ab7bbef65747d83634d21b3003857f25837cba60d31c07b898cab0a332182ba3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-K5WDKREJ.css': {size: 253641, hash: 'y9/U0lVapE0', text: () => import('./assets-chunks/styles-K5WDKREJ_css.mjs').then(m => m.default)}
  },
};


export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
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
    'index.csr.html': {size: 19436, hash: 'a56fc85157fa55fa07f08a629404f037dba449b948c2c5b9cbcc1b60325375f6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 8114, hash: 'b3919494302d1bbffd517de91397b776f313aea38d138dd254a93a20436eeee3', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-532NEXOJ.css': {size: 254805, hash: 'zjjVaukZDcc', text: () => import('./assets-chunks/styles-532NEXOJ_css.mjs').then(m => m.default)}
  },
};

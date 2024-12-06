# 适配于monorepo方案的vite打包插件，可以通过cdn引入第三方库

This plugin is forked from [vite-plugin-cdn-import-async](https://github.com/VaJoy/vite-plugin-cdn-import-async) and allows you to specify modules that should be loaded in **defer/async** mode in addition.

修复的bug包含：
1. 修复了在monorepo方案下，无法正确识别到子包的路径问题
2. 修复了在html中title标签被注释时，插入的script标签也是被注释的问题

# Installation

npm:

```
npm install vite-plugin-cdn-import-monorepo --save-dev
```

yarn:

```
yarn add  vite-plugin-cdn-import-monorepo -D
```

# Usage

## Plugin config

Specify `async` or `defer` to `mode` param whthin configs of the module you want to import asynchronously from CDN:

```js
// vite.config.js
import importToCDN from 'vite-plugin-cdn-import-monorepo'

export default {
    plugins: [
        importToCDN({
            modules: [
                {
                    name: 'vue',
                    var: 'Vue',
                    mode: 'async', // 'async' atrribute will be added to its <script> tag.
                    path: `https://unpkg.com/vue@next`,
                },
                {
                    name: 'axios',  // Module without 'mode' param will be loaded synchronously.
                    var: 'axios',
                    path: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js',
                }
            ],
        }),
    ],
}
```

This demo will generate codes below into the output file:

```html
<script>window.__cdnImportAsync_nameToVar={"axios":"axios"};</script>
<script>function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];</script>
<script>function __cdnImportAsync_deferredLoader(n,r){var c=document.createElement("script");c.onload=function(){__cdnImportAsyncHandler(n)},c.onerror=function(){__cdnImportAsyncHandler(n,!0)},c.src=r,document.body.appendChild(c)}</script>
<script>!function(){window.addEventListener("load",function e(){__cdnImportAsync_deferredLoader("axios","https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js"),window.removeEventListener("load",e)},!1)}();</script>
```



### Lazy loading

In addition to `async` or `defer` as the value of `mode`, here's other avalable values for lazy-loading:

|  Value of `mode`   | Description  |
|  ----  | ----  |
| DOMContentLoaded  | Module will start being loaded within `DOMContentLoaded` event of `window`. |
| load  | Module will start being loaded within `load` event of `window`. |
| [milliseconds]  | Module will start being loaded in specified milliseconds after `load` event emits. |

**Example**

In `vite.config.js`:

```js
export default defineConfig({
    plugins: [
        importToCDN({
            modules: [
                {
                  name: 'lottie-web',
                  var: 'lottie',
                  mode: '3000',
                  path: `https://cdn.jsdelivr.net/npm/lottie-web@5.10.0/build/player/lottie.min.js`,
                },
                {
                  name: 'axios',
                  var: 'axios',
                  mode: 'load',
                  path: 'https://cdnjs.cloudflare.com/ajax/libs/axios/1.5.1/axios.min.js',
                }
            ],
        }),
        reactRefresh(),
    ],
})
```

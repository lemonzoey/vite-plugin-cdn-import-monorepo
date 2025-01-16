import externalGlobals from 'rollup-plugin-external-globals'
import fs from 'fs'
import path from 'path'
import { Plugin, UserConfig } from 'vite'
import { Module, Options } from './type'
import autoComplete from './autoComplete'
import { generateScript, filterModulesByInputHtml, resetHanlerFlag, generateNameToVarScript } from './helper'

/**
 * get npm module version
 * @param name
 * @returns
 */
function getModuleVersion(name: string): string {
  let pwd = process.cwd();
  let pkgFile = path.join(pwd, "node_modules", name, "package.json");
  let times = 3;
  while (!fs.existsSync(pkgFile) && times > 0) {
      pwd = path.resolve(pwd, "..");
      console.log("pwd", pwd);
      pkgFile = path.join(pwd, "node_modules", name, "package.json");
      console.log("pkgFile", pkgFile);
      times--;
  }
  if (!fs.existsSync(pkgFile)) {
      return "";
  }
  const pkgJson = JSON.parse(fs.readFileSync(pkgFile, "utf8"));
  return pkgJson.version;
}

/**
 * 是否完整的 url
 * @param path 
 * @returns 
 */
function isFullPath(path: string): boolean {
  const regex = /^(https?:|\/\/)/;
  // return regex.test(path);
  return true
}

function renderUrl(url: string, data: {
    name: string
    version: string
    path: string
}) {
    const { path } = data
    if (isFullPath(path)
    ) {
        url = path
    }
    return url.replace(/\{name\}/g, data.name)
        .replace(/\{version\}/g, data.version)
        .replace(/\{path\}/g, path)
}

function PluginImportToCDN(options: Options): Plugin[] {

    const {
        modules = [],
        prodUrl = 'https://cdn.jsdelivr.net/npm/{name}@{version}/{path}',
    } = options

    let isBuild = false

    const data = modules.map((m) => {
        let v: Module
        if (typeof m === 'function') {
            v = m(prodUrl)
        } else {
            v = m
        }
        const version = getModuleVersion(v.name)

        let pathList: string[] = []
        if (!Array.isArray(v.path)) {
            pathList.push(v.path)
        } else {
            pathList = v.path
        }

        const module = {
            ...v,
            version
        }

        pathList = pathList.map(p => {
            if (!version && !isFullPath(p)) {
                // console.log("🚀 ~ data ~ version:", version)
                throw new Error(`modules: ${module.name} package.json file does not exist`)
            }
            return renderUrl(module.prodUrl ?? prodUrl, {
                ...module,
                path: p
            })
        })

        let css = v.css || []
        if (!Array.isArray(css) && css) {
            css = [css]
        }

        const cssList = !Array.isArray(css) ? [] : css.map(c => renderUrl(module.prodUrl ?? prodUrl, {
            ...module,
            path: c
        }))

        return {
            ...module,
            pathList,
            cssList
        }
    })

    const externalMap: {
        [name: string]: string
    } = {}

    data.forEach((v) => {
        externalMap[v.name] = v.var
    })

    const externalLibs = Object.keys(externalMap)

    const plugins: Plugin[] = [
        {
            ...externalGlobals(externalMap),
            enforce: 'post',
            apply: 'build'
        },
        {
            name: 'vite-plugin-cdn-import-monorepo',
            config(_, { command }) {
                const userConfig: UserConfig = {
                    build: {
                        rollupOptions: {}
                    }
                }

                if (command === 'build') {
                    isBuild = true

                    userConfig!.build!.rollupOptions = {
                        external: [...externalLibs]
                    }


                } else {
                    isBuild = false
                }

                return userConfig
            },
            transformIndexHtml(html) {
                resetHanlerFlag()
                html = filterModulesByInputHtml(html, data)
                const cssCode = data
                    .filter(m => !m.ignore)
                    .map(v => v.cssList.map(css => `<link href="${css}" rel="stylesheet">`).join('\n'))
                    .filter(v => v)
                    .join('\n')

                const jsCodeNormal = !isBuild
                    ? ''
                    : data
                        .filter(m => !m.ignore)
                        .filter(m => !m.mode)
                        .map(p => p.pathList.map(url => generateScript(url, p)).join('\n'))
                        .join('\n')
                const jsCodeAsync = !isBuild
                ? ''
                : data
                    .filter(m => !m.ignore)
                    .filter(m => m.mode)
                    .map(p => p.pathList.map(url => generateScript(url, p)).join('\n'))
                    .join('\n')

                const nameToVarCode = !isBuild ? '' : generateNameToVarScript()
                return html.replace(
                    /<\/head>/i,
                    `${cssCode}\n${jsCodeNormal}\n${nameToVarCode}\n${jsCodeAsync}\n</head>`
                )
            },
        },
    ]

    return plugins
}

export {
    PluginImportToCDN as Plugin,
    Options,
    autoComplete
}

export default PluginImportToCDN

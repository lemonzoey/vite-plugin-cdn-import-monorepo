"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// src/index.ts
var _rolluppluginexternalglobals = require('rollup-plugin-external-globals'); var _rolluppluginexternalglobals2 = _interopRequireDefault(_rolluppluginexternalglobals);
var _fs = require('fs'); var _fs2 = _interopRequireDefault(_fs);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);

// src/autoComplete.ts
var modulesConfig = {
  "react": {
    var: "React",
    jsdeliver: {
      path: "umd/react.production.min.js"
    }
  },
  "react-dom": {
    var: "ReactDOM",
    jsdeliver: {
      path: "umd/react-dom.production.min.js"
    }
  },
  "react-router-dom": {
    var: "ReactRouterDOM",
    jsdeliver: {
      path: "umd/react-router-dom.min.js"
    }
  },
  "antd": {
    var: "antd",
    jsdeliver: {
      path: "dist/antd.min.js",
      css: "dist/antd.min.css"
    }
  },
  "ahooks": {
    var: "ahooks",
    jsdeliver: {
      path: "dist/ahooks.js"
    }
  },
  "@ant-design/charts": {
    var: "charts",
    jsdeliver: {
      path: "dist/charts.min.js"
    }
  },
  "vue": {
    var: "Vue",
    jsdeliver: {
      path: "dist/vue.global.prod.js"
    }
  },
  "vue2": {
    var: "Vue",
    jsdeliver: {
      name: "vue",
      path: "dist/vue.runtime.min.js"
    }
  },
  "@vueuse/shared": {
    var: "VueUse",
    jsdeliver: {
      path: "index.iife.min.js"
    }
  },
  "@vueuse/core": {
    var: "VueUse",
    jsdeliver: {
      path: "index.iife.min.js"
    }
  },
  "moment": {
    var: "moment",
    jsdeliver: {
      path: "moment.min.js"
    }
  },
  "eventemitter3": {
    var: "EventEmitter3",
    jsdeliver: {
      path: "umd/eventemitter3.min.js"
    }
  },
  "file-saver": {
    var: "window",
    jsdeliver: {
      path: "dist/FileSaver.min.js"
    }
  },
  "browser-md5-file": {
    var: "browserMD5File",
    jsdeliver: {
      path: "dist/index.umd.min.js"
    }
  },
  "xlsx": {
    var: "XLSX",
    jsdeliver: {
      path: "dist/xlsx.full.min.js"
    }
  },
  "axios": {
    var: "axios",
    jsdeliver: {
      path: "dist/axios.min.js"
    }
  },
  "lodash": {
    var: "_",
    jsdeliver: {
      path: "lodash.min.js"
    }
  },
  "crypto-js": {
    var: "crypto-js",
    jsdeliver: {
      path: "crypto-js.min.js"
    }
  },
  "localforage": {
    var: "localforage",
    jsdeliver: {
      path: "dist/localforage.min.js"
    }
  }
};
function isJsdeliver(prodUrl) {
  return prodUrl.includes("//cdn.jsdelivr.net");
}
function isUnpkg(prodUrl) {
  return prodUrl.includes("//unpkg.com");
}
function isCdnjs(prodUrl) {
  return prodUrl.includes("//cdnjs.cloudflare.com");
}
function autoComplete(name) {
  const config = modulesConfig[name];
  if (!config) {
    throw new Error(`The configuration of module ${name} does not exist `);
  }
  return (prodUrl) => {
    if (isCdnjs(prodUrl)) {
      throw new Error(`The configuration of module ${name} in ${prodUrl} does not exist `);
    } else {
      if (!(isJsdeliver(prodUrl) || isUnpkg(prodUrl))) {
        console.warn("Unknown prodUrl, using the jsdeliver rule");
      }
      return __spreadValues({
        name,
        var: config.var
      }, config.jsdeliver);
    }
  };
}

// src/helper.ts
var isAsyncHandlerGenerated = false;
var isDeferredHandlerGenerated = false;
var nameToVar = {};
function resetHanlerFlag() {
  isAsyncHandlerGenerated = false;
  isDeferredHandlerGenerated = false;
}
function generateAsyncHandlerTemplate() {
  let result = "";
  if (!isAsyncHandlerGenerated) {
    const asyncHandlerTemplate = `function __cdnImportAsyncHandler(o,n){n&&window.cdnImportAsync_loadingErrorModules.push(o);var d=new CustomEvent("asyncmoduleloaded",{detail:{module:o,isError:!!n}});window.dispatchEvent(d)}window.cdnImportAsync_loadingErrorModules=window.cdnImportAsync_loadingErrorModules||[];`;
    result = `<script>${asyncHandlerTemplate}<\/script>
`;
    isAsyncHandlerGenerated = true;
  }
  return result;
}
function generateDeferredHandlerTemplate() {
  let result = generateAsyncHandlerTemplate();
  if (!isDeferredHandlerGenerated) {
    isDeferredHandlerGenerated = true;
    result += `<script>function __cdnImportAsync_deferredLoader(n,r){var c=document.createElement("script");c.onload=function(){__cdnImportAsyncHandler(n)},c.onerror=function(){__cdnImportAsyncHandler(n,!0)},c.src=r,document.body.appendChild(c)}<\/script>
`;
  }
  return result;
}
function generateScript(url, p) {
  let result = "";
  if (p && (p.mode === "async" || p.mode === "defer")) {
    nameToVar[p.name] = p.var;
    result = generateAsyncHandlerTemplate();
    result += `<script ${p.mode} onload="__cdnImportAsyncHandler('${p.var}')" onerror="__cdnImportAsyncHandler('${p.var}', true)" src="${url}"><\/script>`;
  } else if (p && (p.mode === "DOMContentLoaded" || p.mode === "load")) {
    nameToVar[p.name] = p.var;
    result += generateDeferredHandlerTemplate();
    result += `<script>!function(){window.addEventListener("${p.mode}",function e(){__cdnImportAsync_deferredLoader("${p.var}","${url}"),window.removeEventListener("${p.mode}",e)},!1)}();<\/script>`;
  } else if (p && typeof p.mode === "string" && p.mode.match(/^[0-9]+$/)) {
    nameToVar[p.name] = p.var;
    result += generateDeferredHandlerTemplate();
    result += `<script>!function(){window.addEventListener("load",function e(){setTimeout(function(){__cdnImportAsync_deferredLoader("${p.var}","${url}")},${p.mode}),window.removeEventListener("load",e)},!1)}();<\/script>`;
  } else {
    result = `<script src="${url}"><\/script>`;
  }
  return result;
}
var metaReg = new RegExp(/<meta(\s[^>]*?)data-cdn-import=["']([^'"]+?)["']([^>]*?)>/);
function filterModulesByInputHtml(html, modules) {
  const usedModules = {};
  return html.replace(metaReg, (_, contentLeft = "", markedModules, contentRight = "") => {
    markedModules.split(",").forEach((v) => {
      v = v.trim();
      const varAndMode = v.split("@");
      const moduleVar = varAndMode[0];
      if (moduleVar) {
        usedModules[moduleVar] = varAndMode[1] || true;
      }
    });
    const modeList = ["async", "defer", "DOMContentLoaded", "load"];
    modules.forEach((module) => {
      const isUsed = usedModules[module.var];
      if (!isUsed) {
        module.ignore = true;
      } else if (typeof isUsed === "string" && (modeList.includes(isUsed) || isUsed.match(/^[0-9]+$/))) {
        module.mode = isUsed;
      }
    });
    return _;
  });
}
function generateNameToVarScript() {
  let result = "";
  const vars = Object.keys(nameToVar);
  if (vars.length) {
    result = `<script>window.__cdnImportAsync_nameToVar=${JSON.stringify(nameToVar)};<\/script>`;
  }
  return result;
}

// src/index.ts
function getModuleVersion(name) {
  let pwd = process.cwd();
  let pkgFile = _path2.default.join(pwd, "node_modules", name, "package.json");
  let times = 3;
  while (!_fs2.default.existsSync(pkgFile) && times > 0) {
    pwd = _path2.default.resolve(pwd, "..");
    console.log("pwd", pwd);
    pkgFile = _path2.default.join(pwd, "node_modules", name, "package.json");
    console.log("pkgFile", pkgFile);
    times--;
  }
  if (!_fs2.default.existsSync(pkgFile)) {
    return "";
  }
  const pkgJson = JSON.parse(_fs2.default.readFileSync(pkgFile, "utf8"));
  return pkgJson.version;
}
function isFullPath(path2) {
  const regex = /^(https?:|\/\/)/;
  return true;
}
function renderUrl(url, data) {
  const { path: path2 } = data;
  if (isFullPath(path2)) {
    url = path2;
  }
  return url.replace(/\{name\}/g, data.name).replace(/\{version\}/g, data.version).replace(/\{path\}/g, path2);
}
function PluginImportToCDN(options) {
  const {
    modules = [],
    prodUrl = "https://cdn.jsdelivr.net/npm/{name}@{version}/{path}"
  } = options;
  let isBuild = false;
  const data = modules.map((m) => {
    let v;
    if (typeof m === "function") {
      v = m(prodUrl);
    } else {
      v = m;
    }
    const version = getModuleVersion(v.name);
    let pathList = [];
    if (!Array.isArray(v.path)) {
      pathList.push(v.path);
    } else {
      pathList = v.path;
    }
    const module = __spreadProps(__spreadValues({}, v), {
      version
    });
    pathList = pathList.map((p) => {
      var _a;
      if (!version && !isFullPath(p)) {
        throw new Error(`modules: ${module.name} package.json file does not exist`);
      }
      return renderUrl((_a = module.prodUrl) != null ? _a : prodUrl, __spreadProps(__spreadValues({}, module), {
        path: p
      }));
    });
    let css = v.css || [];
    if (!Array.isArray(css) && css) {
      css = [css];
    }
    const cssList = !Array.isArray(css) ? [] : css.map((c) => {
      var _a;
      return renderUrl((_a = module.prodUrl) != null ? _a : prodUrl, __spreadProps(__spreadValues({}, module), {
        path: c
      }));
    });
    return __spreadProps(__spreadValues({}, module), {
      pathList,
      cssList
    });
  });
  const externalMap = {};
  data.forEach((v) => {
    externalMap[v.name] = v.var;
  });
  const externalLibs = Object.keys(externalMap);
  const plugins = [
    __spreadProps(__spreadValues({}, _rolluppluginexternalglobals2.default.call(void 0, externalMap)), {
      enforce: "post",
      apply: "build"
    }),
    {
      name: "vite-plugin-cdn-import-monorepo",
      config(_, { command }) {
        const userConfig = {
          build: {
            rollupOptions: {}
          }
        };
        if (command === "build") {
          isBuild = true;
          userConfig.build.rollupOptions = {
            external: [...externalLibs]
          };
        } else {
          isBuild = false;
        }
        return userConfig;
      },
      transformIndexHtml(html) {
        resetHanlerFlag();
        html = filterModulesByInputHtml(html, data);
        const cssCode = data.filter((m) => !m.ignore).map((v) => v.cssList.map((css) => `<link href="${css}" rel="stylesheet">`).join("\n")).filter((v) => v).join("\n");
        const jsCodeNormal = !isBuild ? "" : data.filter((m) => !m.ignore).filter((m) => !m.mode).map((p) => p.pathList.map((url) => generateScript(url, p)).join("\n")).join("\n");
        const jsCodeAsync = !isBuild ? "" : data.filter((m) => !m.ignore).filter((m) => m.mode).map((p) => p.pathList.map((url) => generateScript(url, p)).join("\n")).join("\n");
        const nameToVarCode = !isBuild ? "" : generateNameToVarScript();
        return html.replace(/<\/head>/i, `${cssCode}
${jsCodeNormal}
${nameToVarCode}
${jsCodeAsync}
</head>`);
      }
    }
  ];
  return plugins;
}
var src_default = PluginImportToCDN;




exports.Plugin = PluginImportToCDN; exports.autoComplete = autoComplete; exports.default = src_default;

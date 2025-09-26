import { build } from "esbuild";
// import fs from "fs";
// import obfuscator from "javascript-obfuscator";

build({
  entryPoints: ["server.ts"],
  bundle: true,
  platform: "node",
  minify: true,
  outfile: "dist/server.js",
  // outfile: "dist/server.tmp.js",
  target: "es2020",
  sourcemap: false,
  treeShaking: true,
  external: ["bcrypt"],
  format: "cjs",
  define: {
    "process.env.NODE_ENV": '"production"',
  },
}).catch(() => Node.process.exit(1));
// .then(() => {
//   const code = fs.readFileSync("dist/server.tmp.js", "utf8");
//   const obfuscated = obfuscator.obfuscate(code, {
//     compact: true,
//     controlFlowFlattening: true,
//     deadCodeInjection: true,
//     stringArray: true,
//     stringArrayEncoding: ["rc4"],
//     renameGlobals: true,
//   });

//   fs.writeFileSync("dist/server.js", obfuscated.getObfuscatedCode());
//   // fs.unlinkSync("dist/server.tmp.js");
//   console.log("✅ Build complete: dist/server.js");
// });

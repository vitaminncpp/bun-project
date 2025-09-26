import ffi from "ffi-napi";
import ref from "ref-napi";

const charPtr = ref.refType("char");

const logCallback = ffi.Callback("void", [charPtr], (msgPtr) => {
    const msg = msgPtr.readCString();
    console.log("DLL says:", msg);
});

const lib = ffi.Library("./main.dll", {
    addNumbersWithLogs: ["int", ["int", "int", "pointer"]],
});

console.log("Calling async DLL function...");
lib.addNumbersWithLogs.async(5, 7, logCallback, (err, result) => {
    if (err) throw err;
    console.log("Final Result:", result);
});

while (true) {
    console.log("this is interval");
}

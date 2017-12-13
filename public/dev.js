const DEVMODE = {
    active: false,
    map: null
};
window.DEVMODE = DEVMODE;
function loadMap(e) {
    DEVMODE.active = true;
    DEVMODE.map = e;
    console.log(e);
}
dispatchEvent(new Event("devReady"));

if (DEVMODE.active) {
    document.title = "MarioClone - DevMode";
}

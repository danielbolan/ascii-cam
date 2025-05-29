const canvas = document.getElementById("canvas");
const video = document.getElementById("sourceVideo");
const videoResize = document.getElementById("videoResize");

const w = canvas.offsetWidth;
const h = canvas.offsetHeight;
const s = 12;
let t = 0;

const charClasses = [
    " ",
    ".',          ",
    ".',     ",
    ".',   ",
    ".', -\\\"':; ",
    "-\\\"':;",
    "-:;/\\+=*?!",
    "/\\cro+=*7?i1l!tL()?%",
    "/\\cro+=*7?i1l!tL()?I%weasmndkbuEF2$5",
    "weasmndkbuEF2$5I",
    "weasmndkbuEF2$5IQ@OGD8690&WM#",
    "Q@OGD8690&WM#",
];

const font = new FontFace("C64", "url(fonts/C64_Pro_Mono-STYLE.woff2");
font.load();

function startWebcam() {
    document.getElementById("enableWebcam").hidden = true;
    navigator.mediaDevices.getUserMedia({ video: true, audio: false }).then(
        stream => { video.srcObject = stream; }
    );
}

function getChar(value) {
    const classIndex = 1 - Math.abs(value - 0.5) * 2;
    const charClass = charClasses[Math.floor(classIndex * (charClasses.length - 1))];
    const char = charClass[Math.floor(Math.random() * (charClass.length - 1))];
    return char;
}

function animate() {
    if (font.status != "loaded") {
        animationCallback = requestAnimationFrame(animate);
        return;
    }
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let ctx = canvas.getContext("2d");
    ctx.font = `${s}px "C64"`;
    videoResize.width = Math.ceil(canvas.offsetWidth / s);
    videoResize.height = Math.ceil(canvas.offsetHeight / s);
    let resizeCtx = videoResize.getContext("2d");
    const w = videoResize.width;
    const h = videoResize.height;
    resizeCtx.drawImage(video, (w - h) / 2, 0, h, h);
    const pixels = resizeCtx.getImageData(0, 0, videoResize.width, videoResize.height);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w * s, h * s);
    for (let x = 0; x < pixels.width; x++) {
        for (let y = 0; y < pixels.height; y++) {
            const i = (y * pixels.width + x) * 4;
            const r = pixels.data[i];
            const g = pixels.data[i + 1];
            const b = pixels.data[i + 2];
            const value = (r * .299 + g * .587 + b * .114) / 255;
            const char = getChar(value);
            ctx.fillStyle = "#fff";
            if (value > 0.5) {
                ctx.fillRect(x * s, y * s, s, s);
                ctx.fillStyle = "#000";
            }
            if (char != " ") {
                ctx.fillText(char, x * s, (y + 1) * s);
            }
        }
    }
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
namespace mp3 {
    let audio: HTMLAudioElement;
    let status = "";
    let ctx: AudioContext | null = null;

    // Call this from a user gesture once; we also call it inside play().
    function unlockAudio() {
        try {
            const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (AC) {
                ctx = (window as any).__mp3ctx || ((window as any).__mp3ctx = new AC());
                if (ctx.state !== "running") {
                    ctx.resume().then(() => {
                        log("AudioContext resumed");
                    }).catch(e => log("AudioContext resume error: " + e));
                } else {
                    log("AudioContext already running");
                }
            } else {
                log("No AudioContext available");
            }
        } catch (e) {
            log("unlockAudio exception: " + e);
        }
    }

    function log(msg: string) {
        status = msg;
        console.log("[mp3]", msg);
        game.consoleOverlay.setVisible(true);
        game.consoleOverlay.setTransparency(30);
        game.consoleOverlay.print(msg);
    }

    function wireAudioEvents(a: HTMLAudioElement) {
        const e = (n: string) => a.addEventListener(n, () => log("event: " + n));
        e("loadstart"); e("durationchange"); e("loadedmetadata"); e("loadeddata");
        e("canplay"); e("canplaythrough"); e("play"); e("playing");
        e("pause"); e("ended"); e("stalled"); e("suspend"); e("waiting");
        a.addEventListener("error", () => {
            const err = (a.error && a.error.code) || "unknown";
            log("ERROR: audio error code " + err);
        });
    }

    export function play(url: string) {
        log("play(" + url + ")");
        unlockAudio();

        if (audio) {
            try { audio.pause(); } catch {}
        }
        audio = new Audio();
        wireAudioEvents(audio);

        // Optional: uncomment if your server requires CORS for analyzers, etc.
        // audio.crossOrigin = "anonymous";

        audio.src = url;
        audio.loop = true;
        audio.volume = 1;

        // Check codec support quickly
        const can = (new Audio()).canPlayType("audio/mpeg");
        log("canPlayType(audio/mpeg) = " + (can || "''"));

        const p = audio.play();
        if (p && typeof p.catch === "function") {
            p.then(() => log("play() resolved")).catch((e: any) => {
                log("play() rejected: " + (e?.name || "") + " " + (e?.message || e));
                log("Tip: start playback from a button press to satisfy autoplay");
            });
        }
    }

    export function stop() {
        log("stop()");
        if (audio) {
            try { audio.pause(); } catch {}
        }
    }

    export function volume(v: number) {
        const vv = Math.max(0, Math.min(1, v));
        if (audio) audio.volume = vv;
        log("volume(" + vv + ")");
    }

    // Handy helper you can call from a button press if needed.
    // Example: controller.A.onEvent(Pressed, mp3.enableDebug)
    //% block="unlock audio (debug)"
    export function enableDebug() {
        log("enableDebug()");
        unlockAudio();
    }
}

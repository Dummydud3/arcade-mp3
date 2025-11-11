namespace mp3 {
    let audio: HTMLAudioElement;

    function unlockAudio() {
        try {
            const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
            if (Ctx) {
                const ctx = (window as any).__mp3ctx || ((window as any).__mp3ctx = new Ctx());
                if (ctx.state !== "running") ctx.resume();
            }
        } catch {}
    }

    export function play(url: string) {
        unlockAudio();
        if (audio) audio.pause();
        audio = new Audio(url);
        audio.loop = true;     // set false if you don’t want looping
        audio.volume = 1;
        audio.play().catch(()=>{});
    }

    export function stop() {
        if (audio) audio.pause();
    }

    export function volume(v: number) {
        if (audio) audio.volume = Math.max(0, Math.min(1, v));
    }
}

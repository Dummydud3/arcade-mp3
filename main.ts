//% color=#e07070 icon="\uf001" block="MP3"
namespace mp3 {
    //% block="play MP3 from URL %url"
    export function play(url: string) {}

    //% block="stop MP3"
    export function stop() {}

    //% block="set MP3 volume %v"
    //% v.min=0 v.max=1 v.defl=1
    export function volume(v: number) {}
}

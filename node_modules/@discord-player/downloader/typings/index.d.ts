declare module "@discord-player/downloader" {
    import type { Readable } from "stream";
    import type { raw as ytdl } from "youtube-dl-exec";

    const version: string;
    
    export interface Info {
        title: string;
        duration: number;
        thumbnail: string;
        views: number;
        author: string;
        description: string;
        url: string;
        source: string,
        engine: Readable;
    }

    class Downloader {
        static download(url: string): Readable;
        static getInfo(url: string): Promise<{ playlist?: any, info: Info[] }>;
        static validate(url: string): boolean;
        static important(): boolean;
    }

    export {
        Downloader,
        ytdl,
        version
    };

}
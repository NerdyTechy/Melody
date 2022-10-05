const ytdl = require("youtube-dl-exec").raw;

class Downloader {

    constructor() {
        throw new Error(`The ${this.constructor.name} class may not be instantiated!`);
    }

    /**
     * Downloads stream through youtube-dl
     * @param {string} url URL to download stream from
     */
    static download(url) {
        if (!url || typeof url !== "string") throw new Error("Invalid url");

        const ytdlProcess = ytdl(url, {
                o: '-',
                q: '',
                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                r: '100K',
            },
            {
                stdio: ['ignore', 'pipe', 'ignore']
            }
        );

        if (!ytdlProcess.stdout) throw new Error('No stdout');
        const stream = ytdlProcess.stdout;

        stream.on("error", () => {
            if (!ytdlProcess.killed) ytdlProcess.kill();
            stream.resume();
        });

        return stream;
    }

    /**
     * Returns stream info
     * @param {string} url stream url
     */
    static getInfo(url) {
        return new Promise((resolve, reject) => {
            if (!url || typeof url !== "string") reject(new Error("Invalid url"));

            const a = ytdl(url, {
                dumpSingleJson: true,
                skipDownload: true,
                simulate: true,
            }, { stdio: ['ignore', 'pipe', 'ignore'] });

            const chunk = [];

            a.on("error", () => {
                resolve(null);
            });

            a.stdout.on("data", x => chunk.push(x));
            
            a.stdout.on("end", () => {
                try {
                    const info = JSON.parse(Buffer.concat(chunk).toString());
                    const data = {
                        title: info.fulltitle || info.title || "Attachment",
                        duration: (info.duration || info.duration_raw) * 1000 || 0,
                        thumbnail: info.thumbnails ? info.thumbnails[0].url : info.thumbnail || "https://upload.wikimedia.org/wikipedia/commons/2/2a/ITunes_12.2_logo.png",
                        views: info.view_count || 0,
                        author: info.uploader || info.channel || "YouTubeDL Media",
                        description: info.description || "",
                        url: url,
                        source: info.extractor,
                        get engine() {
                            return Downloader.download(url)
                        }
                    };

                    resolve({ playlist: null, info: [data] });
                } catch {
                    resolve(null);
                }
            });
        });
    }

    static validate(url) {
        const REGEX = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        return REGEX.test(url || "");
    }

    static get important() {
        return true;
    }
}


module.exports = Downloader;
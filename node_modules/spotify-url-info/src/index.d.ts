declare module "spotify-url-info" {
  interface Spotify {
    getData(url: string, options?: object): any;
    getPreview(url: string, options?: object): Promise<Preview>;
    getTracks(url: string, options?: object): Promise<Tracks[]>;
    getDetails(url: string, options?: object): Promise<{preview: Preview, tracks: Tracks[]}>;
  }

  export interface Preview {
    title: string;
    type: string;
    track: string;
    artist: string;
    image: string;
    audio: string;
    link: string;
    embed: string;
    date: string;
    description: string;
  }

  export interface Tracks {
    artists?: ArtistsEntity[] | null;
    duration_ms: number;
    episode: boolean;
    explicit: boolean;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
    type: string;
    uri: string;
  }
  export interface ArtistsEntity {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
  }
  export interface ExternalUrls {
    spotify: string;
  }

  export default function spotify(fetch: any): Spotify;
}

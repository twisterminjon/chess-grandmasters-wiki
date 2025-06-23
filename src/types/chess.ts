export interface GrandmastersResponse {
    players: string[];
  }
  
  export interface PlayerProfile {
    "@id": string;
    url: string;
    username: string;
    player_id: number;
    title?: string;
    status: string;
    name?: string;
    avatar?: string;
    location?: string;
    country: string;
    joined: number;
    last_online: number;
    followers: number;
    is_streamer: boolean;
    twitch_url?: string;
    fide?: number;
  }
  
  export interface ApiError {
    message: string;
    status?: number;
  }
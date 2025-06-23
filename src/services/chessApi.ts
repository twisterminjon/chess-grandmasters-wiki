import type { GrandmastersResponse, PlayerProfile } from '../types/chess';

const BASE_URL = 'https://api.chess.com/pub';

export class ChessApiService {
  static async getGrandmasters(): Promise<string[]> {
    try {
      const response = await fetch(`${BASE_URL}/titled/GM`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: GrandmastersResponse = await response.json();
      return data.players;
    } catch (error) {
      console.error('Failed to fetch grandmasters:', error);
      throw new Error('Failed to fetch grandmasters list');
    }
  }

  static async getPlayerProfile(username: string): Promise<PlayerProfile> {
    try {
      const response = await fetch(`${BASE_URL}/player/${username}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Player not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: PlayerProfile = await response.json();
      return data;
    } catch (error) {
      console.error(`Failed to fetch player profile for ${username}:`, error);
      throw error;
    }
  }
}
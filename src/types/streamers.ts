// Tipos de datos para streamers
export interface Streamer {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
	isLive: boolean;
	followers: number;
	verified: boolean;
	description: string;
	socialMedia: {
		twitter?: string;
		instagram?: string;
		youtube?: string;
		discord?: string;
	};
}

export interface Stream {
	id: string;
	streamerId: string;
	title: string;
	category: string;
	game: string;
	thumbnail: string;
	viewers: number;
	startedAt: Date;
	language: string;
	tags: string[];
	isRecording: boolean;
	isMature: boolean;
}

export interface StreamWithStreamer extends Stream {
	streamer: Streamer;
}

// Categorías de juegos populares
export const GAME_CATEGORIES = {
	GTAV: "Grand Theft Auto V",
	VALORANT: "VALORANT",
	LOL: "League of Legends",
	DOTA2: "Dota 2",
	CS2: "Counter-Strike 2",
	FORTNITE: "Fortnite",
	MINECRAFT: "Minecraft",
	AOE2: "Age of Empires II: Definitive Edition",
	APEX: "Apex Legends",
	WARZONE: "Call of Duty: Warzone",
	JUST_CHATTING: "Conversando",
	SLOTS: "Slots & Casino",
	IRL: "En la vida real",
	MUSIC: "Música"
} as const;

export type GameCategory = typeof GAME_CATEGORIES[keyof typeof GAME_CATEGORIES];
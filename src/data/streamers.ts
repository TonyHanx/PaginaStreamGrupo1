import { type Streamer, type Stream, type StreamWithStreamer, GAME_CATEGORIES } from '../types/streamers';

// Base de datos de streamers populares
export const STREAMERS: Streamer[] = [
	{
		id: "1",
		username: "auronplay",
		displayName: "AuronPlay",
		avatar: "",
		isLive: true,
		followers: 15200000,
		verified: true,
		description: "Streamer español, creador de contenido y comediante. Variedad de juegos y reacciones.",
		socialMedia: {
			twitter: "@auronplay",
			youtube: "AuronPlay",
			instagram: "@auronplay"
		}
	},
	{
		id: "2",
		username: "elrubius",
		displayName: "ElRubius",
		avatar: "",
		isLive: true,
		followers: 12800000,
		verified: true,
		description: "El Rubius OMG! Streamer y YouTuber español. Variedad de contenido y gaming.",
		socialMedia: {
			twitter: "@Rubiu5",
			youtube: "ElrubiusOMG",
			instagram: "@elrubius"
		}
	},
	{
		id: "3",
		username: "thegrefg",
		displayName: "TheGrefg",
		avatar: "",
		isLive: true,
		followers: 11500000,
		verified: true,
		description: "Streamer español profesional. Gaming, reacciones y entretenimiento.",
		socialMedia: {
			twitter: "@TheGrefg",
			youtube: "TheGrefg",
			instagram: "@thegrefg"
		}
	},
	{
		id: "4",
		username: "ibai",
		displayName: "Ibai",
		avatar: "",
		isLive: true,
		followers: 13600000,
		verified: true,
		description: "Ibai Llanos. Streamer, comentarista de esports y creador de contenido.",
		socialMedia: {
			twitter: "@IbaiLlanos",
			youtube: "Ibai",
			instagram: "@ibaillanos"
		}
	},
	{
		id: "5",
		username: "elmariana",
		displayName: "ElMariana",
		avatar: "",
		isLive: false,
		followers: 4200000,
		verified: true,
		description: "Streamer mexicano. Gaming, variedad y entretenimiento.",
		socialMedia: {
			twitter: "@ElMariana",
			youtube: "ElMariana",
			instagram: "@elmariana"
		}
	},
	{
		id: "6",
		username: "juansguarnizo",
		displayName: "JuansGuarnizo",
		avatar: "",
		isLive: true,
		followers: 6800000,
		verified: true,
		description: "Streamer colombiano. Variedad de contenido, gaming y entretenimiento.",
		socialMedia: {
			twitter: "@JuansGuarnizo",
			youtube: "JuansGuarnizo",
			instagram: "@juansguarnizo"
		}
	},
	{
		id: "7",
		username: "quackity",
		displayName: "Quackity",
		avatar: "",
		isLive: true,
		followers: 5900000,
		verified: true,
		description: "Streamer bilingüe. Minecraft, variedad y contenido creativo.",
		socialMedia: {
			twitter: "@Quackity",
			youtube: "Quackity",
			instagram: "@quackity"
		}
	},
	{
		id: "8",
		username: "spreen",
		displayName: "Spreen",
		avatar: "",
		isLive: false,
		followers: 3400000,
		verified: true,
		description: "Streamer argentino. Gaming, Minecraft y entretenimiento.",
		socialMedia: {
			twitter: "@SpreenDMC",
			youtube: "Spreen",
			instagram: "@spreen"
		}
	},
	{
		id: "9",
		username: "rivers_gg",
		displayName: "Rivers_gg",
		avatar: "",
		isLive: true,
		followers: 2800000,
		verified: true,
		description: "Streamer española. Variedad de juegos y contenido divertido.",
		socialMedia: {
			twitter: "@Rivers_gg",
			youtube: "Rivers",
			instagram: "@rivers_gg"
		}
	},
	{
		id: "10",
		username: "elded",
		displayName: "ElDed",
		avatar: "",
		isLive: true,
		followers: 1900000,
		verified: true,
		description: "Streamer mexicano. Gaming, reacciones y entretenimiento.",
		socialMedia: {
			twitter: "@ElDedLoL",
			youtube: "ElDed",
			instagram: "@elded"
		}
	}
];

// Streams activos actuales
export const ACTIVE_STREAMS: Stream[] = [
	{
		id: "stream1",
		streamerId: "1",
		title: "🔥 REACCIONES A VIDEOS RANDOM + DONACIONES 🔥",
		category: GAME_CATEGORIES.JUST_CHATTING,
		game: GAME_CATEGORIES.JUST_CHATTING,
		thumbnail: "",
		viewers: 45230,
		startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // Hace 2 horas
		language: "Español",
		tags: ["Español", "Reacciones", "Donaciones", "Entretenimiento"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream2",
		streamerId: "2",
		title: "MINECRAFT EXTREMO - CONSTRUYENDO LA BASE DEFINITIVA",
		category: GAME_CATEGORIES.MINECRAFT,
		game: GAME_CATEGORIES.MINECRAFT,
		thumbnail: "",
		viewers: 38750,
		startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // Hace 3 horas
		language: "Español",
		tags: ["Minecraft", "Construcción", "Supervivencia", "Español"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream3",
		streamerId: "3",
		title: "🎮 FORTNITE COMPETITIVO + VALORANT RANKED 🎮",
		category: GAME_CATEGORIES.FORTNITE,
		game: GAME_CATEGORIES.FORTNITE,
		thumbnail: "",
		viewers: 29840,
		startedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000), // Hace 1.5 horas
		language: "Español",
		tags: ["Fortnite", "Competitivo", "Valorant", "Gaming"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream4",
		streamerId: "4",
		title: "CHARLANDO CON LA COMUNIDAD - PREGUNTAS Y RESPUESTAS",
		category: GAME_CATEGORIES.JUST_CHATTING,
		game: GAME_CATEGORIES.JUST_CHATTING,
		thumbnail: "",
		viewers: 52180,
		startedAt: new Date(Date.now() - 45 * 60 * 1000), // Hace 45 minutos
		language: "Español",
		tags: ["Charla", "Q&A", "Comunidad", "Entretenimiento"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream5",
		streamerId: "6",
		title: "GTA V ROLEPLAY - AVENTURAS EN LOS SANTOS RP",
		category: GAME_CATEGORIES.GTAV,
		game: GAME_CATEGORIES.GTAV,
		thumbnail: "",
		viewers: 23670,
		startedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // Hace 4 horas
		language: "Español",
		tags: ["GTA V", "Roleplay", "RP", "Aventuras"],
		isRecording: true,
		isMature: true
	},
	{
		id: "stream6",
		streamerId: "7",
		title: "MINECRAFT BUILD BATTLE + MINI JUEGOS DIVERTIDOS",
		category: GAME_CATEGORIES.MINECRAFT,
		game: GAME_CATEGORIES.MINECRAFT,
		thumbnail: "",
		viewers: 31420,
		startedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000), // Hace 2.5 horas
		language: "Español/English",
		tags: ["Minecraft", "Build Battle", "Mini Juegos", "Bilingüe"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream7",
		streamerId: "9",
		title: "VALORANT RANKED - SUBIENDO A RADIANT 💎",
		category: GAME_CATEGORIES.VALORANT,
		game: GAME_CATEGORIES.VALORANT,
		thumbnail: "",
		viewers: 18950,
		startedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Hace 1 hora
		language: "Español",
		tags: ["Valorant", "Ranked", "Competitivo", "FPS"],
		isRecording: true,
		isMature: false
	},
	{
		id: "stream8",
		streamerId: "10",
		title: "LEAGUE OF LEGENDS SOLO QUEUE - ROAD TO CHALLENGER",
		category: GAME_CATEGORIES.LOL,
		game: GAME_CATEGORIES.LOL,
		thumbnail: "",
		viewers: 15680,
		startedAt: new Date(Date.now() - 3.5 * 60 * 60 * 1000), // Hace 3.5 horas
		language: "Español",
		tags: ["League of Legends", "Solo Queue", "Challenger", "MOBA"],
		isRecording: true,
		isMature: false
	}
];

// Función para combinar streams con información del streamer
export const getStreamsWithStreamers = (): StreamWithStreamer[] => {
	return ACTIVE_STREAMS.map(stream => {
		const streamer = STREAMERS.find(s => s.id === stream.streamerId);
		if (!streamer) {
			throw new Error(`Streamer not found for stream ${stream.id}`);
		}
		return {
			...stream,
			streamer
		};
	});
};

// Función para formatear el número de espectadores
export const formatViewers = (viewers: number): string => {
	if (viewers >= 1000000) {
		return `${(viewers / 1000000).toFixed(1)}M`;
	} else if (viewers >= 1000) {
		return `${(viewers / 1000).toFixed(1)}K`;
	}
	return viewers.toString();
};

// Función para calcular el tiempo de stream
export const getStreamDuration = (startedAt: Date): string => {
	const now = new Date();
	const diff = now.getTime() - startedAt.getTime();
	const hours = Math.floor(diff / (1000 * 60 * 60));
	const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
	
	if (hours > 0) {
		return `${hours}h ${minutes}m`;
	}
	return `${minutes}m`;
};
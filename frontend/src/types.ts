export type Anime = {
  id: number;
  title: string;
  description: string;
  author: string;
  rating: number;
  status: string;
  thumbnailUrl: string;
  startedAiring: string;
  finishedAiring: string | null;
  createdAt: string;
  updatedAt: string;
  genres: {
    id: number;
    name: string;
  }[];
};

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  profilePicture: string | null;
  roleId: number;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
  favoriteAnimes: Anime[]
};

export type EpisodeType = {
  id: number;
  seasonId: number;
  episodeNumber: number;
  title: string;
  length: number; // in milliseconds (e.g. 1440000 = 24 minutes)
  subUrl: string; // streaming URL (e.g. .m3u8)
  airedAt: string; // ISO date string
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

export type CommentType = {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number,
    username: string;
    profilePicture: string | null;
  };
};

export type Season = {
  id: number;
  animeId: number;
  seasonNumber: number;
  startedAiring: string; // ISO date string
  finishedAiring: string; // ISO date string
  isFinished: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
};

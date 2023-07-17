export const GAMEMODE_CLASSIC = 'CLASSIC' as const;
export const GAMEMODE_RANDOMBOUNCE = 'RANDOMBOUNCE' as const;

export type GameMode = 'CLASSIC' | 'RANDOMBOUNCE';

export const GAMETYPE_NORMAL = 'normal' as const;
export const GAMETYPE_LADDER = 'ladder' as const;

export type GameType = 'normal' | 'ladder';

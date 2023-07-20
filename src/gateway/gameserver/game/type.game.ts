export const GAMEMODE_CLASSIC = 'classic' as const;
export const GAMEMODE_RANDOMBOUNCE = 'randomBounce' as const;

export type GameMode = 'classic' | 'randomBounce';

export const GAMETYPE_NORMAL = 'normal' as const;
export const GAMETYPE_LADDER = 'ladder' as const;

export type GameType = 'normal' | 'ladder';

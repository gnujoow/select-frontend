export interface RidiSelectUserDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
}

export type PlatformType = 'mobile' | 'pc' | 'tablet' | 'paper' | 'ridi_app' | 'unknown';

export interface PlatformDTO {
  type: PlatformType;
  isPc: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isPaper: boolean;
  isPaperPro: boolean;
  isRidiApp: boolean;
}

export interface ConstantsDTO {
  BASE_URL_STORE: string;
  BASE_URL_RIDISELECT: string;
  BASE_URL_RIDI_PAY_API: string;
  BASE_URL_STATIC: string;
  FREE_PROMOTION_MONTHS: number;
};

export interface EnvironmentDTO {
  platform: PlatformDTO;
  constants: ConstantsDTO;
}

export type RidiSelectLoadEvent = CustomEvent<{
  targetElementId: string;
  dto: {
    environment: EnvironmentDTO;
  };
}>;

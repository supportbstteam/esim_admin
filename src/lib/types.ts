export enum DeviceOS {
  ANDROID = "ANDROID",
  IOS = "IOS",
  WINDOWS = "WINDOWS",
  OTHER = "OTHER",
}

export interface Device {
  id: number;
  brand: {
    id: number,
    name: string,
    isActive: boolean
  };
  model: string;
  os: DeviceOS;
  supportsEsim: boolean;
  notes?: string;
  isActive: boolean;
  name: string,
}

export interface DeviceQuery {
  page?: number;
  limit?: number;
  search?: string;
  os?: DeviceOS;
  active?: boolean;
}

export interface Brand {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean
}

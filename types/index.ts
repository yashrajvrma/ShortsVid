export type Language = {
  code: string;
  name: string;
  flag?: string;
};

export type VideoStyle = {
  id: number | string;
  name: string;
  thumbnail: string;
};

export interface Duration {
  id: number | string;
  value: number;
  label: string;
}

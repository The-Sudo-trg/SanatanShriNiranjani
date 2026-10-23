// Shared content shapes passed from the server layout into client shell components.
// Saint/Temple rows mirror prisma models (serializable subset).
export interface SaintRow {
  id: string;
  nameHi: string;
  pad: string;
  bioHi: string;
  originHi: string | null;
  memorial: boolean;
  verified: boolean;
  order: number;
}

export interface TempleRow {
  id: string;
  nameHi: string;
  distanceText: string;
  isAkhadaBranch: boolean;
}

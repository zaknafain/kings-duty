export class Terrain {
  label: string;
  weight: number;
  regionSizeMax: number;
  regionSizeMin: number;
}

export const terrainTypes: Array<Terrain> = [
  {
    label: 'grassland',
    weight: 4,
    regionSizeMax: 12,
    regionSizeMin: 5
  },
  {
    label: 'hills',
    weight: 3,
    regionSizeMax: 8,
    regionSizeMin: 2
  },
  {
    label: 'mountains',
    weight: 1,
    regionSizeMax: 8,
    regionSizeMin: 3
  },
  {
    label: 'plains',
    weight: 4,
    regionSizeMax: 10,
    regionSizeMin: 3
  },
  {
    label: 'sea',
    weight: 1,
    regionSizeMax: 100,
    regionSizeMin: 20
  },
  {
    label: 'swamp',
    weight: 2,
    regionSizeMax: 4,
    regionSizeMin: 1
  }
];

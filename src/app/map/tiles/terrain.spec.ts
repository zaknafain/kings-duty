import { Terrain, terrainTypes } from './terrain';

describe('Terrain', () => {
  it('should create an instance', () => {
    expect(new Terrain()).toBeTruthy();
  });
});

describe('terrainTypes', () => {
  it('should be an array of Terrain', () => {
    terrainTypes.forEach(terrain => {
      expect(terrain.label).toBeDefined();
      expect(terrain.regionSizeMax).toBeDefined();
      expect(terrain.regionSizeMin).toBeDefined();
      expect(terrain.weight).toBeDefined();
    });
  });

  it('should be an array of unique Terrains', () => {
    let label: string;

    terrainTypes.forEach(terrain => {
      label = terrain.label;
      expect(terrainTypes.filter(tt => tt.label === label).length).toBe(1);
    });
  });
});

export type Language = 'en' | 'ck' | 'ar';
export type ThemeMode = 'dark' | 'light';

export type SlopeDirection = 
  | 'North' 
  | 'South' 
  | 'East' 
  | 'West' 
  | 'North East' 
  | 'North West' 
  | 'South East' 
  | 'South West';

export type DesignSurfaceType = 
  | 'Flat' 
  | 'One-way Slope' 
  | 'Two-way Slope' 
  | 'Four-way Slope' 
  | 'Custom';

export type EarthworkMethod = 'Grid Method' | 'Average End Area';

export type ExistingGroundOption = 
  | 'Flat Ground' 
  | 'Sloped Ground'
  | 'Manual Grid Levels' 
  | 'Import File';

export interface ProjectInfo {
  projectName: string;
  client: string;
  surveyor: string;
  date: string;
  notes: string;
}

export interface InstrumentData {
  benchmarkRL: number;
  backSight: number;
  heightOfInstrument: number; // Benchmark RL + Back Sight
}

export interface SiteDimensions {
  length: number; // meters (X dimension)
  width: number;  // meters (Y dimension)
  unit: 'Meters' | 'Feet';
  gridSpacingX: number; // meters
  gridSpacingY: number; // meters
}

export interface OneWaySlopeConfig {
  mode?: 'startEnd' | 'startSlope';
  startElevation: number;
  endElevation: number;
  slopePercent?: number;
  direction: SlopeDirection;
}

export interface TwoWaySlopeConfig {
  baseElevation: number;
  slopeXPercent: number; // % slope along X (East)
  slopeYPercent: number; // % slope along Y (North)
}

export interface FourWaySlopeConfig {
  centerElevation: number;
  perimeterElevation: number;
}

export interface DesignSurfaceConfig {
  type: DesignSurfaceType;
  flatElevation: number;
  oneWaySlope: OneWaySlopeConfig;
  twoWaySlope: TwoWaySlopeConfig;
  fourWaySlope: FourWaySlopeConfig;
}

export interface GridPoint {
  id: string; // e.g., "A1"
  station: string; // e.g., "A1"
  row: number; // 0-indexed Y
  col: number; // 0-indexed X
  x: number; // Coordinate in meters
  y: number; // Coordinate in meters
  existingRL: number; // Existing ground elevation
  designRL: number; // Design surface elevation
  difference: number; // existingRL - designRL
  cut: number; // Math.max(0, existingRL - designRL)
  fill: number; // Math.max(0, designRL - existingRL)
  staffReading: number; // heightOfInstrument - designRL
  isCustomOverride?: boolean;
}

export interface EarthworkSummary {
  totalCutVolume: number; // m³
  totalFillVolume: number; // m³
  netVolume: number; // Cut - Fill (Positive = Surplus Cut, Negative = Deficit Fill)
  gridMethodCutVolume: number;
  gridMethodFillVolume: number;
  endAreaCutVolume: number;
  endAreaFillVolume: number;
  totalPoints: number;
  totalArea: number; // m²
  averageExistingRL: number;
  highestExistingRL: number;
  lowestExistingRL: number;
  averageDesignRL: number;
  highestDesignRL: number;
  lowestDesignRL: number;
  maximumCut: number;
  maximumFill: number;
  averageCut: number;
  averageFill: number;
}

export interface SurveyProject {
  id: string;
  updatedAt: string;
  info: ProjectInfo;
  instrument: InstrumentData;
  site: SiteDimensions;
  existingGroundOption: ExistingGroundOption;
  flatGroundRL: number;
  designSurface: DesignSurfaceConfig;
  gridPoints: GridPoint[];
  earthworkMethod: EarthworkMethod;
  contourInterval: number; // e.g., 0.5m
}

import {
  GridPoint,
  SiteDimensions,
  InstrumentData,
  DesignSurfaceConfig,
  EarthworkSummary,
  ExistingGroundOption,
  SurveyProject,
} from '../types/survey';

/**
 * Converts row index (0, 1, 2...) to spreadsheet letter notation (A, B, C... Z, AA, AB...)
 */
export function rowToLetter(row: number): string {
  let result = '';
  let r = row;
  while (r >= 0) {
    result = String.fromCharCode(65 + (r % 26)) + result;
    r = Math.floor(r / 26) - 1;
  }
  return result;
}

/**
 * Generates station name e.g. row 0, col 0 -> "A1"
 */
export function getStationName(row: number, col: number): string {
  return `${rowToLetter(row)}${col + 1}`;
}

/**
 * Calculate Design RL at coordinate (x, y) based on configuration
 */
export function calculateDesignRL(
  x: number,
  y: number,
  site: SiteDimensions,
  config: DesignSurfaceConfig
): number {
  const { type, flatElevation, oneWaySlope, twoWaySlope, fourWaySlope } = config;

  switch (type) {
    case 'Flat':
      return flatElevation;

    case 'One-way Slope': {
      const { mode = 'startEnd', startElevation, endElevation, slopePercent = 0, direction } = oneWaySlope;
      const L = site.length || 1;
      const W = site.width || 1;

      if (mode === 'startSlope') {
        let distance = 0;
        const sqrt2 = Math.SQRT2;
        switch (direction) {
          case 'North':
            distance = y;
            break;
          case 'South':
            distance = W - y;
            break;
          case 'East':
            distance = x;
            break;
          case 'West':
            distance = L - x;
            break;
          case 'North East':
            distance = (x + y) / sqrt2;
            break;
          case 'North West':
            distance = (L - x + y) / sqrt2;
            break;
          case 'South East':
            distance = (x + W - y) / sqrt2;
            break;
          case 'South West':
            distance = (L - x + W - y) / sqrt2;
            break;
        }
        return startElevation + (slopePercent / 100) * distance;
      }

      let ratio = 0;
      switch (direction) {
        case 'North':
          ratio = y / W;
          break;
        case 'South':
          ratio = (W - y) / W;
          break;
        case 'East':
          ratio = x / L;
          break;
        case 'West':
          ratio = (L - x) / L;
          break;
        case 'North East':
          ratio = (x + y) / (L + W);
          break;
        case 'North West':
          ratio = (L - x + y) / (L + W);
          break;
        case 'South East':
          ratio = (x + W - y) / (L + W);
          break;
        case 'South West':
          ratio = (L - x + W - y) / (L + W);
          break;
      }
      ratio = Math.max(0, Math.min(1, ratio));
      return startElevation + ratio * (endElevation - startElevation);
    }

    case 'Two-way Slope': {
      const { baseElevation, slopeXPercent, slopeYPercent } = twoWaySlope;
      const deltaX = (slopeXPercent / 100) * x;
      const deltaY = (slopeYPercent / 100) * y;
      return baseElevation + deltaX + deltaY;
    }

    case 'Four-way Slope': {
      const { centerElevation, perimeterElevation } = fourWaySlope;
      const cx = site.length / 2;
      const cy = site.width / 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      const maxDist = Math.sqrt(cx ** 2 + cy ** 2) || 1;
      const ratio = Math.min(1, dist / maxDist);
      return centerElevation + ratio * (perimeterElevation - centerElevation);
    }

    case 'Custom':
    default:
      return flatElevation;
  }
}

/**
 * Generate ground elevation for preset terrain profiles
 */
export function generateExistingRL(
  x: number,
  y: number,
  site: SiteDimensions,
  option: ExistingGroundOption,
  flatGroundRL: number
): number {
  if (option === 'Flat Ground') {
    return flatGroundRL;
  }
  if (option === 'Sloped Ground') {
    // Gentle natural undulating ground with small slope and ripples
    const lx = x / (site.length || 1);
    const ly = y / (site.width || 1);
    const slopeEffect = lx * 1.8 + ly * 1.2;
    const ripple = Math.sin(lx * Math.PI * 2) * 0.35 + Math.cos(ly * Math.PI * 3) * 0.25;
    return Number((flatGroundRL + slopeEffect + ripple).toFixed(3));
  }
  return flatGroundRL;
}

/**
 * Recalculates all grid points and earthwork volumes for a project
 */
export function computeGridAndVolumes(
  site: SiteDimensions,
  instrument: InstrumentData,
  groundOption: ExistingGroundOption,
  flatGroundRL: number,
  designConfig: DesignSurfaceConfig,
  existingPointsOverride?: Map<string, number>
): { points: GridPoint[]; summary: EarthworkSummary } {
  const spacingX = Math.max(0.5, site.gridSpacingX || 5);
  const spacingY = Math.max(0.5, site.gridSpacingY || 5);

  const cols = Math.floor(site.length / spacingX) + 1;
  const rows = Math.floor(site.width / spacingY) + 1;

  const heightOfInst = instrument.benchmarkRL + instrument.backSight;
  const points: GridPoint[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = Math.min(site.length, c * spacingX);
      const y = Math.min(site.width, r * spacingY);
      const station = getStationName(r, c);

      let existingRL = generateExistingRL(x, y, site, groundOption, flatGroundRL);
      if (existingPointsOverride && existingPointsOverride.has(station)) {
        existingRL = existingPointsOverride.get(station)!;
      }

      const designRL = calculateDesignRL(x, y, site, designConfig);
      const diff = Number((existingRL - designRL).toFixed(3));
      const cut = diff > 0 ? diff : 0;
      const fill = diff < 0 ? Math.abs(diff) : 0;
      const staffReading = Number((heightOfInst - designRL).toFixed(3));

      points.push({
        id: station,
        station,
        row: r,
        col: c,
        x,
        y,
        existingRL,
        designRL: Number(designRL.toFixed(3)),
        difference: diff,
        cut: Number(cut.toFixed(3)),
        fill: Number(fill.toFixed(3)),
        staffReading,
        isCustomOverride: existingPointsOverride?.has(station) ?? false,
      });
    }
  }

  // Calculate Earthwork Volumes (Grid Prismoidal & Average End Area)
  let gridCutVol = 0;
  let gridFillVol = 0;

  const cellArea = spacingX * spacingY;

  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols - 1; c++) {
      const idxA = r * cols + c;
      const idxB = r * cols + (c + 1);
      const idxC = (r + 1) * cols + c;
      const idxD = (r + 1) * cols + (c + 1);

      const pA = points[idxA];
      const pB = points[idxB];
      const pC = points[idxC];
      const pD = points[idxD];

      if (pA && pB && pC && pD) {
        const avgCut = (pA.cut + pB.cut + pC.cut + pD.cut) / 4;
        const avgFill = (pA.fill + pB.fill + pC.fill + pD.fill) / 4;

        gridCutVol += cellArea * avgCut;
        gridFillVol += cellArea * avgFill;
      }
    }
  }

  // Average End Area calculation along X rows
  let endAreaCutVol = 0;
  let endAreaFillVol = 0;

  for (let r = 0; r < rows - 1; r++) {
    let rowCutArea1 = 0;
    let rowFillArea1 = 0;
    let rowCutArea2 = 0;
    let rowFillArea2 = 0;

    for (let c = 0; c < cols - 1; c++) {
      const p1 = points[r * cols + c];
      const p2 = points[r * cols + (c + 1)];
      const p3 = points[(r + 1) * cols + c];
      const p4 = points[(r + 1) * cols + (c + 1)];

      rowCutArea1 += ((p1.cut + p2.cut) / 2) * spacingX;
      rowFillArea1 += ((p1.fill + p2.fill) / 2) * spacingX;

      rowCutArea2 += ((p3.cut + p4.cut) / 2) * spacingX;
      rowFillArea2 += ((p3.fill + p4.fill) / 2) * spacingX;
    }

    endAreaCutVol += ((rowCutArea1 + rowCutArea2) / 2) * spacingY;
    endAreaFillVol += ((rowFillArea1 + rowFillArea2) / 2) * spacingY;
  }

  // Statistics
  const existingRLs = points.map((p) => p.existingRL);
  const designRLs = points.map((p) => p.designRL);
  const cuts = points.map((p) => p.cut);
  const fills = points.map((p) => p.fill);

  const highestExisting = Math.max(...existingRLs);
  const lowestExisting = Math.min(...existingRLs);
  const avgExisting = existingRLs.reduce((a, b) => a + b, 0) / (points.length || 1);

  const highestDesign = Math.max(...designRLs);
  const lowestDesign = Math.min(...designRLs);
  const avgDesign = designRLs.reduce((a, b) => a + b, 0) / (points.length || 1);

  const maxCut = Math.max(...cuts);
  const maxFill = Math.max(...fills);
  const avgCut = cuts.reduce((a, b) => a + b, 0) / (points.length || 1);
  const avgFill = fills.reduce((a, b) => a + b, 0) / (points.length || 1);

  const totalCutVolume = Number(gridCutVol.toFixed(2));
  const totalFillVolume = Number(gridFillVol.toFixed(2));
  const netVolume = Number((totalCutVolume - totalFillVolume).toFixed(2));

  const summary: EarthworkSummary = {
    totalCutVolume,
    totalFillVolume,
    netVolume,
    gridMethodCutVolume: totalCutVolume,
    gridMethodFillVolume: totalFillVolume,
    endAreaCutVolume: Number(endAreaCutVol.toFixed(2)),
    endAreaFillVolume: Number(endAreaFillVol.toFixed(2)),
    totalPoints: points.length,
    totalArea: site.length * site.width,
    averageExistingRL: Number(avgExisting.toFixed(3)),
    highestExistingRL: Number(highestExisting.toFixed(3)),
    lowestExistingRL: Number(lowestExisting.toFixed(3)),
    averageDesignRL: Number(avgDesign.toFixed(3)),
    highestDesignRL: Number(highestDesign.toFixed(3)),
    lowestDesignRL: Number(lowestDesign.toFixed(3)),
    maximumCut: Number(maxCut.toFixed(3)),
    maximumFill: Number(maxFill.toFixed(3)),
    averageCut: Number(avgCut.toFixed(3)),
    averageFill: Number(avgFill.toFixed(3)),
  };

  return { points, summary };
}

/**
 * Creates default sample project presets
 */
export function createDefaultProject(presetName?: string): SurveyProject {
  const now = new Date().toISOString().split('T')[0];

  let site: SiteDimensions = {
    length: 40,
    width: 30,
    unit: 'Meters',
    gridSpacingX: 5,
    gridSpacingY: 5,
  };

  let groundOption: ExistingGroundOption = 'Sloped Ground';
  let flatGroundRL = 100.0;
  let designSurface: DesignSurfaceConfig = {
    type: 'One-way Slope',
    flatElevation: 100.0,
    oneWaySlope: {
      startElevation: 99.5,
      endElevation: 101.0,
      direction: 'East',
    },
    twoWaySlope: {
      baseElevation: 100.0,
      slopeXPercent: 1.5,
      slopeYPercent: 1.0,
    },
    fourWaySlope: {
      centerElevation: 101.5,
      perimeterElevation: 99.8,
    },
  };

  if (presetName === 'Building Pad') {
    site = { length: 50, width: 30, unit: 'Meters', gridSpacingX: 5, gridSpacingY: 5 };
    groundOption = 'Sloped Ground';
    designSurface.type = 'Flat';
    designSurface.flatElevation = 101.0;
  } else if (presetName === 'Parking Lot') {
    site = { length: 100, width: 60, unit: 'Meters', gridSpacingX: 10, gridSpacingY: 10 };
    groundOption = 'Sloped Ground';
    designSurface.type = 'One-way Slope';
    designSurface.oneWaySlope = { startElevation: 102.0, endElevation: 100.5, direction: 'South East' };
  } else if (presetName === 'Road Section') {
    site = { length: 80, width: 20, unit: 'Meters', gridSpacingX: 5, gridSpacingY: 2 };
    groundOption = 'Sloped Ground';
    designSurface.type = 'Two-way Slope';
    designSurface.twoWaySlope = { baseElevation: 100.0, slopeXPercent: 2.0, slopeYPercent: 0.5 };
  }

  const instrument: InstrumentData = {
    benchmarkRL: 100.0,
    backSight: 1.45,
    heightOfInstrument: 101.45,
  };

  const { points } = computeGridAndVolumes(site, instrument, groundOption, flatGroundRL, designSurface);

  return {
    id: `proj_${Date.now()}`,
    updatedAt: now,
    info: {
      projectName: presetName ? `${presetName} Site` : 'Construction Site Alpha',
      client: 'Kamyar Engineering Consultants',
      surveyor: 'Eng. Kamyar Surveying',
      date: now,
      notes: 'Initial topographic grid survey and earthwork cut/fill estimation.',
    },
    instrument,
    site,
    existingGroundOption: groundOption,
    flatGroundRL,
    designSurface,
    gridPoints: points,
    earthworkMethod: 'Grid Method',
    contourInterval: 0.5,
  };
}

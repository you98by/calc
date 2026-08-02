import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { SurveyProject } from '../types/survey';
import { TranslationDictionary } from './translations';
import { computeGridAndVolumes } from './calculatorEngine';

/**
 * Export project details and station table to PDF report
 */
export function exportToPDF(project: SurveyProject, t: TranslationDictionary) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const { info, instrument, site, earthworkMethod } = project;
  const { summary } = computeGridAndVolumes(
    site,
    instrument,
    project.existingGroundOption,
    project.flatGroundRL,
    project.designSurface
  );

  // Header Banner
  doc.setFillColor(16, 91, 72); // #105b48 (Primary Emerald)
  doc.rect(0, 0, 210, 24, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(t.appTitle.toUpperCase(), 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('PROFESSIONAL SURVEY ENGINEERING REPORT', 14, 18);

  doc.setTextColor(150, 255, 220);
  doc.text(`Date: ${info.date || new Date().toISOString().split('T')[0]}`, 160, 15);

  // Project Info Card
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('PROJECT INFORMATION', 14, 32);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Project Name: ${info.projectName || 'N/A'}`, 14, 38);
  doc.text(`Client: ${info.client || 'N/A'}`, 14, 43);
  doc.text(`Surveyor / Engineer: ${info.surveyor || 'N/A'}`, 14, 48);

  doc.text(`Site Dimensions: ${site.length}m x ${site.width}m (${summary.totalArea} m²)`, 110, 38);
  doc.text(`Grid Spacing: ${site.gridSpacingX}m x ${site.gridSpacingY}m`, 110, 43);
  doc.text(`Total Grid Stations: ${summary.totalPoints}`, 110, 48);

  // Instrument Setup Card
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(14, 53, 182, 18, 2, 2, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 91, 72);
  doc.text('INSTRUMENT LEVELING SETUP (HI):', 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(30, 41, 59);
  doc.text(`Benchmark RL = ${instrument.benchmarkRL.toFixed(3)} m`, 18, 66);
  doc.text(`Back Sight (BS) = ${instrument.backSight.toFixed(3)} m`, 80, 66);
  doc.setFont('helvetica', 'bold');
  doc.text(`Height of Instrument (HI) = ${instrument.heightOfInstrument.toFixed(3)} m`, 140, 66);

  // Earthwork Volume Summary Box
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(14, 75, 182, 28, 2, 2, 'F');

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 91, 72);
  doc.text(`EARTHWORK VOLUME SUMMARY (${earthworkMethod})`, 18, 83);

  doc.setFontSize(10);
  doc.setTextColor(220, 38, 38); // Cut Red
  doc.text(`Total Cut Volume: ${summary.totalCutVolume.toLocaleString()} m³`, 18, 91);

  doc.setTextColor(16, 185, 129); // Fill Green
  doc.text(`Total Fill Volume: ${summary.totalFillVolume.toLocaleString()} m³`, 85, 91);

  doc.setTextColor(30, 41, 59);
  const netText = summary.netVolume >= 0 ? `Surplus Cut: +${summary.netVolume} m³` : `Deficit Fill: ${summary.netVolume} m³`;
  doc.text(`Net Balance: ${netText}`, 150, 91);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Max Cut: ${summary.maximumCut}m | Max Fill: ${summary.maximumFill}m | Avg Existing RL: ${summary.averageExistingRL}m`, 18, 97);

  // Data Table of Grid Stations
  const tableData = project.gridPoints.map((p) => [
    p.station,
    p.x.toFixed(1),
    p.y.toFixed(1),
    p.existingRL.toFixed(3),
    p.designRL.toFixed(3),
    p.difference.toFixed(3),
    p.cut > 0 ? p.cut.toFixed(3) : '-',
    p.fill > 0 ? p.fill.toFixed(3) : '-',
    p.staffReading.toFixed(3),
  ]);

  autoTable(doc, {
    startY: 108,
    head: [[
      t.station,
      'X (m)',
      'Y (m)',
      t.existingElevation,
      t.designElevation,
      t.difference,
      t.cut,
      t.fill,
      t.staffReading,
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 91, 72],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center',
    },
    columnStyles: {
      0: { fontStyle: 'bold' },
      5: { fontStyle: 'bold' },
    },
    didParseCell: (data) => {
      if (data.section === 'body') {
        if (data.column.index === 6 && data.cell.raw !== '-') {
          data.cell.styles.textColor = [185, 28, 28]; // Cut Red
          data.cell.styles.fontStyle = 'bold';
        } else if (data.column.index === 7 && data.cell.raw !== '-') {
          data.cell.styles.textColor = [4, 120, 87]; // Fill Green
          data.cell.styles.fontStyle = 'bold';
        }
      }
    },
  });

  // Footer page numbers
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Kamyar Grid Calculator - Page ${i} of ${totalPages}`,
      105,
      290,
      { align: 'center' }
    );
  }

  doc.save(`${info.projectName || 'Survey_Grid'}_Leveling_Report.pdf`);
}

/**
 * Export project details and grid data to Excel spreadsheet (.xlsx)
 */
export function exportToExcel(project: SurveyProject, t: TranslationDictionary) {
  const wb = XLSX.utils.book_new();

  // Summary Sheet
  const { summary } = computeGridAndVolumes(
    project.site,
    project.instrument,
    project.existingGroundOption,
    project.flatGroundRL,
    project.designSurface
  );

  const summaryData = [
    ['Kamyar Grid Calculator - Survey Engineering Report'],
    ['Date', project.info.date || new Date().toISOString().split('T')[0]],
    ['Project Name', project.info.projectName],
    ['Client', project.info.client],
    ['Surveyor / Engineer', project.info.surveyor],
    ['Notes', project.info.notes],
    [],
    ['INSTRUMENT LEVELING SETUP'],
    ['Benchmark RL (m)', project.instrument.benchmarkRL],
    ['Back Sight BS (m)', project.instrument.backSight],
    ['Height of Instrument HI (m)', project.instrument.heightOfInstrument],
    [],
    ['SITE & GRID SPECIFICATIONS'],
    ['Site Length (m)', project.site.length],
    ['Site Width (m)', project.site.width],
    ['Total Area (m²)', summary.totalArea],
    ['Grid Spacing X (m)', project.site.gridSpacingX],
    ['Grid Spacing Y (m)', project.site.gridSpacingY],
    ['Total Grid Stations', summary.totalPoints],
    [],
    ['EARTHWORK VOLUME CALCULATIONS'],
    ['Calculation Method', project.earthworkMethod],
    ['Total Cut Volume (m³)', summary.totalCutVolume],
    ['Total Fill Volume (m³)', summary.totalFillVolume],
    ['Net Volume (m³)', summary.netVolume],
    ['Highest Existing RL (m)', summary.highestExistingRL],
    ['Lowest Existing RL (m)', summary.lowestExistingRL],
    ['Maximum Cut Depth (m)', summary.maximumCut],
    ['Maximum Fill Depth (m)', summary.maximumFill],
  ];

  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Project Summary');

  // Station Grid Sheet
  const gridRows = project.gridPoints.map((p) => ({
    [t.station]: p.station,
    'X (m)': p.x,
    'Y (m)': p.y,
    [t.existingElevation]: p.existingRL,
    [t.designElevation]: p.designRL,
    [t.difference]: p.difference,
    [t.cut]: p.cut,
    [t.fill]: p.fill,
    [t.staffReading]: p.staffReading,
  }));

  const wsGrid = XLSX.utils.json_to_sheet(gridRows);
  XLSX.utils.book_append_sheet(wb, wsGrid, 'Station Grid Data');

  const fileName = `${project.info.projectName || 'Survey_Grid'}_Data.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Export full project state as JSON file
 */
export function exportToJSON(project: SurveyProject) {
  const jsonStr = JSON.stringify(project, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.info.projectName || 'Survey_Grid'}_Project.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Parses imported CSV text into a map of Station/Coordinate -> Existing RL
 */
export function parseCSVLevels(csvText: string): Map<string, number> {
  const levelMap = new Map<string, number>();
  const lines = csvText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.toLowerCase().startsWith('station')) {
      continue;
    }
    const parts = trimmed.split(/[,;\t]/);
    if (parts.length >= 2) {
      const station = parts[0].trim().toUpperCase();
      const val = parseFloat(parts[1].trim());
      if (station && !isNaN(val)) {
        levelMap.set(station, val);
      }
    }
  }
  return levelMap;
}

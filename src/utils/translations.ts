import { Language } from '../types/survey';

export interface TranslationDictionary {
  appTitle: string;
  subtitle: string;
  home: string;
  calculator: string;
  dashboard: string;
  newProject: string;
  openProject: string;
  recentProjects: string;
  settings: string;
  darkMode: string;
  lightMode: string;
  language: string;

  // Project Info
  projectInfo: string;
  projectName: string;
  client: string;
  surveyor: string;
  date: string;
  notes: string;
  projectInfoDesc: string;

  // Instrument Leveling
  instrumentLeveling: string;
  benchmarkRL: string;
  backSight: string;
  heightOfInstrument: string;
  benchmarkRLTooltip: string;
  backSightTooltip: string;
  hiFormula: string;

  // Site Setup
  siteDimensions: string;
  length: string;
  width: string;
  unit: string;
  gridSpacing: string;
  customSpacing: string;
  totalArea: string;
  gridPointsCount: string;

  // Existing Ground
  existingGround: string;
  flatGround: string;
  slopedGround: string;
  manualGridLevels: string;
  importFile: string;
  flatGroundRL: string;
  generateTerrain: string;

  // Design Surface
  designSurface: string;
  surfaceType: string;
  flatSurface: string;
  oneWaySlope: string;
  twoWaySlope: string;
  fourWaySlope: string;
  customSurface: string;
  startElevation: string;
  endElevation: string;
  slopePercent: string;
  oneWayMode: string;
  startEndElevations: string;
  startElevationWithSlope: string;
  calculatedEndElevation: string;
  slopeDirection: string;
  slopeX: string;
  slopeY: string;
  centerElevation: string;
  perimeterElevation: string;

  // Directions
  north: string;
  south: string;
  east: string;
  west: string;
  northEast: string;
  northWest: string;
  southEast: string;
  southWest: string;

  // Visualizer Tabs
  view2DGrid: string;
  view3DSurface: string;
  viewContourMap: string;
  viewDataTable: string;
  viewAnalytics: string;

  // 2D Grid Layer Controls
  showGridLines: string;
  showCoordinates: string;
  showStationLabels: string;
  heatMap: string;
  cutColor: string;
  fillColor: string;
  zeroColor: string;
  zoomIn: string;
  zoomOut: string;
  resetView: string;

  // Table Columns
  station: string;
  coordX: string;
  coordY: string;
  existingElevation: string;
  designElevation: string;
  difference: string;
  cut: string;
  fill: string;
  staffReading: string;

  // Statistics & Volume
  earthworkVolume: string;
  cutVolume: string;
  fillVolume: string;
  netVolume: string;
  surplusCut: string;
  deficitFill: string;
  balanced: string;
  gridMethod: string;
  averageEndArea: string;
  highestExisting: string;
  lowestExisting: string;
  highestDesign: string;
  lowestDesign: string;
  averageRL: string;
  maximumCut: string;
  maximumFill: string;
  averageCut: string;
  averageFill: string;

  // Actions & Exports
  exportPDF: string;
  exportExcel: string;
  exportJSON: string;
  printReport: string;
  saveProject: string;
  quickSave: string;
  saved: string;
  pointDetails: string;
  editPoint: string;
  importCSVExcel: string;

  // Presets & Demos
  presetBuildingPad: string;
  presetParkingLot: string;
  presetTerracedSite: string;
  presetRoadSection: string;

  // Modals & General
  cancel: string;
  apply: string;
  close: string;
  searchStation: string;
  filterAll: string;
  filterCutOnly: string;
  filterFillOnly: string;
  filterBalancedOnly: string;
  contourInterval: string;
  solidMesh: string;
  wireframeMesh: string;
}

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    appTitle: 'Kamyar Grid Calculator',
    subtitle: 'Professional Survey Engineering Web Application',
    home: 'Home',
    calculator: 'Grid Calculator',
    dashboard: 'Dashboard',
    newProject: 'New Project',
    openProject: 'Open Project',
    recentProjects: 'Recent Projects',
    settings: 'Settings',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    language: 'Language',

    projectInfo: 'Project Information',
    projectName: 'Project Name',
    client: 'Client',
    surveyor: 'Surveyor / Engineer',
    date: 'Survey Date',
    notes: 'Project Notes',
    projectInfoDesc: 'Specify project details for leveling reports and field documentation.',

    instrumentLeveling: 'Instrument Setup (HI)',
    benchmarkRL: 'Benchmark RL (m)',
    backSight: 'Back Sight BS (m)',
    heightOfInstrument: 'Height of Instrument (HI)',
    benchmarkRLTooltip: 'Known reduced level of reference benchmark point.',
    backSightTooltip: 'Staff reading taken on the benchmark point.',
    hiFormula: 'HI = Benchmark RL + Back Sight',

    siteDimensions: 'Site Dimensions & Grid Spacing',
    length: 'Site Length (X - meters)',
    width: 'Site Width (Y - meters)',
    unit: 'Units',
    gridSpacing: 'Grid Spacing (m)',
    customSpacing: 'Custom Spacing',
    totalArea: 'Total Area',
    gridPointsCount: 'Total Grid Stations',

    existingGround: 'Existing Ground Surface',
    flatGround: 'Flat Base Elevation',
    slopedGround: 'Sloped Terrain Preset',
    manualGridLevels: 'Manual Elevation Input',
    importFile: 'Import CSV / Excel Data',
    flatGroundRL: 'Base Elevation RL (m)',
    generateTerrain: 'Generate Terrain Profile',

    designSurface: 'Design Target Surface',
    surfaceType: 'Design Surface Type',
    flatSurface: 'Flat Level Surface',
    oneWaySlope: 'One-Way Slope',
    twoWaySlope: 'Two-Way Cross Slope',
    fourWaySlope: 'Four-Way Crown Slope',
    customSurface: 'Custom Point Overrides',
    startElevation: 'Start Elevation (m)',
    endElevation: 'End Elevation (m)',
    slopePercent: 'Slope (%)',
    oneWayMode: 'Input Method',
    startEndElevations: 'Start & End Elevation',
    startElevationWithSlope: 'Start Elevation + Slope (%)',
    calculatedEndElevation: 'Calculated End RL',
    slopeDirection: 'Slope Direction',
    slopeX: 'X Slope (%)',
    slopeY: 'Y Slope (%)',
    centerElevation: 'Center/Crown RL (m)',
    perimeterElevation: 'Perimeter Boundary RL (m)',

    north: 'North (+Y)',
    south: 'South (-Y)',
    east: 'East (+X)',
    west: 'West (-X)',
    northEast: 'North-East',
    northWest: 'North-West',
    southEast: 'South-East',
    southWest: 'South-West',

    view2DGrid: '2D Graphic Grid',
    view3DSurface: '3D Surface Model',
    viewContourMap: 'Contour Lines',
    viewDataTable: 'Station Data Table',
    viewAnalytics: 'Earthwork Analytics',

    showGridLines: 'Grid Lines',
    showCoordinates: 'Coordinates (X, Y)',
    showStationLabels: 'Station Names',
    heatMap: 'Cut / Fill Heatmap',
    cutColor: 'Cut (Red)',
    fillColor: 'Fill (Green)',
    zeroColor: 'Balance (Gray)',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetView: 'Reset View',

    station: 'Station',
    coordX: 'X (m)',
    coordY: 'Y (m)',
    existingElevation: 'Existing RL (m)',
    designElevation: 'Design RL (m)',
    difference: 'Diff (m)',
    cut: 'Cut (m)',
    fill: 'Fill (m)',
    staffReading: 'Staff Reading (m)',

    earthworkVolume: 'Earthwork Cut & Fill Volume',
    cutVolume: 'Total Cut Volume',
    fillVolume: 'Total Fill Volume',
    netVolume: 'Net Volume Balance',
    surplusCut: 'Surplus Excavation (Export Cut)',
    deficitFill: 'Deficit Material (Import Fill)',
    balanced: 'Perfectly Balanced Site',
    gridMethod: 'Grid Method (Prismoidal)',
    averageEndArea: 'Average End Area Method',
    highestExisting: 'Highest Existing RL',
    lowestExisting: 'Lowest Existing RL',
    highestDesign: 'Highest Design RL',
    lowestDesign: 'Lowest Design RL',
    averageRL: 'Average Site Elevation',
    maximumCut: 'Maximum Cut Depth',
    maximumFill: 'Maximum Fill Depth',
    averageCut: 'Average Cut Depth',
    averageFill: 'Average Fill Depth',

    exportPDF: 'Export PDF Report',
    exportExcel: 'Export Excel Spreadsheet',
    exportJSON: 'Export JSON Project',
    printReport: 'Print Field Report',
    saveProject: 'Save Project',
    quickSave: 'Autosaved',
    saved: 'Saved to Local Database',
    pointDetails: 'Station Point Details',
    editPoint: 'Edit Station Elevation',
    importCSVExcel: 'Import CSV / Excel File',

    presetBuildingPad: 'Building Pad (50m x 30m)',
    presetParkingLot: 'Sloped Parking Lot (100m x 60m)',
    presetTerracedSite: 'Terraced Site (40m x 40m)',
    presetRoadSection: 'Road Subgrade (80m x 20m)',

    cancel: 'Cancel',
    apply: 'Apply Changes',
    close: 'Close',
    searchStation: 'Search station (e.g. A1, B3)...',
    filterAll: 'All Stations',
    filterCutOnly: 'Cut Points Only',
    filterFillOnly: 'Fill Points Only',
    filterBalancedOnly: 'Zero Difference',
    contourInterval: 'Contour Interval (m)',
    solidMesh: 'Solid Surface',
    wireframeMesh: 'Wireframe View',
  },
  ck: {
    appTitle: 'حاسبەی تۆپۆگرافی ڕووبەر - کامیار',
    subtitle: 'نەرمەکاڵای پیشەیی ئەندازیاری ڕووپێوی (سێڕڤەیینگ)',
    home: 'سەرەتا',
    calculator: 'حاسبەی گرید',
    dashboard: 'داشبۆرد',
    newProject: 'پڕۆژەی نوێ',
    openProject: 'کردنەوەی پڕۆژە',
    recentProjects: 'پڕۆژە دواهەمینەکان',
    settings: 'ڕێکخستنەکان',
    darkMode: 'دۆخی تاریک',
    lightMode: 'دۆخی ڕووناک',
    language: 'زمان',

    projectInfo: 'زانیارییەکانی پڕۆژە',
    projectName: 'ناوی پڕۆژە',
    client: 'خاوەن کار / کلاینت',
    surveyor: 'ئەندازیاری ڕووپێو',
    date: 'بەرواری ڕووپێوی',
    notes: 'تێبینییەکان',
    projectInfoDesc: 'تۆمارکردنی زانیاری پڕۆژە بۆ ڕاپۆرتی لێڤڵینگ و بەڵگەنامەکان.',

    instrumentLeveling: 'ڕێکخستنی ئامێری لێڤڵ (HI)',
    benchmarkRL: 'منسوبی خاڵی بنچینە Benchmark RL (m)',
    backSight: 'خوێندنەوەی پاشەوە BS (m)',
    heightOfInstrument: 'بەرزی ئامێر Height of Instrument (HI)',
    benchmarkRLTooltip: 'منسوبی زانراوی خاڵی مەرجەع (بەنچ مارک).',
    backSightTooltip: 'خوێندنەوەی شاخس لەسەر خاڵی بەنچ مارک.',
    hiFormula: 'HI = Benchmark RL + Back Sight',

    siteDimensions: 'دوورییەکانی زەوی و دووری گرید',
    length: 'درێژی زەوی (X - مەتر)',
    width: 'پانی زەوی (Y - مەتر)',
    unit: 'یەکەکان',
    gridSpacing: 'دووری نێوان گریدەکان (m)',
    customSpacing: 'دووری تایبەت',
    totalArea: 'ڕووبەری گشتی',
    gridPointsCount: 'ژمارەی وێستگەکانی گرید',

    existingGround: 'منسوبی زەوی سروشتی (مەوجود)',
    flatGround: 'زەوی تەخت',
    slopedGround: 'زەوی لێژ (پیشفەرز)',
    manualGridLevels: 'داخڵکردنی دەستی منسوبەکان',
    importFile: 'هێنانی فایلی CSV / Excel',
    flatGroundRL: 'منسوبی زەوی سەرەتایی (m)',
    generateTerrain: 'دروستکردنی تۆپۆگرافی زەوی',

    designSurface: 'ئاستی دیزاینکراو (دیزاین RL)',
    surfaceType: 'جۆری ڕووبەری دیزاین',
    flatSurface: 'ڕووبەری تەخت',
    oneWaySlope: 'لێژی یەک ئاڕاستە',
    twoWaySlope: 'لێژی دوو ئاڕاستە',
    fourWaySlope: 'لێژی چوار ئاڕاستە (تاجی/تەپۆڵکەیی)',
    customSurface: 'دەستکاری تایبەت بۆ هەر خاڵێک',
    startElevation: 'منسوبی دەستپێک (m)',
    endElevation: 'منسوبی کۆتایی (m)',
    slopePercent: 'ڕێژەی لێژی Slope (%)',
    oneWayMode: 'شێوازی داخڵکردنی لێژی',
    startEndElevations: 'منسوبی دەستپێک و کۆتایی',
    startElevationWithSlope: 'منسوبی دەستپێک + لێژی (%)',
    calculatedEndElevation: 'منسوبی کۆتایی ئەژمارکراو',
    slopeDirection: 'ئاڕاستەی لێژی',
    slopeX: 'لێژی تەوەرەی X (%)',
    slopeY: 'لێژی تەوەرەی Y (%)',
    centerElevation: 'منسوبی سەنتەر/تاج (m)',
    perimeterElevation: 'منسوبی سنوورەکان (m)',

    north: 'باکوور (+Y)',
    south: 'باشوور (-Y)',
    east: 'ڕۆژهەڵات (+X)',
    west: 'ڕۆژئاوا (-X)',
    northEast: 'باکووری ڕۆژهەڵات',
    northWest: 'باکووری ڕۆژئاوا',
    southEast: 'باشووری ڕۆژهەڵات',
    southWest: 'باشووری ڕۆژئاوا',

    view2DGrid: 'تۆڕی 2D گرافیکی',
    view3DSurface: 'مودێلی 3D ڕووبەر',
    viewContourMap: 'هێڵەکانی کۆنتۆر',
    viewDataTable: 'خشتەی وێستگەکان',
    viewAnalytics: 'پێوانە و قەبارەی زەوی',

    showGridLines: 'هێڵەکانی گرید',
    showCoordinates: 'پۆتانەکان (X, Y)',
    showStationLabels: 'ناوی وێستگەکان',
    heatMap: 'نەخشەی گەرمی بڕین/پڕکردنەوە',
    cutColor: 'بڕین Cut (سور)',
    fillColor: 'پڕکردنەوە Fill (سەوز)',
    zeroColor: 'هاوسەنگ (ڕەقەیی)',
    zoomIn: 'گەورەکردن',
    zoomOut: 'بچووککردنەوە',
    resetView: 'ڕێکخستنەوەی بینین',

    station: 'وێستگە',
    coordX: 'X (m)',
    coordY: 'Y (m)',
    existingElevation: 'منسوبی مەوجود (m)',
    designElevation: 'منسوبی دیزاین (m)',
    difference: 'جیاوازی (m)',
    cut: 'بڕین Cut (m)',
    fill: 'پڕکردنەوە Fill (m)',
    staffReading: 'خوێندنەوەی شاخس (m)',

    earthworkVolume: 'قەبارەی بڕین و پڕکردنەوەی خاك',
    cutVolume: 'قەبارەی گشتی بڕین (Cut)',
    fillVolume: 'قەبارەی گشتی پڕکردنەوە (Fill)',
    netVolume: 'هاوسەنگی قەبارەی پاکی',
    surplusCut: 'زیادەی بڕین (پێویست بە گوێستنەوە بۆ دەرەوە)',
    deficitFill: 'کەمی خاک (پێویست بە هێنانی خاک)',
    balanced: 'زەوی لە هاوسەنگی تەواودایە',
    gridMethod: 'ڕێگەی گرید (Grid Method)',
    averageEndArea: 'ڕێگەی ڕووبەری کۆتایی (Average End Area)',
    highestExisting: 'بەرزترین منسوبی مەوجود',
    lowestExisting: 'نزمترین منسوبی مەوجود',
    highestDesign: 'بەرزترین منسوبی دیزاین',
    lowestDesign: 'نزمترین منسوبی دیزاین',
    averageRL: 'تێکڕای منسوبی زەوی',
    maximumCut: 'زیاترین قووڵیی بڕین',
    maximumFill: 'زیاترین بەرزیی پڕکردنەوە',
    averageCut: 'تێکڕای قووڵیی بڕین',
    averageFill: 'تێکڕای بەرزیی پڕکردنەوە',

    exportPDF: 'دەرهێنانی ڕاپۆرتی PDF',
    exportExcel: 'دەرهێنانی فایلی Excel',
    exportJSON: 'دەرهێنانی فایلی پڕۆژە JSON',
    printReport: 'چاپکردنی ڕاپۆرت',
    saveProject: 'پاشەکەوتکردن',
    quickSave: 'پاشەکەوتکراوە',
    saved: 'پاشەکەوتکرا لە داتابەیس',
    pointDetails: 'وردەکاری خاڵی گرید',
    editPoint: 'دەستکاری منسوبی خاڵ',
    importCSVExcel: 'هێنانی فایلی CSV / Excel',

    presetBuildingPad: 'شۆڵدەر/زەوی بینا (50m x 30m)',
    presetParkingLot: 'پارکینگی لێژ (100m x 60m)',
    presetTerracedSite: 'زەوی پلەدار (40m x 40m)',
    presetRoadSection: 'ژێرخانی ڕێگا (80m x 20m)',

    cancel: 'پەشیمانبوونەوە',
    apply: 'جێبەجێکردن',
    close: 'داخستن',
    searchStation: 'گەڕان بۆ وێستگە (نموونە A1, B3)...',
    filterAll: 'هەموو وێستگەکان',
    filterCutOnly: 'تەنها خاڵەکانی بڕین',
    filterFillOnly: 'تەنها خاڵەکانی پڕکردنەوە',
    filterBalancedOnly: 'خاڵە صفرەکان',
    contourInterval: 'مەودای هێڵەکانی کۆنتۆر (m)',
    solidMesh: 'ڕووی پڕ (Solid)',
    wireframeMesh: 'ڕووی هێڵکاری (Wireframe)',
  },
  ar: {
    appTitle: 'حاسبة الشبكة المساحية - كاميار',
    subtitle: 'برنامج الهندسة المساحية الاحترافي لحساب المناسيب والأعمال الترابية',
    home: 'الرئيسية',
    calculator: 'حاسبة الشبكة',
    dashboard: 'لوحة التحكم',
    newProject: 'مشروع جديد',
    openProject: 'فتح مشروع',
    recentProjects: 'المشاريع الأخيرة',
    settings: 'الإعدادات',
    darkMode: 'الوضع الداكن',
    lightMode: 'الوضع الفاتح',
    language: 'اللغة',

    projectInfo: 'معلومات المشروع',
    projectName: 'اسم المشروع',
    client: 'العميل / مالك المشروع',
    surveyor: 'المهندس المساح',
    date: 'تاريخ الرفع المساحي',
    notes: 'ملاحظات المشروع',
    projectInfoDesc: 'إدخال بيانات المشروع الخاصة بتقارير التجميع والوثائق الميدانية.',

    instrumentLeveling: 'إعداد جهاز الميزان (HI)',
    benchmarkRL: 'منسوب النقطة المرجعية Benchmark RL (م)',
    backSight: 'القراءة الخلفية BS (م)',
    heightOfInstrument: 'ارتفاع الجهاز Height of Instrument (HI)',
    benchmarkRLTooltip: 'المنسوب المعلوم لنقطة الروبير (الرقم المرجعي).',
    backSightTooltip: 'قراءة القامة (المسطرة) على نقطة الروبير المرجعية.',
    hiFormula: 'HI = Benchmark RL + Back Sight',

    siteDimensions: 'أبعاد الموقع والمسافات الشبكية',
    length: 'طول الموقع (X - أمتار)',
    width: 'عرض الموقع (Y - أمتار)',
    unit: 'الوحدات',
    gridSpacing: 'المسافة بين الشبكات (م)',
    customSpacing: 'مسافة مخصصة',
    totalArea: 'المساحة الكلية',
    gridPointsCount: 'إجمالي محطات الشبكة',

    existingGround: 'منسوب الأرض الطبيعية (الحالية)',
    flatGround: 'أرض مستوية',
    slopedGround: 'منحدر جاهز',
    manualGridLevels: 'إدخال يدوي للمناسيب',
    importFile: 'استيراد ملف CSV / Excel',
    flatGroundRL: 'منسوب الأرض الأساسي (م)',
    generateTerrain: 'إنشاء تضاريس الموقع',

    designSurface: 'السطح التصميمي المستهدف',
    surfaceType: 'نوع السطح التصميمي',
    flatSurface: 'سطح مستوٍ أفقي',
    oneWaySlope: 'ميل في اتجاه واحد',
    twoWaySlope: 'ميل في اتجاهين',
    fourWaySlope: 'ميل في أربعة اتجاهات (محدب)',
    customSurface: 'تعديل مخصص لكل نقطة',
    startElevation: 'منسوب البداية (م)',
    endElevation: 'منسوب النهاية (م)',
    slopePercent: 'نسبة الميل Slope (%)',
    oneWayMode: 'طريقة إدخال الميل',
    startEndElevations: 'منسوب البداية والنهاية',
    startElevationWithSlope: 'منسوب البداية + الميل (%)',
    calculatedEndElevation: 'منسوب النهاية المحسوب',
    slopeDirection: 'اتجاه الانحدار',
    slopeX: 'نسبة الميل X (%)',
    slopeY: 'نسبة الميل Y (%)',
    centerElevation: 'منسوب المركز (م)',
    perimeterElevation: 'منسوب المحيط (م)',

    north: 'شمال (+Y)',
    south: 'جنوب (-Y)',
    east: 'شرق (+X)',
    west: 'غرب (-X)',
    northEast: 'شمال شرق',
    northWest: 'شمال غرب',
    southEast: 'جنوب شرق',
    southWest: 'جنوب غرب',

    view2DGrid: 'الشبكة البيانية 2D',
    view3DSurface: 'نموذج السطح 3D',
    viewContourMap: 'خطوط الكنتور',
    viewDataTable: 'جدول المحطات',
    viewAnalytics: 'حساب الحفريات والردم',

    showGridLines: 'خطوط الشبكة',
    showCoordinates: 'الإحداثيات (X, Y)',
    showStationLabels: 'أسماء المحطات',
    heatMap: 'خريطة حرارية للحفر والردم',
    cutColor: 'حفر Cut (أحمر)',
    fillColor: 'ردم Fill (أخضر)',
    zeroColor: 'متوازن (رمادي)',
    zoomIn: 'تكبير',
    zoomOut: 'تصغير',
    resetView: 'إعادة ضبط المنظر',

    station: 'المحطة',
    coordX: 'X (م)',
    coordY: 'Y (م)',
    existingElevation: 'المنسوب الحالي (م)',
    designElevation: 'المنسوب التصميمي (م)',
    difference: 'الفرق (م)',
    cut: 'حفر Cut (م)',
    fill: 'ردم Fill (م)',
    staffReading: 'قراءة المسطرة (م)',

    earthworkVolume: 'أحجام الأعمال الترابية (الحفر والردم)',
    cutVolume: 'إجمالي حجم الحفر (Cut)',
    fillVolume: 'إجمالي حجم الردم (Fill)',
    netVolume: 'صافي توازن التربة',
    surplusCut: 'فائض الحفر (يتطلب ترحيل للشارع)',
    deficitFill: 'عجز التربة (يتطلب توريد دفان)',
    balanced: 'الموقع متوازن بالكامل',
    gridMethod: 'طريقة الشبكات (Grid Method)',
    averageEndArea: 'طريقة متوسط المساحتين',
    highestExisting: 'أعلى منسوب حالي',
    lowestExisting: 'أدنى منسوب حالي',
    highestDesign: 'أعلى منسوب تصميمي',
    lowestDesign: 'أدنى منسوب تصميمي',
    averageRL: 'متوسط منسوب الموقع',
    maximumCut: 'أقصى عمق حفر',
    maximumFill: 'أقصى ارتفاع ردم',
    averageCut: 'متوسط عمق الحفر',
    averageFill: 'متوسط ارتفاع الردم',

    exportPDF: 'تصدير تقرير PDF',
    exportExcel: 'تصدير جدول Excel',
    exportJSON: 'تصدير مشروع JSON',
    printReport: 'طباعة التقرير الميداني',
    saveProject: 'حفظ المشروع',
    quickSave: 'تم الحفظ التلقائي',
    saved: 'تم الحفظ في قاعدة البيانات',
    pointDetails: 'تفاصيل نقطة الشبكة',
    editPoint: 'تعديل منسوب المحطة',
    importCSVExcel: 'استيراد ملف CSV / Excel',

    presetBuildingPad: 'منصة مبنى (50m x 30m)',
    presetParkingLot: 'موقف سيارات مائل (100m x 60m)',
    presetTerracedSite: 'موقع مدرج (40m x 40m)',
    presetRoadSection: 'أساس طريق (80m x 20m)',

    cancel: 'إلغاء',
    apply: 'تطبيق',
    close: 'إغلاق',
    searchStation: 'بحث عن محطة (مثال A1, B3)...',
    filterAll: 'جميع المحطات',
    filterCutOnly: 'نقاط الحفر فقط',
    filterFillOnly: 'نقاط الردم فقط',
    filterBalancedOnly: 'النقاط المتوازنة صفر',
    contourInterval: 'الفترة الكنتورية (م)',
    solidMesh: 'سطح مجسم Solid',
    wireframeMesh: 'شبكة سلكية Wireframe',
  }
};

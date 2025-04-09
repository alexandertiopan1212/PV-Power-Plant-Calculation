function showOSMMapDialog() {
  const html = HtmlService.createHtmlOutputFromFile('OSMMap')
    .setWidth(800)
    .setHeight(600)
    .setTitle('Select Location (OpenStreetMap)');
  SpreadsheetApp.getUi().showModalDialog(html, 'Select Location (OpenStreetMap)');
}

function setLatLngToSheet(lat, lng) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Overview");
  sheet.getRange('E9').setValue(lat);
  sheet.getRange('H9').setValue(lng);

  // Otomatis ambil data NASA GHI
  getGHI_LastYear_Full_Auto();
}

function getGHI_LastYear_Full_Auto() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const overviewSheet = ss.getSheetByName("Overview");
  const dataSheet = ss.getSheetByName("Data Source") || ss.insertSheet("Data Source");

  const lat = overviewSheet.getRange("E9").getValue();
  const lon = overviewSheet.getRange("H9").getValue();

  if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
    Logger.log("⚠️ Latitude dan Longitude tidak valid.");
    return;
  }

  const year = new Date().getFullYear() - 1;
  const startDate = `${year}0101`;
  const endDate = `${year}1231`;

  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=ALLSKY_SFC_SW_DWN&start=${startDate}&end=${endDate}&latitude=${lat}&longitude=${lon}&format=JSON&community=RE`;

  try {
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    const ghiData = data.properties.parameter.ALLSKY_SFC_SW_DWN;

    dataSheet.clearContents();
    dataSheet.getRange("A1").setValue("Tanggal");
    dataSheet.getRange("B1").setValue("GHI (kWh/m²/day)");

    let row = 2;
    let previousGHI = null;

    for (const [date, ghi] of Object.entries(ghiData)) {
      const ghiValue = (ghi === -999 || ghi === "-999") ? previousGHI : ghi;
      dataSheet.getRange(row, 1).setValue(date);
      dataSheet.getRange(row, 2).setValue(ghiValue);
      if (ghiValue !== null && ghiValue !== undefined) {
        previousGHI = ghiValue;
      }
      row++;
    }

    Logger.log(`✅ Data GHI tahun ${year} berhasil diambil dan dibersihkan dari -999.`);

  } catch (e) {
    Logger.log("❌ Gagal ambil data dari NASA POWER: " + e);
  }
}

function simulateBatterySizing() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Battery Calculation");

  // Ambil nilai dari MIN, MAX, STEP
  const minCap = sheet.getRange("M5").getValue();
  const maxCap = sheet.getRange("N5").getValue();
  const step = sheet.getRange("O5").getValue();

  // Bersihkan hasil sebelumnya dari M9:O
  const lastRow = sheet.getLastRow();
  if (lastRow >= 9) {
    sheet.getRange("M9:O" + lastRow).clearContent();
  }

  // Mulai tulis hasil dari baris 9
  let outputRow = 9;

  // Loop simulasi sizing
  for (let cap = minCap; cap <= maxCap; cap += step) {
    sheet.getRange("M2").setValue(cap); // set battery capacity
    SpreadsheetApp.flush(); // update formula

    Utilities.sleep(300); // biar semua formula keburu refresh

    const plnImport = sheet.getRange("N2").getValue();
    const percentPLN = sheet.getRange("O2").getValue();

    sheet.getRange(outputRow, 13).setValue(cap);        // M
    sheet.getRange(outputRow, 14).setValue(plnImport);  // N
    sheet.getRange(outputRow, 15).setValue(percentPLN); // O

    outputRow++;
  }

  // Kembalikan formula awal ke M2
  sheet.getRange("M2").setFormula("=Overview!Q8");

  SpreadsheetApp.getUi().alert("✅ Simulasi Battery Sizing selesai dan M2 sudah dikembalikan ke formula.");
}

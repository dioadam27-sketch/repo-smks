import * as fs from 'fs';

let content = fs.readFileSync('src/utils/pdfExportUtils.ts', 'utf8');

// List of target replacements
const rules = [
  { match: /r\.berkasKak \|\| '-'/g, replace: 'createCellLink(r.berkasKakName || r.berkasKak, r.berkasKakDriveUrl)' },
  { match: /r\.lpj \|\| '-'/g, replace: 'createCellLink(r.lpjName || r.lpj, r.lpjDriveUrl)' },
  { match: /r\.karyaIlmiah \|\| '-'/g, replace: 'createCellLink(r.karyaIlmiah, r.karyaIlmiahDriveUrl)' },
  { match: /r\.sertifikat \|\| '-'/g, replace: 'createCellLink(r.sertifikatName || r.sertifikat, r.sertifikatDriveUrl)' },
  { match: /r\.dokumen \|\| '-'/g, replace: 'createCellLink(r.dokumenName || r.dokumen, r.dokumenDriveUrl)' },
  { match: /r\.berkasPendukung \|\| '-'/g, replace: 'createCellLink(r.berkasPendukungName || r.berkasPendukung, r.berkasPendukungDriveUrl)' },
  { match: /r\.laporanPengendali \|\| '-'/g, replace: 'createCellLink(r.laporanPengendaliName || r.laporanPengendali, r.laporanPengendaliDriveUrl)' },
  { match: /r\.pks \|\| '-'/g, replace: 'createCellLink(r.pksName || r.pks, r.pksDriveUrl)' },
  { match: /r\.suratKakRegistrasi \|\| '-'/g, replace: 'createCellLink(r.suratKakRegistrasiName || r.suratKakRegistrasi, r.suratKakRegistrasiDriveUrl)' },
  { match: /r\.timPenelitiFile \|\| '-'/g, replace: 'createCellLink(r.timPenelitiFileName || r.timPenelitiFile, r.timPenelitiFileDriveUrl)' },
  { match: /r\.ctaFile \|\| '-'/g, replace: 'createCellLink(r.ctaFileName || r.ctaFile, r.ctaFileDriveUrl)' },
  { match: /r\.fotoProduk \|\| '-'/g, replace: 'createCellLink(r.fotoProduk, r.fotoProdukDriveUrl)' },
  { match: /r\.buktiBukuCetak \|\| '-'/g, replace: 'createCellLink(r.buktiBukuCetak, r.buktiBukuCetakDriveUrl)' },
  { match: /r\.fileArtikel \|\| '-'/g, replace: 'createCellLink(r.fileArtikelName || r.fileArtikel, r.fileArtikelDriveUrl)' },
  { match: /r\.buktiSertifikatPaten \|\| '-'/g, replace: 'createCellLink(r.buktiSertifikatPatenName || r.buktiSertifikatPaten, r.buktiSertifikatPatenDriveUrl)' },
  { match: /r\.buktiSertifikatHki \|\| '-'/g, replace: 'createCellLink(r.buktiSertifikatHkiName || r.buktiSertifikatHki, r.buktiSertifikatHkiDriveUrl)' }
];

rules.forEach(r => {
  content = content.replace(r.match, r.replace);
});

// Inject handleDidDrawCellWithLink into ALL occurrences of autoTable config EXCEPT generateExecutiveReportPdf
let parts = content.split('export function generatePraPendidikanPdf');
let exeReport = parts[0];
let rest = 'export function generatePraPendidikanPdf' + parts[1];

rest = rest.replace(/didDrawPage:/g, 'didDrawCell: (data) => handleDidDrawCellWithLink(doc, data),\n    didDrawPage:');

fs.writeFileSync('src/utils/pdfExportUtils.ts', exeReport + rest, 'utf8');

console.log("Successfully patched pdfExportUtils.ts!");

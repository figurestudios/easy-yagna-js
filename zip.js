// TAKEN FROM https://stackoverflow.com/a/51518100

const archiver = require('archiver');
const fs = require('fs');

zipDirectory ("./node_modules", "node_modules.zip")

function zipDirectory(sourceDir, outPath) {
    const archive = archiver('zip', { zlib: { level: 9 }});
    const stream = fs.createWriteStream(outPath);
  
    return new Promise((resolve, reject) => {
      archive
        .directory(sourceDir, false)
        .on('error', err => reject(err))
        .pipe(stream)
      ;
  
      stream.on('close', () => resolve());
      archive.finalize();
    });
  }
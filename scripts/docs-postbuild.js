const fs = require('fs');

fs.readFile('./docs/index.html', (err, data) => {
  if (err) {
    console.log('error reading documentation index.html file : ', err);
    return;
  }
  console.log('index.html', data.toString());
  const fileContent = data.toString();
  const newFileContent = fileContent.replace('<base href="/">', '<base href="">');
  fs.writeFileSync('./docs/index.html', newFileContent);
});

import Metalsmith from 'metalsmith';
import { extname, ParsedPath } from 'path';
import { exec as originalExec } from 'child_process';
import { mkdir as originalMkdir } from 'fs';
import path from 'path';
import {promisify} from 'util';

const exec = promisify(originalExec);
const mkdir = promisify(originalMkdir);

const imageExtensions = ['.jpg', '.jpeg', '.svg', '.png', '.gif'];

const processImage = async (file: {path: ParsedPath}, metalsmith: Metalsmith) => {
  console.log('processImage()');
  console.log(file);
  const sourceFile = path.join(metalsmith.source(), 'images', file.path.base);
  const destinationFile = path.join(metalsmith.destination(), 'images', 'small', `${file.path.name}.jpg`);
  await exec(`convert -resize "720>" ${sourceFile} ${destinationFile}`);
};

const processImages = async (
  files: Parameters<Metalsmith.Plugin>[0],
  metalsmith: Metalsmith
) => {
  const filteredFileNames = Object.keys(files).filter((fileName) =>
    imageExtensions.indexOf(extname(fileName).toLowerCase()) > -1
  );
  await mkdir(path.join(metalsmith.destination(), 'images', 'small'), { recursive: true });
  await Promise
    .all(filteredFileNames.map(fileName => processImage(files[fileName], metalsmith)));
};

export const myConvertPlugin: Metalsmith.Plugin = (files, metalsmith, done) => {
  processImages(files, metalsmith)
    .then(() => {
    done(null, files, metalsmith);
  }, (error) => {
    done(error, files, metalsmith);
  })
};

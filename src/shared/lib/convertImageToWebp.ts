import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

interface ConvertOptions {
  inputPath: string;
  outputDir: string;
  outputFileName?: string;
}

/**
 * Converts an image to WebP format.
 * @param options ConvertOptions
 * @returns Path to the converted WebP image
 */

export async function convertImageToWebp(
  options: ConvertOptions,
): Promise<string> {
  const { inputPath, outputDir, outputFileName } = options;

  await fs.mkdir(outputDir, { recursive: true });

  const inputFileName = path.basename(inputPath);
  const outputFile = outputFileName
    ? path.join(outputDir, outputFileName)
    : path.join(outputDir, `${path.parse(inputFileName).name}.webp`);

  // Perform the conversion
  await sharp(inputPath).webp().toFile(outputFile);

  return outputFile; // Return the path to the WebP image
}

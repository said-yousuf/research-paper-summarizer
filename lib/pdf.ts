/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/pdf.ts
import PDFParser from 'pdf2json';

/**
 * Extracts text from each page of a PDF buffer.
 * @param buffer - PDF file as a Buffer
 * @returns array of page texts
 */
export async function extractPdfPages(buffer: Buffer): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();
    parser.on('pdfParser_dataError', (err: any) => {
      console.error('PDF parsing error:', err.parserError);
      reject(new Error(err.parserError));
    });

    parser.on('pdfParser_dataReady', (pdfData: unknown) => {
      try {
        interface TextRun {
          T: string;
        }
        interface TextItem {
          R: TextRun[];
        }
        interface Page {
          Texts: TextItem[];
        }
        const data = pdfData as { Pages?: Page[] };
        if (!Array.isArray(data.Pages)) {
          throw new Error('PDF data does not contain Pages');
        }
        const pages: string[] = data.Pages.map((page: Page) =>
          page.Texts.map((textItem: TextItem) =>
            textItem.R.map((r: TextRun) => decodeURIComponent(r.T)).join('')
          ).join(' ')
        );
        resolve(pages);
      } catch (e) {
        reject(e);
      }
    });

    parser.parseBuffer(buffer);
  });
}

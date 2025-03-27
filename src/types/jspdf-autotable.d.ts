
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    /**
     * Returns the final y position of the last drawn cell
     */
    lastAutoTable: {
      finalY: number;
    };
    /**
     * Previous auto table styles
     */
    previousAutoTable: {
      finalY: number;
    };
  }
}

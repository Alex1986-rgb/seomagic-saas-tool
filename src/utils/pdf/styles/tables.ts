
/**
 * Table styling utilities for PDF generation
 */

// Default table styles
export const pdfTableStyles = {
  default: {
    headStyles: {
      fillColor: [56, 189, 248],
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    bodyStyles: {
      textColor: [0, 0, 0]
    },
    alternateRowStyles: {
      fillColor: [241, 245, 249]
    }
  },
  
  compact: {
    styles: {
      fontSize: 9,
      cellPadding: 2
    }
  },
  
  error: {
    headStyles: {
      fillColor: [239, 68, 68]
    }
  },
  
  success: {
    headStyles: {
      fillColor: [74, 222, 128]
    }
  },
  
  warning: {
    headStyles: {
      fillColor: [251, 146, 60]
    }
  }
};

/**
 * Applies row coloring based on value
 */
export function getRowColorByValue(
  value: number, 
  goodThreshold: number = 80,
  mediumThreshold: number = 50
): number[] {
  if (value >= goodThreshold) {
    return [240, 253, 244]; // Light green
  } else if (value >= mediumThreshold) {
    return [254, 249, 195]; // Light yellow
  } else {
    return [254, 226, 226]; // Light red
  }
}

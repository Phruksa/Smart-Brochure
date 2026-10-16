import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPdf(elementId: string, fileName: string = 'รายงานเปรียบเทียบแผนประกันภัย.pdf'): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found for PDF export:', elementId);
    return false;
  }

  try {
    // Render target element to canvas with high scale for crisp text rendering
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // PDF Dimensions in mm for A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const margin = 8; // 8mm margin
    const contentWidth = pdfWidth - (margin * 2);
    const contentHeight = (canvas.height * contentWidth) / canvas.width;

    let heightLeft = contentHeight;
    let position = margin;
    let page = 1;

    // First page
    pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, '', 'FAST');
    heightLeft -= (pdfHeight - (margin * 2));

    // Subsequent pages if table is tall
    while (heightLeft > 0) {
      position = heightLeft - contentHeight + margin;
      pdf.addPage();
      page++;
      pdf.addImage(imgData, 'PNG', margin, position, contentWidth, contentHeight, '', 'FAST');
      heightLeft -= (pdfHeight - (margin * 2));
    }

    pdf.save(fileName);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
}

export function triggerPrint() {
  window.print();
}

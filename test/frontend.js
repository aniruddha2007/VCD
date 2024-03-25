async function fetchPdf(pdfId) {
    try {
      const response = await fetch(`http://localhost:3000/offer_coa_upload/pdf/${pdfId}`, {
        headers: {
          'x-api-key': 'aniruddhaqwerty1234'
        }
      });
      const pdfBlob = await response.blob();
      displayPdf(pdfBlob);
    } catch (error) {
      console.error('Error fetching PDF:', error);
    }
  }
  
  function displayPdf(pdfBlob) {
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const pdfViewer = document.getElementById('pdfViewer');
    if (pdfViewer) {
      pdfViewer.setAttribute('src', pdfUrl);
    } else {
      console.error('PDF viewer element not found');
    }
  }
  
declare module 'html2pdf.js' {
  function html2pdf(): {
    from: (element: HTMLElement) => {
      toPdf: () => Promise<Blob>;
      save: () => void;
    };
  };

  export default html2pdf;
}

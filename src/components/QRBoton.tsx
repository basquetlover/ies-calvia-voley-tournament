import React, { useRef } from 'react';
import QRCode from 'qrcode';

interface QRBotonProps {
  NombreAdmin: string;
}

const QRBotonReact = ({ NombreAdmin }: QRBotonProps) => {
  const imgRef = useRef<HTMLImageElement>(null);

  const generarQR = async () => {
    const url = window.location.href;
    try {
      const dataUrl = await QRCode.toDataURL(url);
      if (imgRef.current) {
        imgRef.current.src = dataUrl;
        imgRef.current.classList.remove('hidden');

        // Descargar automáticamente
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `QR_${NombreAdmin}.png`;
        link.click();
      }
    } catch (err) {
      console.error('Error generando el código QR', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={generarQR}
        className="px-4 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-md"
      >
        Generar y descargar QR
      </button>

      <img
        ref={imgRef}
        className="hidden w-48 h-48 rounded-xl shadow-lg"
        alt="Código QR generado"
      />
    </div>
  );
};

export default QRBotonReact;

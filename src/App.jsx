import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "./App.css";



const App = () => {
  const [qrCodeData, setQrCodeData] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [savedQrs, setSavedQrs] = useState([]);
  const qrRef = useRef();

  // Load all QR Codes
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("qrcodes")) || [];
    setSavedQrs(stored);
  }, []);

  const inputContent = (e) => {
    setQrCodeData(e.target.value);
    setShowQr(false);
  };

  const generateQrCode = () => {
    if (qrCodeData.trim() !== "") {
      setShowQr(true);

      const updated = [
        { content: qrCodeData, createdAt: Date.now() },
        ...savedQrs,
      ];
      setSavedQrs(updated);
      localStorage.setItem("qrcodes", JSON.stringify(updated));
    }
  };

  const downloadPNG = () => {
    const svg = qrRef.current.querySelector("svg");
    const data = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "qrcode.png";
      link.click();
    };
    img.src = url;
  };

  const clearQrs = () => {
    localStorage.removeItem("qrcodes");
    setSavedQrs([]);
    setShowQr(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md shadow-xl bg-base-100 p-6">
        <h1 className="text-2xl font-bold text-center mb-1">
          React QR Code Generator
        </h1>
        <p className="text-center text-sm text-base-content/70 mb-4">
          A simple demo project built with React, for portfolio purposes.
        </p>

        <div className="join w-full">
          <input
            type="text"
            onChange={inputContent}
            placeholder="Type text or URL"
            className="input input-bordered join-item w-full"
          />
          <button
            className="btn btn-primary join-item"
            onClick={generateQrCode}
          >
            Generate
          </button>
        </div>

        {showQr && (
          <div className="flex flex-col items-center mt-6 gap-3">
            <div ref={qrRef} className="p-4 bg-white rounded-xl shadow-md">
              <QRCodeSVG
                value={qrCodeData}
                size={160}
                bgColor="#ffffff"
                fgColor="#2d89ef"
              />
            </div>
            <button className="btn btn-accent w-full" onClick={downloadPNG}>
              Download PNG
            </button>
          </div>
        )}

        {savedQrs.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-2">Saved QR Codes</h2>
            <ul className="space-y-2 max-h-48 overflow-y-auto mb-4">
              {savedQrs.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 bg-base-200 rounded-lg"
                >
                  <span className="truncate">{item.content}</span>
                  <QRCodeSVG value={item.content} size={48} />
                </li>
              ))}
            </ul>
            <button className="btn btn-error w-full" onClick={clearQrs}>
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
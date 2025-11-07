"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Download,
  Wifi,
  Mail,
  Phone,
  Link2,
  FileText,
  User,
} from "lucide-react";

export default function QRCodeGenerator() {
  const [qrType, setQrType] = useState("url");
  const [qrData, setQrData] = useState("");
  const [qrSize, setQrSize] = useState(256);
  const [qrColor, setQrColor] = useState("#000000");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  const [generatedQR, setGeneratedQR] = useState("");

  // Form states
  const [urlInput, setUrlInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [emailInput, setEmailInput] = useState({
    email: "",
    subject: "",
    body: "",
  });
  const [phoneInput, setPhoneInput] = useState("");
  const [wifiInput, setWifiInput] = useState({
    ssid: "",
    password: "",
    encryption: "WPA",
  });
  const [vcardInput, setVcardInput] = useState({
    name: "",
    phone: "",
    email: "",
    company: "",
  });

  const qrRef = useRef(null);

  const qrTypes = [
    { id: "url", name: "URL/Link", icon: Link2, emoji: "🔗" },
    { id: "text", name: "Text", icon: FileText, emoji: "📝" },
    { id: "email", name: "Email", icon: Mail, emoji: "📧" },
    { id: "phone", name: "Phone", icon: Phone, emoji: "📱" },
    { id: "wifi", name: "WiFi", icon: Wifi, emoji: "📶" },
    { id: "vcard", name: "vCard", icon: User, emoji: "👤" },
  ];

  const generateQRData = () => {
    let data = "";

    switch (qrType) {
      case "url":
        data = urlInput;
        break;
      case "text":
        data = textInput;
        break;
      case "email":
        data = `mailto:${emailInput.email}?subject=${encodeURIComponent(
          emailInput.subject
        )}&body=${encodeURIComponent(emailInput.body)}`;
        break;
      case "phone":
        data = `tel:${phoneInput}`;
        break;
      case "wifi":
        data = `WIFI:T:${wifiInput.encryption};S:${wifiInput.ssid};P:${wifiInput.password};;`;
        break;
      case "vcard":
        data = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardInput.name}\nTEL:${vcardInput.phone}\nEMAIL:${vcardInput.email}\nORG:${vcardInput.company}\nEND:VCARD`;
        break;
    }

    if (!data) {
      alert("Please fill in the required fields");
      return;
    }

    setQrData(data);
  };

  useEffect(() => {
    if (qrData) {
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(
        qrData
      )}&color=${qrColor.replace("#", "")}&bgcolor=${qrBgColor.replace(
        "#",
        ""
      )}`;
      setGeneratedQR(qrCodeUrl);
    }
  }, [qrData, qrSize, qrColor, qrBgColor]);

  const downloadQR = async (format) => {
    if (!generatedQR) {
      alert("Please generate a QR code first");
      return;
    }

    try {
      // Fetch the image from the API
      const response = await fetch(generatedQR);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `qrcode-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download QR code. Please try again.");
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Type Selection */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Select QR Code Type
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {qrTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setQrType(type.id)}
                  className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                    qrType === type.id
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300"
                  }`}
                >
                  <span className="mr-2">{type.emoji}</span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* Input Forms */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Enter Information
            </h2>

            {/* URL Form */}
            {qrType === "url" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Website URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Text Form */}
            {qrType === "text" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Text Content
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={4}
                  placeholder="Enter any text..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Email Form */}
            {qrType === "email" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailInput.email}
                    onChange={(e) =>
                      setEmailInput({ ...emailInput, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Subject (Optional)
                  </label>
                  <input
                    type="text"
                    value={emailInput.subject}
                    onChange={(e) =>
                      setEmailInput({ ...emailInput, subject: e.target.value })
                    }
                    placeholder="Email subject"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Message (Optional)
                  </label>
                  <textarea
                    value={emailInput.body}
                    onChange={(e) =>
                      setEmailInput({ ...emailInput, body: e.target.value })
                    }
                    rows={3}
                    placeholder="Email message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Phone Form */}
            {qrType === "phone" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* WiFi Form */}
            {qrType === "wifi" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={wifiInput.ssid}
                    onChange={(e) =>
                      setWifiInput({ ...wifiInput, ssid: e.target.value })
                    }
                    placeholder="My WiFi Network"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Password
                  </label>
                  <input
                    type="text"
                    value={wifiInput.password}
                    onChange={(e) =>
                      setWifiInput({ ...wifiInput, password: e.target.value })
                    }
                    placeholder="Password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Security Type
                  </label>
                  <select
                    value={wifiInput.encryption}
                    onChange={(e) =>
                      setWifiInput({ ...wifiInput, encryption: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="WPA">WPA/WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None</option>
                  </select>
                </div>
              </div>
            )}

            {/* vCard Form */}
            {qrType === "vcard" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={vcardInput.name}
                    onChange={(e) =>
                      setVcardInput({ ...vcardInput, name: e.target.value })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={vcardInput.phone}
                    onChange={(e) =>
                      setVcardInput({ ...vcardInput, phone: e.target.value })
                    }
                    placeholder="+1234567890"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={vcardInput.email}
                    onChange={(e) =>
                      setVcardInput({ ...vcardInput, email: e.target.value })
                    }
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Company (Optional)
                  </label>
                  <input
                    type="text"
                    value={vcardInput.company}
                    onChange={(e) =>
                      setVcardInput({ ...vcardInput, company: e.target.value })
                    }
                    placeholder="Company Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            <button
              onClick={generateQRData}
              className="w-full mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Generate QR Code</span>
              <span>🎯</span>
            </button>
          </div>

          {/* Customization */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Customize QR Code
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Size: {qrSize}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  value={qrSize}
                  onChange={(e) => setQrSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  QR Code Color
                </label>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Background Color
                </label>
                <input
                  type="color"
                  value={qrBgColor}
                  onChange={(e) => setQrBgColor(e.target.value)}
                  className="w-full h-12 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              QR Code Preview
            </h2>
            <div
              ref={qrRef}
              className="flex flex-col items-center justify-center min-h-[300px] bg-gray-50 rounded-lg p-8"
            >
              {generatedQR ? (
                <img src={generatedQR} alt="QR Code" className="max-w-full" />
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">📱</div>
                  <p className="text-lg">Your QR code will appear here</p>
                  <p className="text-sm mt-2">
                    Fill in the details and click generate
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Download Options */}
          {generatedQR && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Download QR Code
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => downloadQR("png")}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  <span>Download as PNG</span>
                </button>
              </div>
            </div>
          )}

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use high contrast colors for better scanning</li>
              <li>• Larger QR codes are easier to scan</li>
              <li>• Test your QR code before printing</li>
              <li>• Keep URLs short for simpler codes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

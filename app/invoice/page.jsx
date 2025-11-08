"use client";
import React, { useState, useRef } from "react";
import { Plus, Trash2, Download, Upload } from "lucide-react";

export default function InvoiceGenerator() {
  const [logo, setLogo] = useState(null);
  const [invoiceTo, setInvoiceTo] = useState("");
  const [invoiceToTitle, setInvoiceToTitle] = useState("");
  const [invoiceToAddress, setInvoiceToAddress] = useState("");
  const [invoiceToContact, setInvoiceToContact] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([
    { id: 1, name: "", quantity: "", unitPrice: "", total: 0 },
  ]);
  const [fromCompany, setFromCompany] = useState("");
  const [paymentOptions, setPaymentOptions] = useState("");
  const [terms, setTerms] = useState("");
  const [notes, setNotes] = useState("");
  const [footerLeft, setFooterLeft] = useState("");
  const [footerRight, setFooterRight] = useState("");

  const fileInputRef = useRef(null);
  const invoiceRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now(), name: "", quantity: "", unitPrice: "", total: 0 },
    ]);
  };

  const removeItem = (id) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id, field, value) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "quantity" || field === "unitPrice") {
            const qty =
              parseFloat(field === "quantity" ? value : updated.quantity) || 0;
            const price =
              parseFloat(field === "unitPrice" ? value : updated.unitPrice) ||
              0;
            updated.total = qty * price;
          }
          return updated;
        }
        return item;
      })
    );
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const exportToPDF = () => {
    // Get the invoice content
    const invoiceContent = invoiceRef.current;

    if (!invoiceContent) {
      alert("Invoice preview not found");
      return;
    }

    // Create a new window for printing
    const printWindow = window.open("", "_blank");

    // Write the invoice content to the new window
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
            padding: 2cm;
            background: white;
          }
          @page {
            margin: 1cm;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        ${invoiceContent.innerHTML}
      </body>
    </html>
  `);

    // Wait for content to load, then print
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 print:p-0 print:bg-white">
      <div className="flex justify-between items-center mb-6 print:hidden">
        <h1 className="text-xl md:text-3xl font-bold text-gray-800">NSR Invoice</h1>
        <button
          onClick={exportToPDF}
          className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <Download size={20} />
          Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor Section */}
        <div className="space-y-6 print:hidden">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Company Logo</h2>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLogoUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Upload size={18} />
              Upload Logo
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice To
                </label>
                <input
                  type="text"
                  value={invoiceTo}
                  onChange={(e) => setInvoiceTo(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Title/Position
                </label>
                <input
                  type="text"
                  value={invoiceToTitle}
                  onChange={(e) => setInvoiceToTitle(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Title or Position"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address
                </label>
                <textarea
                  value={invoiceToAddress}
                  onChange={(e) => setInvoiceToAddress(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  rows={2}
                  placeholder="Complete Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact
                </label>
                <input
                  type="text"
                  value={invoiceToContact}
                  onChange={(e) => setInvoiceToContact(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Phone and/or Email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Invoice Date
                </label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Items</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex flex-col md:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={item.name}
                    onChange={(e) =>
                      updateItem(item.id, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(item.id, "quantity", e.target.value)
                    }
                    className="md:w-20 px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) =>
                      updateItem(item.id, "unitPrice", e.target.value)
                    }
                    className="md:w-24 px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                onClick={addItem}
                className="cursor-pointer flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                <Plus size={18} />
                Add Item
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Payment & Company Info
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  From Company
                </label>
                <input
                  type="text"
                  value={fromCompany}
                  onChange={(e) => setFromCompany(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment Options
                </label>
                <textarea
                  value={paymentOptions}
                  onChange={(e) => setPaymentOptions(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Bank: ABC Bank - 1234567890&#10;Mobile Banking: 01712345678"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Terms & Conditions
                </label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Payment terms and conditions"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                  placeholder="Additional notes"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Footer</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Address (Left)
                </label>
                <input
                  type="text"
                  value={footerLeft}
                  onChange={(e) => setFooterLeft(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Company Address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Contact (Right)
                </label>
                <input
                  type="text"
                  value={footerRight}
                  onChange={(e) => setFooterRight(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Phone: +880 1234567890 | Email: info@company.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div
            ref={invoiceRef}
            className="bg-white p-8 rounded-lg shadow-lg print:shadow-none print:p-12"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              {logo && (
                <div className="w-32 h-32">
                  <img
                    src={logo}
                    alt="Company Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
              <div className={logo ? "" : "ml-auto"}>
                <h1 className="text-4xl font-bold text-gray-800">INVOICE</h1>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="flex justify-between mb-8">
              <div>
                {invoiceTo && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 mb-1">Invoice To:</p>
                    <p className="font-semibold text-lg">{invoiceTo}</p>
                    {invoiceToTitle && (
                      <p className="text-sm text-gray-700">{invoiceToTitle}</p>
                    )}
                    {invoiceToAddress && (
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {invoiceToAddress}
                      </p>
                    )}
                    {invoiceToContact && (
                      <p className="text-sm text-gray-700">
                        {invoiceToContact}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right">
                {invoiceDate && (
                  <div className="mb-2">
                    <p className="text-sm text-gray-600">Date:</p>
                    <p className="font-medium">{invoiceDate}</p>
                  </div>
                )}
                {dueDate && (
                  <div>
                    <p className="text-sm text-gray-600">Due Date:</p>
                    <p className="font-medium">{dueDate}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            {items.some(
              (item) => item.name || item.quantity || item.unitPrice
            ) && (
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left py-3 text-sm font-semibold">
                        Product/Service
                      </th>
                      <th className="text-center py-3 text-sm font-semibold">
                        Qty
                      </th>
                      <th className="text-right py-3 text-sm font-semibold">
                        Unit Price
                      </th>
                      <th className="text-right py-3 text-sm font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items
                      .filter(
                        (item) => item.name || item.quantity || item.unitPrice
                      )
                      .map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3">{item.name}</td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-right py-3">${item.unitPrice}</td>
                          <td className="text-right py-3">
                            ${item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div className="flex justify-end mt-4">
                  <div className="w-64">
                    <div className="flex justify-between items-center py-3 border-t-2 border-gray-300">
                      <span className="font-semibold text-lg">Subtotal:</span>
                      <span className="font-bold text-xl">
                        ${calculateSubtotal()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="grid grid-cols-2 gap-8 mb-8">
              {fromCompany && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">From:</h3>
                  <p className="text-sm">{fromCompany}</p>
                </div>
              )}
              {paymentOptions && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">
                    Payment Options:
                  </h3>
                  <p className="text-sm whitespace-pre-line">
                    {paymentOptions}
                  </p>
                </div>
              )}
            </div>

            {/* Terms and Notes */}
            {(terms || notes) && (
              <div className="space-y-4 mb-8">
                {terms && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">
                      Terms & Conditions:
                    </h3>
                    <p className="text-sm text-gray-700">{terms}</p>
                  </div>
                )}
                {notes && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Notes:</h3>
                    <p className="text-sm text-gray-700">{notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Footer */}
            {(footerLeft || footerRight) && (
              <div className="border-t pt-6 mt-8">
                <div className="flex justify-between text-sm text-gray-600">
                  <div>{footerLeft}</div>
                  <div>{footerRight}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Download, 
  Upload,
  Save,
  Calculator,
  FileSpreadsheet,
  RotateCcw
} from 'lucide-react';

const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const INITIAL_ROWS = 20;

export default function MiniSpreadsheet() {
  const [cells, setCells] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [formulaBar, setFormulaBar] = useState('');
  const [spreadsheetName, setSpreadsheetName] = useState('Untitled Spreadsheet');
  const inputRefs = useRef({});

  // Initialize empty cells
  useEffect(() => {
    const initialCells = {};
    for (let row = 1; row <= INITIAL_ROWS; row++) {
      COLUMNS.forEach(col => {
        const cellId = `${col}${row}`;
        if (!cells[cellId]) {
          initialCells[cellId] = { value: '', formula: '', display: '' };
        }
      });
    }
    setCells(prev => ({ ...initialCells, ...prev }));
  }, []);

  const getCellId = (col, row) => `${col}${row}`;

  const evaluateFormula = (formula, cellId) => {
    if (!formula.startsWith('=')) return formula;

    try {
      let expression = formula.substring(1);
      
      // Handle SUM function
      const sumMatch = expression.match(/SUM\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (sumMatch) {
        const [_, start, end] = sumMatch;
        const sum = calculateRange(start, end, 'sum');
        expression = expression.replace(sumMatch[0], sum);
      }

      // Handle AVERAGE function
      const avgMatch = expression.match(/AVERAGE\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (avgMatch) {
        const [_, start, end] = avgMatch;
        const avg = calculateRange(start, end, 'average');
        expression = expression.replace(avgMatch[0], avg);
      }

      // Handle MIN function
      const minMatch = expression.match(/MIN\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (minMatch) {
        const [_, start, end] = minMatch;
        const min = calculateRange(start, end, 'min');
        expression = expression.replace(minMatch[0], min);
      }

      // Handle MAX function
      const maxMatch = expression.match(/MAX\(([A-Z]\d+):([A-Z]\d+)\)/i);
      if (maxMatch) {
        const [_, start, end] = maxMatch;
        const max = calculateRange(start, end, 'max');
        expression = expression.replace(maxMatch[0], max);
      }

      // Replace cell references with their values
      const cellRefMatch = expression.match(/[A-Z]\d+/g);
      if (cellRefMatch) {
        cellRefMatch.forEach(ref => {
          if (ref !== cellId) {
            const refValue = parseFloat(cells[ref]?.display || cells[ref]?.value || 0) || 0;
            expression = expression.replace(new RegExp(ref, 'g'), refValue);
          }
        });
      }

      // Evaluate the expression
      const result = eval(expression);
      return isNaN(result) ? '#ERROR' : result;
    } catch (error) {
      return '#ERROR';
    }
  };

  const calculateRange = (start, end, operation) => {
    const startCol = start.match(/[A-Z]/)[0];
    const startRow = parseInt(start.match(/\d+/)[0]);
    const endCol = end.match(/[A-Z]/)[0];
    const endRow = parseInt(end.match(/\d+/)[0]);

    const values = [];
    const startColIndex = COLUMNS.indexOf(startCol);
    const endColIndex = COLUMNS.indexOf(endCol);

    for (let row = startRow; row <= endRow; row++) {
      for (let colIndex = startColIndex; colIndex <= endColIndex; colIndex++) {
        const cellId = `${COLUMNS[colIndex]}${row}`;
        const cellValue = parseFloat(cells[cellId]?.display || cells[cellId]?.value || 0);
        if (!isNaN(cellValue)) {
          values.push(cellValue);
        }
      }
    }

    switch (operation) {
      case 'sum':
        return values.reduce((a, b) => a + b, 0);
      case 'average':
        return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      case 'min':
        return values.length ? Math.min(...values) : 0;
      case 'max':
        return values.length ? Math.max(...values) : 0;
      default:
        return 0;
    }
  };

  const handleCellChange = (cellId, value) => {
    const newCells = { ...cells };
    newCells[cellId] = {
      value: value,
      formula: value,
      display: evaluateFormula(value, cellId)
    };
    setCells(newCells);
    
    if (selectedCell === cellId) {
      setFormulaBar(value);
    }

    // Recalculate dependent cells
    Object.keys(newCells).forEach(id => {
      if (newCells[id].formula.includes(cellId)) {
        newCells[id].display = evaluateFormula(newCells[id].formula, id);
      }
    });
  };

  const handleCellSelect = (cellId) => {
    setSelectedCell(cellId);
    setFormulaBar(cells[cellId]?.formula || '');
    inputRefs.current[cellId]?.focus();
  };

  const handleFormulaBarChange = (value) => {
    setFormulaBar(value);
    if (selectedCell) {
      handleCellChange(selectedCell, value);
    }
  };

  const addRow = () => {
    const newCells = { ...cells };
    const newRow = INITIAL_ROWS + Object.keys(cells).length / COLUMNS.length + 1;
    COLUMNS.forEach(col => {
      const cellId = `${col}${newRow}`;
      newCells[cellId] = { value: '', formula: '', display: '' };
    });
    setCells(newCells);
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all data?')) {
      const emptyCells = {};
      for (let row = 1; row <= INITIAL_ROWS; row++) {
        COLUMNS.forEach(col => {
          const cellId = `${col}${row}`;
          emptyCells[cellId] = { value: '', formula: '', display: '' };
        });
      }
      setCells(emptyCells);
      setSelectedCell(null);
      setFormulaBar('');
    }
  };

  const exportToCSV = () => {
    let csv = '';
    const maxRow = Math.max(...Object.keys(cells).map(id => parseInt(id.match(/\d+/)[0])));
    
    for (let row = 1; row <= maxRow; row++) {
      const rowData = COLUMNS.map(col => {
        const cellId = `${col}${row}`;
        return `"${cells[cellId]?.display || cells[cellId]?.value || ''}"`;
      });
      csv += rowData.join(',') + '\n';
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spreadsheetName}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveSpreadsheet = () => {
    const data = {
      name: spreadsheetName,
      cells: cells,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${spreadsheetName}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const loadSpreadsheet = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setCells(data.cells);
          setSpreadsheetName(data.name || 'Untitled Spreadsheet');
        } catch (error) {
          alert('Error loading file');
        }
      };
      reader.readAsText(file);
    }
  };

  const rows = Math.max(INITIAL_ROWS, ...Object.keys(cells).map(id => parseInt(id.match(/\d+/)[0])));

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              value={spreadsheetName}
              onChange={(e) => setSpreadsheetName(e.target.value)}
              className="text-2xl font-bold text-gray-800 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
            />
            <div className="flex gap-2">
              <input
                type="file"
                accept=".json"
                onChange={loadSpreadsheet}
                className="hidden"
                id="file-upload"
              />
              <button
                onClick={() => document.getElementById('file-upload').click()}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                title="Load Spreadsheet"
              >
                <Upload size={18} />
                Load
              </button>
              <button
                onClick={saveSpreadsheet}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                title="Save Spreadsheet"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                title="Export to CSV"
              >
                <Download size={18} />
                CSV
              </button>
              <button
                onClick={clearAll}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                title="Clear All"
              >
                <RotateCcw size={18} />
                Clear
              </button>
            </div>
          </div>

          {/* Formula Bar */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
            <Calculator size={18} className="text-gray-600" />
            <span className="font-semibold text-gray-700 min-w-[60px]">
              {selectedCell || 'Cell'}
            </span>
            <input
              type="text"
              value={formulaBar}
              onChange={(e) => handleFormulaBarChange(e.target.value)}
              placeholder="Enter value or formula (e.g., =A1+B1, =SUM(A1:A10))"
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="bg-white rounded-lg shadow-sm overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 border border-gray-300 p-2 w-12 sticky left-0 z-10"></th>
                {COLUMNS.map(col => (
                  <th
                    key={col}
                    className="bg-gray-100 border border-gray-300 p-2 font-semibold text-gray-700 min-w-[120px]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }, (_, i) => i + 1).map(row => (
                <tr key={row}>
                  <td className="bg-gray-100 border border-gray-300 p-2 text-center font-semibold text-gray-700 sticky left-0 z-10">
                    {row}
                  </td>
                  {COLUMNS.map(col => {
                    const cellId = getCellId(col, row);
                    const cell = cells[cellId] || { value: '', display: '' };
                    const isSelected = selectedCell === cellId;
                    
                    return (
                      <td
                        key={cellId}
                        className={`border border-gray-300 p-0 ${
                          isSelected ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={() => handleCellSelect(cellId)}
                      >
                        <input
                          ref={el => inputRefs.current[cellId] = el}
                          type="text"
                          value={cell.value}
                          onChange={(e) => handleCellChange(cellId, e.target.value)}
                          className="w-full h-full px-2 py-2 border-none focus:outline-none bg-transparent"
                          placeholder=""
                        />
                        {cell.value.startsWith('=') && cell.display && (
                          <div className="absolute mt-1 text-xs text-gray-500 italic px-2">
                            {cell.display}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Row Button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={addRow}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Row
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <FileSpreadsheet size={18} />
            Formula Guide
          </h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Basic math:</strong> =A1+B1, =A1-B1, =A1*B1, =A1/B1</p>
            <p>• <strong>SUM:</strong> =SUM(A1:A10) - Add range of cells</p>
            <p>• <strong>AVERAGE:</strong> =AVERAGE(A1:A10) - Calculate average</p>
            <p>• <strong>MIN:</strong> =MIN(A1:A10) - Find minimum value</p>
            <p>• <strong>MAX:</strong> =MAX(A1:A10) - Find maximum value</p>
          </div>
        </div>
      
    </div>
  );
}
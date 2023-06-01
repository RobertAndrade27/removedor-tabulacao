import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function App() {
  const [data, setData] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [modifiedData, setModifiedData] = useState('');
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [nomeArquivo, setNomeArquivo] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;
      const rows = fileContent.split('\n').map(row => row.split('\t'));
      setData(rows);
    };

    reader.readAsText(file);
  };

  const handleColumnSelect = (index) => {
    const isSelected = selectedColumns.includes(index);
    if (isSelected) {
      setSelectedColumns(selectedColumns.filter(colIndex => colIndex !== index));
    } else {
      setSelectedColumns([...selectedColumns, index]);
    }
  };

  const handleGenerateFile = () => {
    const modifiedRows = data.map(row => {
      const modifiedRow = row.filter((_, index) => selectedColumns.includes(index));
      return modifiedRow.join('\t');
    });

    const modifiedContent = modifiedRows.join('\n');
    setModifiedData(modifiedContent);
    setShowDownloadButton(true);
  };

  const handleDownloadFile = () => {
    const modifiedBlob = new Blob([modifiedData], { type: 'text/plain;charset=utf-8' });
    saveAs(modifiedBlob, nomeArquivo.length > 0 ?  `${nomeArquivo}.txt` : 'arquivo.txt');
  };

  return (
    <div>
      <h2>Leitor de tabulação TXT</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />

      {data.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                {data[0].map((column, index) => (
                  <th key={index}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedColumns.includes(index)}
                        onChange={() => handleColumnSelect(index)}
                      />
                     
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleGenerateFile}>Gerar Arquivo Modificado</button>
        </div>
      )}

      {modifiedData && (
        <div>
          <h2>Arquivo Modificado:</h2>
          <pre>{modifiedData}</pre>
          {showDownloadButton && (
            <>
            digite o nome do arquivo
            <input onChange={(e) => setNomeArquivo(e.target.value) } value={nomeArquivo} label="Digite o nome"/>
            <button onClick={handleDownloadFile}>Baixar Arquivo Modificado</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
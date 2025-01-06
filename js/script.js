    function generateDataInputs() {
      const numSets = document.getElementById('numSets').value;
      const inputsContainer = document.getElementById('inputsContainer');
      inputsContainer.innerHTML = ''; // Clear previous inputs

      for (let i = 1; i <= numSets; i++) {
        // Buat form input untuk judul dan data
        const inputForm = `
          <div id="set${i}">
            <h3>Set Data ${i}</h3>
            <label for="title${i}">Masukkan judul (misalnya "Hari ke-${i}"):</label>
            <input type="text" id="title${i}" placeholder="Contoh: Hari ke-${i}">
            
            <label for="data${i}">Masukkan data (pisahkan dengan koma):</label>
            <input type="text" id="data${i}" placeholder="Contoh: 1,1,2,3,4">
          </div>
        `;
        inputsContainer.innerHTML += inputForm;
      }

      // Tambahkan tombol hitung
      const calculateButton = `<button onclick="calculate()">Hitung Semua</button>`;
      inputsContainer.innerHTML += calculateButton;
    }

    function processDataWithDetails(data, title) {
        let freqMap = {};
        data.forEach(value => {
            freqMap[value] = (freqMap[value] || 0) + 1;
        });

        let xi = Object.keys(freqMap).map(Number);
        let fi = Object.values(freqMap);
        let n = fi.reduce((sum, value) => sum + value, 0);
        let fi_xi = xi.map((value, index) => value * fi[index]);
        let sum_fi_xi = fi_xi.reduce((sum, value) => sum + value, 0);
        let mean = sum_fi_xi / n;

        let xi_minus_mean = xi.map(value => value - mean);
        let xi_minus_mean_squared = xi_minus_mean.map(value => Math.pow(value, 2));
        let fi_xi_minus_mean_squared = xi_minus_mean_squared.map((value, index) => value * fi[index]);
        let sum_fi_xi_minus_mean_squared = fi_xi_minus_mean_squared.reduce((sum, value) => sum + value, 0);

        let abs_diff = xi.map(value => Math.abs(value - mean));
        let sum_abs_diff = abs_diff.reduce((sum, value, index) => sum + value * fi[index], 0);
        let mean_deviation_result = sum_abs_diff / n;

        let variance = sum_fi_xi_minus_mean_squared / (n - 1);
        let std_deviation = Math.sqrt(variance);

        // Tampilkan hasil perhitungan untuk setiap data
        let resultHTML = `
          <div class="result-section">
            <h3>${title}</h3>
            <table>
              <thead>
                <tr>
                  <th>xi</th>
                  <th>fi</th>
                  <th>fi.xi</th>
                  <th>(xi - x̅)²</th>
                  <th>fi.(xi - x̅)²</th>
                </tr>
              </thead>
              <tbody>
        `;
        xi.forEach((value, index) => {
            resultHTML += `
              <tr>
                <td>${value}</td>
                <td>${fi[index]}</td>
                <td>${fi[index]} * ${value} = ${fi_xi[index].toFixed(2)}</td>
                <td>(${value} - ${mean.toFixed(2)})² = ${xi_minus_mean_squared[index].toFixed(2)}</td>
                <td>${fi[index]} * ${xi_minus_mean_squared[index].toFixed(2)} = ${fi_xi_minus_mean_squared[index].toFixed(2)}</td>
              </tr>
            `;
        });
        resultHTML += `
              </tbody>
              <tfoot>
                <tr>
                  <td>Total</td>
                  <td>${n}</td>
                  <td>${sum_fi_xi.toFixed(2)}</td>
                  <td></td>
                  <td>${sum_fi_xi_minus_mean_squared.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
        `;

        // Tampilkan rumus dan hasil
        resultHTML += `
          <h4>Rumus dan Hasil Perhitungan</h4>
          <p><strong>Rumus Mean (x̅):</strong> Σ(fi.xi) / Σfi</p>
          <p>Mean (x̅) = ${sum_fi_xi.toFixed(2)} / ${n}</p>
          <p>Mean (x̅) = ${mean.toFixed(2)}</p>
          
          <p><strong>Rumus Deviasi Rata-rata:</strong> Σ|xi - x̅| / n</p>
          <p>Deviasi Rata-rata = ${sum_abs_diff.toFixed(2)} / ${n}</p>
          <p>Deviasi Rata-rata = ${mean_deviation_result.toFixed(2)}</p>
          
          <p><strong>Rumus Variansi (s²):</strong> Σ(fi.(xi - x̅)²) / (n - 1)</p>
          <p>Variansi (s²) = ${sum_fi_xi_minus_mean_squared.toFixed(2)} / (${n} - 1)</p>
          <p>Variansi (s²) = ${variance.toFixed(6)}</p>
          
          <p><strong>Rumus Standar Deviasi (s):</strong> √Variansi</p>
          <p>Standar Deviasi (s) = √${variance.toFixed(6)}</p>
          <p>Standar Deviasi (s) = ${std_deviation.toFixed(4)}</p>
        </div>
        `;
        
        // Tampilkan hasil di container
        document.getElementById('resultsContainer').innerHTML += resultHTML;
    }

    // Fungsi untuk menghitung semua data
    function calculate() {
        let numSets = document.getElementById('numSets').value;
        let resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = ''; // Clear previous results

        for (let i = 1; i <= numSets; i++) {
            let title = document.getElementById(`title${i}`).value;
            let input = document.getElementById(`data${i}`).value;
            let data = input.split(',').map(Number);
            
            // Proses data dan tampilkan hasilnya
            processDataWithDetails(data, title);
        }
    }
document.getElementById('risk-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  // 1. Gather inputs from the form
  const age = parseInt(document.getElementById('age').value, 10);
  const heightCm = parseInt(document.getElementById('heightCm').value, 10);
  const weightKg = parseFloat(document.getElementById('weightKg').value);
  const bpCategory = document.getElementById('bpCategory').value;

  // 2. Basic front-end validation
  if (!bpCategory) {
    alert("Please select a blood pressure category");
    return;
  }
  if (heightCm < 60) {
    alert("Height must be at least 60 cm");
    return;
  }
  if (age <= 0) {
    alert("Age must be a positive number");
    return;
  }
  if (weightKg <= 0) {
    alert("Weight must be a positive number");
    return;
  }

  // 3. Collect family history (checkboxes)
  const diseases = [];
  if (document.getElementById('diabetes').checked) diseases.push('diabetes');
  if (document.getElementById('cancer').checked) diseases.push('cancer');
  if (document.getElementById('alz').checked) diseases.push('alzheimer');

  // 4. Create the request payload
  const payload = {
    age,
    heightCm,
    weightKg,
    bpCategory,
    diseases
  };

  try {
    // 5. Send data to server
    const response = await fetch('https://health-insurance-api-cvbxb6dsd2gyanfp.uaenorth-01.azurewebsites.net/api/calculateRisk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Unknown error');
    }

    // 6. Parse the JSON result from server
    const resultData = await response.json();

    // 7. Update the results section
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
      <p><strong>Age:</strong> ${age}</p>
      <p><strong>Height (cm):</strong> ${heightCm}</p>
      <p><strong>Weight (kg):</strong> ${weightKg}</p>
      <p><strong>Blood Pressure Category:</strong> ${bpCategory}</p>
      <p><strong>Family Diseases:</strong> ${diseases.join(', ') || 'None'}</p>
      <hr>
      <p><strong>Total Points:</strong> ${resultData.totalPoints}</p>
      <p><strong>Risk Category:</strong> ${resultData.riskCategory}</p>
    `;


    document.getElementById('resultsCard').style.display = 'block';

  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});
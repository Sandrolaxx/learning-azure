const form = document.getElementById('boletoForm');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');
const barcodeImg = document.getElementById('barcodeImg');
const barcodeText = document.getElementById('barcodeText');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async function (e) {
  e.preventDefault();
  errorDiv.style.display = 'none';
  resultDiv.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Gerando...';

  const amount = form.amount.value;
  const dueDate = form.dueDate.value;

  try {
    const response = await fetch('https://bankslip-app.azurewebsites.net/api/generate-bankslip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dueDate: dueDate,
        amount: parseFloat(amount)
      })
    });

    if (!response.ok) throw new Error('Erro ao gerar boleto');

    const data = await response.json();

    if (!data.imageBase64 || !data.barcode) throw new Error('Resposta inválida da API');

    barcodeImg.src = 'data:image/png;base64,' + data.imageBase64;
    barcodeImg.style.display = 'block';
    barcodeText.textContent = data.barcode;
    resultDiv.style.display = 'block';
  } catch (err) {
    errorDiv.textContent = 'Não foi possível gerar o boleto.';
    errorDiv.style.display = 'block';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Gerar boleto';
  }
});

const validateForm = document.getElementById('validateForm');
const validateErrorDiv = document.getElementById('validateError');
const validateResultDiv = document.getElementById('validateResult');
const validateAmount = document.getElementById('validateAmount');
const validateDueDate = document.getElementById('validateDueDate');
const validateBarcode = document.getElementById('validateBarcode');
const validateBtn = document.getElementById('validateBtn');

validateForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  validateErrorDiv.style.display = 'none';
  validateResultDiv.style.display = 'none';
  validateBtn.disabled = true;
  validateBtn.textContent = 'Validando...';

  const barcode = validateForm.barcode.value;

  try {
    const response = await fetch('https://bankslip-app.azurewebsites.net/api/validate-bankslip', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ barcode })
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Erro ao validar código de barras');

    validateAmount.textContent = data.amount.toFixed(2);
    validateDueDate.textContent = data.dueDate;
    validateBarcode.textContent = data.barcode;
    validateResultDiv.style.display = 'block';
  } catch (err) {
    validateErrorDiv.textContent = err.message;
    validateErrorDiv.style.display = 'block';
  } finally {
    validateBtn.disabled = false;
    validateBtn.textContent = 'Validar';
  }
});
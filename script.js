// script.js
// Basic logic: read form values, insert into template, and allow PDF download via html2pdf.js

// Helpers
const $ = (id) => document.getElementById(id);

function formatDateInput(dateStr) {
  if (!dateStr) return "[StartDate]";
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, opts);
}

function todayFormatted() {
  const d = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString(undefined, opts);
}

// Generate the offer letter from form fields
function generateLetter() {
  const candidate = $('candidateName').value.trim() || '[CandidateName]';
  const position = $('position').value.trim() || '[Position]';
  const company = $('companyName').value.trim() || '[CompanyName]';
  const startDate = formatDateInput($('startDate').value) || '[StartDate]';
  const salary = $('salary').value.trim() || 'As discussed';
  const hrName = $('hrName').value.trim() || '[HRName]';
  const logoURL = $('logoURL').value.trim();

  // Logo preview
  const logoPreview = $('logoPreview');
  if (logoURL) {
    logoPreview.src = logoURL;
    logoPreview.style.display = 'block';
  } else {
    logoPreview.style.display = 'none';
  }

  // Populate fields in preview
  $('offerDate').textContent = `Date: ${todayFormatted()}`;
  $('dearLine').innerHTML = `Dear ${candidate},`;
  $('mainParagraph').innerHTML = `We are pleased to offer you the position of <strong>${position}</strong> at <strong>${company}</strong>. Your expected start date is <strong>${startDate}</strong>.`;
  $('salaryParagraph').innerHTML = `Compensation: <strong>${salary}</strong>`;
  $('hrSignature').textContent = hrName || '[HRName]';
  $('companySignature').textContent = company || '[CompanyName]';

  // Scroll to preview
  document.querySelector('.preview-section').scrollIntoView({behavior:'smooth'});
}

// Download the offer letter as PDF using html2pdf.js
function downloadPDF() {
  const element = $('offerLetter');

  // Optional: update letter before download
  generateLetter();

  const opt = {
    margin:       10,
    filename:     'Offer_Letter.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Use html2pdf
  html2pdf().set(opt).from(element).save();
}

// Reset form and preview to placeholders
function resetAll() {
  $('offerForm').reset();
  $('logoPreview').style.display = 'none';
  // Reset preview placeholders
  $('offerDate').textContent = 'Date: ';
  $('dearLine').textContent = 'Dear [CandidateName],';
  $('mainParagraph').textContent = 'We are pleased to offer you the position of [Position] at [CompanyName]. Your expected start date is [StartDate].';
  $('salaryParagraph').textContent = 'Compensation: [Salary]';
  $('hrSignature').textContent = '[HRName]';
  $('companySignature').textContent = '[CompanyName]';
}

// Attach events
document.addEventListener('DOMContentLoaded', () => {
  $('generateBtn').addEventListener('click', generateLetter);
  $('downloadBtn').addEventListener('click', downloadPDF);
  $('resetBtn').addEventListener('click', resetAll);

  // Initialize preview with placeholders and today's date
  $('offerDate').textContent = `Date: ${todayFormatted()}`;
});

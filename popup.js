document.addEventListener('DOMContentLoaded', () => {
  const targetLanguageSelect = document.getElementById('targetLanguageSelect');
  const saveButton = document.getElementById('saveButton');

  // Load saved target language
  chrome.storage.sync.get('targetLang', (data) => {
    if (data.targetLang) {
      targetLanguageSelect.value = data.targetLang;
    }
  });

  // Save selected target language
  saveButton.addEventListener('click', () => {
    const targetLang = targetLanguageSelect.value;
    chrome.storage.sync.set({ targetLang }, () => {
      console.log('Target language saved:', targetLang);
      window.close();
    });
  });
});
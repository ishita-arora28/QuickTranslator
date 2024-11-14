chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    const selection = window.getSelection();
    if (selection.rangeCount === 0) return; // Ensure there is a selected text

    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = 'yellow';
    range.surroundContents(span);

    chrome.storage.sync.get('targetLang', (data) => {
      const targetLang = data.targetLang || 'en';
      chrome.runtime.sendMessage(
        { action: "translate", text: request.text, targetLang: targetLang },
        (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
            return;
          }

          if (response && response.translatedText) {
            span.title = response.translatedText;
          } else {
            console.error("Translation failed or response is undefined");
          }
        }
      );
    });
    return true; 
  }
});

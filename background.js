chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateSelection",
    title: "Translate selection",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateSelection") {
    chrome.tabs.sendMessage(tab.id, {
      action: "translate",
      text: info.selectionText
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "translate") {
    chrome.storage.sync.get('targetLang', (data) => {
      const targetLang = data.targetLang || 'en'; // Default to English if not set
      translateText(request.text, targetLang)
        .then(translatedText => {
          sendResponse({ translatedText: translatedText });
        })
        .catch(error => {
          console.error("Translation error:", error);
          sendResponse({ error: "Translation failed" });
        });
    });
    return true;
  }
});

async function translateText(text, targetLang) {
  // Encode the text for use in URL
 
  const instance_url = `https://lingva.ml/api/v1/auto/${targetLang}/${text}`;
  try {
    const response = await fetch(instance_url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) {
      throw new Error(`Translation failed with status ${response.status}`);
    }
    const data = await response.json();
    return data.translation;
  }
  catch (error) {
    console.error("Error in translation", error);
    throw error;
  }
}
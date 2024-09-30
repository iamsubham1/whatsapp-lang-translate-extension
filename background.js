console.log("Background script loaded");

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
    chrome.contextMenus.create({
        id: "translateText",
        title: "Translate Text",
        contexts: ["selection"]
    }, () => {
        if (chrome.runtime.lastError) {
            console.error("Error creating context menu:", chrome.runtime.lastError);
        } else {
            console.log("Context menu created successfully");
        }
    });
});

// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info) => {
    console.log("Context menu clicked", info);
    if (info.menuItemId === "translateText") {
        const selectedText = info.selectionText;
        console.log("Selected text:", selectedText);
        const targetLanguage = "es"; // Set target language (e.g., 'es' for Spanish)

        translateText(selectedText, targetLanguage);
    }
});

// Translate function using Google Translate
function translateText(text, targetLang) {
    const url = `https://translation.googleapis.com/language/translate/v2?key="enter key here "&q=${encodeURIComponent(text)}&target=${targetLang}`;

    // console.log("Fetching translation from URL:", url); // Log the fetch URL

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("API Response:", data); // Log the entire API response
            if (data.data && data.data.translations.length > 0) {
                const translatedText = data.data.translations[0].translatedText;
                console.log("Translated Text:", translatedText); // Log the translated text
                showNotification(`Translated Text: ${translatedText}`);
            } else {
                showNotification("Translation error: No translation found.");
            }
        })
        .catch(error => {
            console.error("Translation error:", error);
            showNotification("Translation error: " + error.message);
        });
}
// Function to show notifications
function showNotification(translatedText) {
    chrome.notifications.create({
        type: "basic",
        iconUrl: "hello_extensions.png",
        title: "Translation",
        message: translatedText,
        priority: 2
    });
}

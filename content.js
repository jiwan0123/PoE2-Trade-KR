(async function () {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL("translateData.js");
    script.type = "text/javascript";
    document.body.appendChild(script);
    console.log("Translation script injected!");
})();

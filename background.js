browser.browserAction.onClicked.addListener(async () => {
    const initialUrl = "https://poe.game.daum.net";
    const loginUrl = "https://poe.game.daum.net/login/transfer?redir=%2F";
    const finalUrl = "https://www.pathofexile.com/trade2/search/poe2/Standard";

    console.log(`Navigating to ${initialUrl}...`);
    let tab = await browser.tabs.create({ url: initialUrl });

    // 초기 페이지 로딩 완료 대기
    await waitForTabLoad(tab.id);

    console.log(`${initialUrl} loaded. Retrieving cookies...`);
    let cookies = await browser.cookies.getAll({ domain: "poe.game.daum.net" });
    if (!cookies || cookies.length === 0) {
        console.warn("No cookies found for poe.game.daum.net.");
        return;
    }

    // 쿠키 문자열 조합
    const cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join("; ");
    console.log("Retrieved cookies:", cookieString);

    // 로그인 URL로 이동
    console.log(`Navigating to ${loginUrl}...`);
    await browser.tabs.update(tab.id, { url: loginUrl });
    await waitForTabLoad(tab.id);

    console.log(`${loginUrl} loaded. Injecting cookies...`);

    // 쿠키 주입
    await browser.tabs.executeScript(tab.id, {
        code: `document.cookie = ${JSON.stringify(cookieString)}; console.log("Injected cookies:", document.cookie);`
    });

    console.log("Cookies injected successfully.");

    // 최종 URL로 이동
    console.log(`Navigating to final URL: ${finalUrl}`);
    await browser.tabs.update(tab.id, { url: finalUrl });
    await waitForTabLoad(tab.id);

    console.log("Final page loaded");
});

function waitForTabLoad(tabId) {
    return new Promise((resolve) => {
        function listener(updatedTabId, changeInfo) {
            if (updatedTabId === tabId && changeInfo.status === "complete") {
                browser.tabs.onUpdated.removeListener(listener);
                resolve();
            }
        }
        browser.tabs.onUpdated.addListener(listener);
    });
}

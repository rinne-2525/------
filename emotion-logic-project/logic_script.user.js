// ==UserScript==
// @name         お絵かきロジック・ハイライト連動(修正版)
// @namespace    http://tampermonkey.net/
// @version      0.5
// @match        *://*.minicgi.net/logic/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_URL = "http://localhost:5000/get_command";

    function highlightCell(x, y) {
        // ページ側の変数を参照（unsafeWindowを使うとより確実です）
        const size = window.size || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.size : null);
        const dpX = window.dpX || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.dpX : null);
        const dpY = window.dpY || (typeof unsafeWindow !== 'undefined' ? unsafeWindow.dpY : null);
        
        const cvs = document.getElementById("cvs_logic");
        if (!cvs || !size) {
            console.log("キャンバスまたはサイズ変数が見つかりません");
            return;
        }
        const ctx = cvs.getContext("2d");

        ctx.fillStyle = "rgba(255, 255, 0, 0.7)";
        ctx.fillRect(dpX + x * size + 2, dpY + y * size + 2, size - 4, size - 4);
        console.log(`[Python指示] 座標(${x}, ${y}) をハイライトしました`);
    }

    function poll() {
        GM_xmlhttpRequest({
            method: "GET",
            url: SERVER_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    if (data.command === "highlight") {
                        highlightCell(data.x, data.y);
                    }
                } catch (e) { /* idle時は無視 */ }
            },
            onerror: function(err) {
                console.error("サーバーに接続できません。Pythonを実行中ですか？");
            }
        });
    }

    // 1秒ごとに確認
    setInterval(poll, 1000);
    console.log("ハイライト待機中（HTTPS対応版）...");
})();
// ==UserScript==
// @name         お絵かきロジック・ハイライト連動
// @match        http://*.minicgi.net/logic/*
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function() {
    'use strict';

    const SERVER_URL = "http://localhost:5000/get_command";

    // --- ハイライト用の関数 ---
    function highlightCell(x, y) {
        // ゲーム側の変数を参照
        const size = window.size;
        const dpX = window.dpX;
        const dpY = window.dpY;
        const cvs = document.getElementById("cvs_logic");
        if (!cvs) return;
        const ctx = cvs.getContext("2d");

        // 描画
        ctx.fillStyle = "rgba(255, 255, 0, 0.7)"; // 半透明の黄色
        ctx.fillRect(dpX + x * size + 2, dpY + y * size + 2, size - 4, size - 4);
        console.log(`[Python指示] 座標(${x}, ${y}) をハイライトしました`);
    }

    // --- サーバーへの問い合わせ ---
    function poll() {
        GM_xmlhttpRequest({
            method: "GET",
            url: SERVER_URL,
            onload: function(response) {
                try {
                    const data = JSON.parse(response.responseText);
                    
                    if (data.command === "highlight") {
                        // Pythonからハイライト指示が来たら実行
                        highlightCell(data.x, data.y);
                    }
                } catch (e) { console.error("JSON解析エラー", e); }
            }
        });
    }

    // 1秒ごとに確認
    setInterval(poll, 1000);
    console.log("ハイライト待機中...");
})();
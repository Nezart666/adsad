// ==UserScript==
// @name         Sanctuary Connector WORKING DUMBASS.
// @version      0.1
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// ==/UserScript==

(function() {
    let ws = window.WebSocket;
    class Sanctuary extends ws {
        constructor(){
            super('wss://fir-almond-plant.glitch.me/moomoo'); // better? u happy now? its set to moomoo dipshit.
        }
    }
    window.WebSocket = Sanctuary;


    let open = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function(method) {
        let url = arguments[1];

        if (url) {
            if (url.endsWith("/serverData")) {
                return open.apply(this, ['GET', 'data:application/json;base64,eyJzY2hlbWUiOiJtbV9wcm9kIiwic2VydmVycyI6W3siaXAiOiJfIiwic2NoZW1lIjoibW1fcHJvZCIsInJlZ2lvbiI6InZ1bHRyOjkiLCJpbmRleCI6MCwiZ2FtZXMiOlt7InBsYXllckNvdW50IjowLCJpc1ByaXZhdGUiOmZhbHNlfV19XX0K']);
            }
        }

        return open.apply(this, arguments);
    };

    if (window.location.href.includes("?server=") && !window.location.href.includes("?server=9:0:0")) {
        window.location = "//" + window.location.host;
    }
})();

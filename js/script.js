import {ClientSearch as Client} from "./client.js"

const form = document.getElementById("AppleTVSearch");

function copyClipboard(target) {
    const text = target.textContent;
    navigator.clipboard.writeText(target.innerHTML);
    target.textContent = 'Copied!';
    setTimeout(function() {
        target.textContent = text
    }, 500);
}

window.addEventListener("load", function() {
    form.addEventListener("submit", function(event) {
        function copyClipboard(target) {
            const text = target.textContent;
            navigator.clipboard.writeText(target.innerHTML);
            target.textContent = 'Copied!';
            setTimeout(function() {
                target.textContent = text
            }, 500);
        }
        event.preventDefault();
        let query = document.getElementById("query").value;
        let storefront = document.getElementById("storefront").value;
        let contentType = document.getElementById("content-type").value;
        const client = new Client(query, storefront, contentType);
        client.fetchAsync()
        .then(response => client.renderResult(response.data)
        )
        .catch(reason => console.log(reason.message))
    });
});
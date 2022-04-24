const api_itunes = "https://uts-api.itunes.apple.com/uts/v2/search/incremental?";
const form = document.getElementById("AppleTVSearch");
const locales = {
    '143503': 'pt-BR',
    '143441': 'en-US',
    '143444': 'en-GB'
}

String.prototype.format = function(args) {
    let text = this;
    for(var attr in args){
        text = text.split('{' + attr + '}').join(args[attr]);
    }
    return text;
};

function copyClipboard(target) {
    navigator.clipboard.writeText(target.innerHTML);
    let text = target.textContent
    target.textContent = 'Copied!'
    setTimeout(function() {
        target.textContent = text
    }, 500)
}

window.addEventListener("load", function() {
    async function fetchAsync(url, query_search, storefront, language_locale) {
        let response = await fetch(url + new URLSearchParams({
            sf: storefront,
            locale: language_locale,
            caller: 'wta',
            utsk: '6e3013c6d6fae3c2::::::235656c069bb0efb',
            v: '56',
            pfm: 'web',
            q: query_search
        }));
        return await response.json();
    }

    function makeHTML(){
        let html = '{div}{href}{h2}';
        let div = '<div class="movie-result"><div class="title-year"><h1>{title}{year}</h1></div>';
        let href = '<a href="{href}" target="_blank" class="imglink"><img src="{src}" alt="Artwork for {title}{year}"></a>';
        let h2 = '<h2 class="apple-id" title="Copy Apple Id to Clipboard" onclick="copyClipboard(this)">{id}</h2>';
        return html.format({'div': div, 'href': href, 'h2': h2});
    }

    function renderResult(data={}){
        let div_results = document.getElementById("results");
        if(!data.canvas.shelves.length){
            div_results.innerHTML = "<h2>No results found.</h2>";
            return;
        }

        div_results.innerHTML = "";
        let shelves = data.canvas.shelves[0].title.toLowerCase() === 'filmes' ? data.canvas.shelves[0] : data.canvas.shelves[1];
        shelves.items.forEach(result => {
            let releaseYear = new Date(result.releaseDate).getFullYear();
            releaseYear = releaseYear ? ' ' + releaseYear : '';
            let image_url = result.images.coverArt16X9.url.format(
                {'w': '1920', 'h': '1080', 'f': 'jpg'}
            );
            div_results.innerHTML += makeHTML().format({'href': result.url, 'src': image_url, 'id': result.id, 'title': result.title, 'year': releaseYear});
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let store_front = document.getElementById("storefront").value;
        let query_search = document.getElementById("query").value;
        if(!query_search){
            return;
        }
        let locale = locales[store_front] || navigator.language || navigator.userLanguage;
        fetchAsync(api_itunes, query_search, store_front, locale)
        .then(response => renderResult(response.data)
        )
        .catch(reason => console.log(reason.message))
    });
});
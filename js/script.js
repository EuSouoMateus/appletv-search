window.addEventListener("load", function() {
    async function fetchAsync(url, query_search, storefront, language_locale) {
        let response = await fetch(url + new URLSearchParams({
            sf: storefront, // storefront code
            locale: language_locale, // language locale
            caller: 'wta',
            utsk: '6e3013c6d6fae3c2::::::235656c069bb0efb',
            v: '56', // version
            pfm: 'web', // platform
            q: query_search // movie name
        }));
        return await response.json();
    }

    String.prototype.format = function(args) {
        let text = this;
        for(var attr in args){
            text = text.split('{' + attr + '}').join(args[attr]);
        }
        return text
    };

    const api_itunes = "https://uts-api.itunes.apple.com/uts/v2/search/incremental?";
    const locale = "pt-BR" // window.navigator.userLanguage || window.navigator.language;
    const form = document.getElementById("AppleTVSearch");

    function renderResult(data={}){
        let div_results = document.getElementById("results");
        if(!data.canvas.shelves.length){
            div_results.innerHTML = "<h2>No results found.</h2>";
            return;
        }
        // results success
        div_results.innerHTML = "";
        let html_img = '<div class="movie-result"><div class="title-year"><h1>{title}{year}</h1></div><a href="{href}" target="_blank" class="imglink"><img src="{src}" alt="Artwork for {title}{year}"></a><h2>{id}</h2>';
        let shelves = data.canvas.shelves[0].title.toLowerCase() === 'filmes' ? data.canvas.shelves[0] : data.canvas.shelves[1];
        shelves.items.forEach(result => {
            let releaseYear = new Date(result.releaseDate).getFullYear();
            releaseYear = releaseYear ? ' ' + releaseYear : '';
            let image_url = result.images.coverArt16X9.url.format(
                {'w': result.images.coverArt16X9.width, 'h': result.images.coverArt16X9.height, 'f': 'jpg'}
            );
            div_results.innerHTML += html_img.format({'href': result.url, 'src': image_url, 'id': result.id, 'title': result.title, 'year': releaseYear});
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        let store_front = document.getElementById("storefront").value;
        let query_search = document.getElementById("query").value;
        if(!query_search){
            return;
        }
        fetchAsync(api_itunes, query_search, store_front, locale)
        .then(response => renderResult(response.data)
        )
        .catch(reason => console.log(reason.message))
    });
});

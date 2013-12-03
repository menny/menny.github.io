package threezeroone

import (
    "fmt"
    "net/http"
)

func init() {
    http.HandleFunc("/", handler)
}

func getRedirectUrl(r *http.Request) string {
    var targetUrl = "http://evendanan.net"
    if r.URL.Path == "/" {
        targetUrl += "/blog.html"
    } else {
        targetUrl += r.URL.Path  
    }
    return targetUrl;
}

func handler(w http.ResponseWriter, r *http.Request) {
    var targetUrl = getRedirectUrl(r)
    http.Redirect(w, r, targetUrl, 301)
    fmt.Fprint(w, "Redirecting to "+targetUrl)
}

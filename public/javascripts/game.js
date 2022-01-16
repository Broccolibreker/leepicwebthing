const socket = new WebSocket("ws://localhost:3000")
socket.onopen = function() {
    socket.send("hello");
}

socket.onmessage = function({data}) {
    if(data == "gamestart") {
        for(let element of document.getElementsByClassName("card")) {
            element.onclick = function(ev) {
                console.log(ev.target.id)
                if(socket) {
                    socket.send(JSON.stringify({action: ev.target.id, actionName: "card"}))
                }
            }
        }
    }
    const parent = document.getElementById("cardContainer")
    const replacable = document.getElementById(JSON.parse(data).card + "")
    const image = document.createElement("img")
    image.src = window.location.origin + "/images/" + JSON.parse(data).image
    image.style = "width: 10vw; height: 15vh; object-fit: fill; min-width: 10vw;"
    parent.replaceChild(image, replacable)

}

document.getElementById("play").onclick = function () {
    window.location.href = window.location.href
}

document.getElementById("menu").onclick = function () {
    window.location.href = window.location.origin
}


// const { default: axios } = require("axios");


const submitButton = document.getElementById('submitButton');
if (submitButton != null) {
    submitButton.addEventListener('click', async() => {

        await myFunction();

        // const newButton = document.createElement("button");
        // newButton.setAttribute("class", "button-gradient");
        // newButton.setAttribute("role", "button");
        // newButton.setAttribute("id", "startbutton");
        // var textSpan = document.createElement('span')
        // textSpan.innerHTML = 'Begin my AR Dining Experience';
        // textSpan.setAttribute("class", "text");
        // newButton.appendChild(textSpan);

        // const newDiv = document.getElementById("newdiv");
        // document.body.insertBefore(newButton, newDiv);
        // gradientButton = document.getElementById('startbutton');
        // gradientButton.style.display = "flex";
        submitButton.style.display = "none"; //button will disappear upon click
    });
}

async function myFunction() {
    var elements = document.getElementById("myForm").elements;
    var obj = {};
    for (var i = 0; i < elements.length; i++) {
        var item = elements.item(i);
        obj[item.name] = item.value;
    }
    document.getElementById("demo").innerHTML = JSON.stringify(obj);
    console.log('hii');
    console.log(obj);
    var myObject;
    await axios.get('http://localhost:3000/api/UK').then((response) => {
        myObject = response.data;

    });
    // await axios.get('http://localhost:3000/api/ukyd', { params: obj }).then((response) => {
    //     myObject = response.data;

    // });
    createVideoDivision(myObject);
    //return myObject;
}

//helper function which creates one division consisting of multiple video elements
//using the URLs fetched from API
async function createVideoDivision(reviewObject) {
    const objectLength = Object.keys(reviewObject).length;
    console.log(objectLength);

    const currentDiv = document.getElementById("my-ar-container");
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", "newdiv");

    var videoUrl;
    var video;
    for (var i = 0; i < objectLength; i++) {
        videoUrl = reviewObject[i];
        video = createVideoElement(videoUrl);
        newDiv.appendChild(video);

    }
    document.body.insertBefore(newDiv, currentDiv);
}

///helper function which returns a video Element 
function createVideoElement(videoUrl) {
    const video = document.createElement("video");
    if (video.canPlayType("video/mp4")) {
        video.setAttribute('src', videoUrl);
        video.setAttribute('preload', 'auto');
        video.setAttribute('crossorigin', 'anonymous');
        video.setAttribute('webkit-playsinline', 'webkit-playsinline');
        video.setAttribute('playsinline', 'playsinline');
        video.setAttribute('loop', 'true');
        video.setAttribute('style', 'display: none; ');
        video.setAttribute('class', 'chroma-vid');
    }
    return video;
}
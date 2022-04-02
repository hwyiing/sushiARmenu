import { createChromaMaterial } from '/chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;
//const baseUrl = process.env.baseURL || "http://localhost:3000"
const baseUrl = window.location.origin || "http://localhost:3000"

const cloudinaryfetch = async() => {

    await axios.get(`${baseUrl}/api`).then((response) => {
        const myObject = response.data;
        createVideoDivision(myObject);
    });
    const delayInMilliseconds = 1000; //1 second

    setTimeout(function() {
        //your code to be executed after 1 second
    }, delayInMilliseconds);
    const startButton = document.getElementById('startbutton');
    startButton.style.visibility = "visible"; //button will appear upon load
}

window.addEventListener('load', (event) => {

    cloudinaryfetch();
});

document.addEventListener('DOMContentLoaded', () => {
    //function to fetch videos and create a div of the video elements 
    let loadedChromaVids = null;

    const init = async() => {

        // pre-load videos by getting the DOM elements
        const loadVideos = async(associatedId) => {
            const loadedVideos = await document.querySelectorAll(associatedId);
            for (const vid of loadedVideos) {
                // vid.play();
                // vid.pause();
                vid.load();
            }
            return loadedVideos;
        }
        loadedChromaVids = await loadVideos(".chroma-vid");

        //should listen for clicks only after first page
        var eventHandler = function(e) {
            start();
            // remove this handler
            document.body.removeEventListener('click', eventHandler, false);
        }
        document.body.addEventListener("click", eventHandler);
    }

    const start = async() => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector("#my-ar-container"),
            imageTargetSrc: 'targets-two.mind',

        });
        const { renderer, scene, camera } = mindarThree;

        const anchors = new Array();
        for (var i = 0; i < loadedChromaVids.length; i++) {

            const GSvideo = loadedChromaVids[i];
            const GSplane = createGSplane(GSvideo, 1, 3 / 4);

            anchors.push(mindarThree.addAnchor(i));
            if (i < anchors.length) {
                const anchor = anchors[i];

                anchor.group.add(GSplane);

                anchor.onTargetFound = () => {
                    // video.muted = false;
                    GSvideo.play();
                }
                anchor.onTargetLost = () => {
                    GSvideo.pause();
                }


            }

        }

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    function hideDiv() {
        const div = document.getElementById("welcome");
        div.classList.toggle('hidden');
    }

    //start button to overcome IOS browser
    const startButton = document.getElementById('startbutton');
    startButton.addEventListener('click', () => {

        init();
        hideDiv();
        startButton.style.display = "none"; //button will disappear upon click
    })

});


//helper functions

function createGSplane(GSvideo) {
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, 0x00ff38);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(2);
    //GSplane.position.z = 0.05;
    GSplane.rotation.z = Math.PI / 2;
    //GSplane.position.x = -0.2;

    return GSplane
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
    console.log(videoUrl);
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
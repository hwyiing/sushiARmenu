//start button to overcome IOS browser

// import { loadGLTF, loadVideo } from "../../libs/loader.js";
// import { LoadingManager } from "../../libs/three.js-r132/build/three.module.js";
// import { CSS3DObject } from '../../libs/three.js-r132/examples/jsm/renderers/CSS3DRenderer.js';

// import { createChromaMaterial } from '../chroma-video';
const THREE = window.MINDAR.IMAGE.THREE;

// function createVideo(videoUrl){
//     const video = document.createElement("video");
//         if (video.canPlayType("video/mp4")) {
//             video.setAttribute('src', videoUrl);
//             video.setAttribute('preload', 'auto');
//             video.setAttribute('crossorigin', 'anonymous');
//             video.setAttribute('webkit-playsinline', 'webkit-playsinline');
//             video.setAttribute('playsinline', '');
//             video.setAttribute('loop', 'true');
//         }
//     return video; 
// }


document.addEventListener('DOMContentLoaded', () => {

    let loadedTriggerVids, loadedChromaVids = null;

    const init = async() => {
        // pre-load videos by getting the DOM elements
        //loadedTriggerVids = await loadVideos(".trigger-vid");
        //loadedChromaVids = await loadVideos(".chroma-vid");

        //should listen for clicks only after first page
        var eventHandler = function(e) {
            start();
            // remove this handler
            document.body.removeEventListener('click', eventHandler, false);
            //console.log("Listened to event only once. Now deleting...");
        }
        document.body.addEventListener("click", eventHandler);
    }

    const start = async() => {
        const mindarThree = new window.MINDAR.IMAGE.MindARThree({
            container: document.querySelector("#my-ar-container"),
            imageTargetSrc: 'targets.mind',
            uiLoading: "#custom-loading",
        });
        const { renderer, scene, camera } = mindarThree;

        const anchors = new Array();

        // make this into another helper function later
        // depending on whether we assume no. of loaded vid same as overlay vid
        // need to adjust the ohter helper functions as well
        // for (var i = 0; i < loadedTriggerVids.length; i++) {

        //     const video = loadedTriggerVids[i];
        //     const GSvideo = loadedChromaVids[i];
        //     const plane = createVideoPlane(video, 1, 9 / 16);
        //     const GSplane = createGSplane(GSvideo, 1, 3 / 4);

        //     anchors.push(mindarThree.addAnchor(i));
        //     const anchor = anchors[i];

        //     anchor.group.add(plane);
        //     anchor.group.add(GSplane);
        //     anchor.onTargetFound = () => {
        //         video.muted = false;
        //         video.play();
        //         GSvideo.play();
        //     }
        //     anchor.onTargetLost = () => {
        //         video.pause();
        //         GSvideo.pause();
        //     }
        //     GSvideo.addEventListener('play', () => {
        //         GSvideo.currentTime = 2;
        //     });

        // }

        await mindarThree.start();
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });
    }

    function hideDiv(id) {
        document.getElementById(id).style.display = 'none';
    }

    function showDiv(id) {
        document.getElementById(id).style.display = 'block';
    }

    const startButton = document.getElementById('startbutton');
    startButton.addEventListener('click', () => {
        init();
        hideDiv("welcome");
        startButton.style.display = "none"; //button will disappear upon click
    });

});


//helper functions
function createVideoPlane(video, width, height) {
    const texture = new THREE.VideoTexture(video);
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const plane = new THREE.Mesh(geometry, material);
    plane.scale.multiplyScalar(1);
    plane.position.z = -0.1;
    return plane;
}

function createGSplane(GSvideo) {
    const colorCode = 0x00ff00;
    //0x82df94;
    //0xa89690;
    //0xe4fc64;
    //0x00ff38;
    const GStexture = new THREE.VideoTexture(GSvideo);
    const GSgeometry = new THREE.PlaneGeometry(1, 1080 / 1920);
    const GSmaterial = createChromaMaterial(GStexture, colorCode);
    const GSplane = new THREE.Mesh(GSgeometry, GSmaterial);
    GSplane.scale.multiplyScalar(2);
    GSplane.position.z = 0.05;
    return GSplane
}

const loadVideos = async(associatedId) => {
    var loadedVideos = await document.querySelectorAll(associatedId);
    for (const vid of loadedVideos) {
        console.log(vid.id, vid.src);
        vid.play();
        vid.pause();
    }
    return loadedVideos;
}
const {
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    RoomEvent,
} = LivekitClient
const url = 'wss://chat-app-oluzbac4.livekit.cloud';

const room = new LivekitClient.Room({
    audioCaptureDefaults: {
        autoGainControl: true,
        deviceId: '',
        echoCancellation: true,
        noiseSuppression: true,
    },
    videoCaptureDefaults: {
        deviceId: '',
        facingMode: 'user',
        resolution: {
        width: 1280,
        height: 720,
        frameRate: 30,
        },
    },
    publishDefaults: {
        videoEncoding: {
        maxBitrate: 1_500_000,
        maxFramerate: 30,
        },
        screenShareEncoding: {
        maxBitrate: 1_500_000,
        maxFramerate: 30,
        },
        audioBitrate: 20_000,
        dtx: true,
        // only needed if overriding defaults
        videoSimulcastLayers: [
        {
            width: 640,
            height: 360,
            encoding: {
            maxBitrate: 500_000,
            maxFramerate: 20,
            }
        },
        {
            width: 320,
            height: 180,
            encoding: {
            maxBitrate: 150_000,
            maxFramerate: 15,
            }
        }
        ]
    },
})

document.querySelector('#connect').addEventListener('click', function() {
    connectRoom()
})


async function connectRoom(roomId) {
    const {token} = await fetchJSON('/getToken')
    await room.connect(url, token)

    await room.localParticipant.enableCameraAndMicrophone()
    room
    .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
    .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
    .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
    .on(RoomEvent.Disconnected, handleDisconnect)
    .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
    .on(RoomEvent.TrackPublished, handleTrackPublished)

}

function handleTrackPublished(publication, participant) {
    publication.setSubscribed(true)
}

function handleTrackSubscribed(RemoteTrack, RemoteTrackPublication, RemoteParticipant) {
    // if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
        // attach it to a new HTMLVideoElement or HTMLAudioElement
        const elementRemote = RemoteTrack.attach();
        document.querySelector('#remoteVideo').appendChild(elementRemote);
        // const elementLocal = RemoteParticipant.attach();
    // }
}

function handleTrackUnsubscribed(
    RemoteTrack,
    RemoteTrackPublication,
    RemoteParticipant,
) {
// remove tracks from all attached elements
    RemoteTrack.detach();
}

function handleLocalTrackUnpublished(LocalTrackPublication, LocalParticipant) {
// when local tracks are ended, update UI to remove them from rendering
    LocalTrackPublication.detach();
}

function handleActiveSpeakerChange(Participant) {
    // show UI indicators when participant is speaking
}

function handleDisconnect() {
     console.log('disconnected from room');
}

async function fetchJSON(url, options = {}) {
    try {
        const response = await fetch('https://zany-puce-lamb-cap.cyclic.app/api' + url, options)
        if (!response.ok) {
            const data = await response.json()
            return alert(data.msg)
        }
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}
const {
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    RoomEvent,
} = LivekitClient
const url = 'wss://chat-app-oluzbac4.livekit.cloud';

const remoteVideo = document.querySelector('#remoteVideo')

let x = true

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
            width: 640,
            height: 360,
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
            // {
            //     width: 640,
            //     height: 360,
            //     encoding: {
            //     maxBitrate: 500_000,
            //     maxFramerate: 20,
            //     }
            // },
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
document.querySelector('#disconnect').addEventListener('click', function() {
    connectRoom()
})


async function connectRoom(roomId) {
    const {token} = await fetchJSON('/getToken')
    await room.connect(url, token)

    console.log('Connecting . . .')

    await room.localParticipant.setMicrophoneEnabled(true)

    room
    .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
    .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
    .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
    .on(RoomEvent.Disconnected, handleDisconnect)
    .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
    .on(RoomEvent.TrackPublished, handleTrackPublished)

}

function handleTrackPublished(publication, participant) {
    // console.log({participant, publication})
    // participant.setSubscribed(true)
    // publication.setSubscribed(true)
    if (x) connectRoom()
    x = false
}

function handleTrackSubscribed(RemoteTrack, RemoteTrackPublication, RemoteParticipant) {
        const elementRemote = RemoteTrack.attach()
        remoteVideo.innerHTML = ''
        remoteVideo.append(elementRemote)
}

function handleTrackUnsubscribed(
    RemoteTrack,
    RemoteTrackPublication,
    RemoteParticipant,
) {
// remove tracks from all attached elements
    RemoteTrack.detach();
    console.log('disconnecting . . .')
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
     console.log('Panggilan telah selesai');
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
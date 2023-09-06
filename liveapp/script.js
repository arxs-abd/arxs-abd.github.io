const {
    Participant,
    RemoteParticipant,
    RemoteTrack,
    RemoteTrackPublication,
    RoomEvent,
} = LivekitClient
const url = 'wss://chat-app-oluzbac4.livekit.cloud';

const remoteVideo = document.querySelector('#remoteVideo')
const status = document.querySelector('#status')
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
    },
})

room
    .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
    .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
    .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
    .on(RoomEvent.Disconnected, handleDisconnect)
    .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
    .on(RoomEvent.TrackPublished, handleTrackPublished)

document.querySelector('#connect').addEventListener('click', function() {
    status.innerText = 'Memanggil'
    connectRoom()
})
document.querySelector('#disconnect').addEventListener('click', async function() {
    await room.disconnect()
})


async function connectRoom(roomId) {
    const {token} = await fetchJSON('/getToken')
    await room.connect(url, token)

    console.log('Connecting . . .')

    await room.localParticipant.setMicrophoneEnabled(true)
    await room.localParticipant.setCameraEnabled(false)

}

function handleTrackPublished(publication, participant) {
    // console.log({participant, publication})
    // participant.setSubscribed(true)
    publication.setSubscribed(true)
    // if (x) connectRoom()
    // x = false
    status.innerText = 'Tersambung1'
}

function handleTrackSubscribed(RemoteTrack, RemoteTrackPublication, RemoteParticipant) {
        const elementRemote = RemoteTrack.attach()
        remoteVideo.innerHTML = ''
        remoteVideo.append(elementRemote)
        status.innerText = 'Tersambung'
}

async function handleTrackUnsubscribed(
    RemoteTrack,
    RemoteTrackPublication,
    RemoteParticipant,
) {
// remove tracks from all attached elements
    RemoteTrack.detach();
    console.log('disconnecting . . .')
    status.innerText = 'Terputus'
    await room.disconnect()
}

function handleLocalTrackUnpublished(LocalTrackPublication, LocalParticipant) {
// when local tracks are ended, update UI to remove them from rendering
    // LocalTrackPublication.detach();
}

function handleActiveSpeakerChange(Participant) {
    // show UI indicators when participant is speaking
}

async function handleDisconnect() {
    console.log('disconnected from room');
    console.log('Panggilan telah selesai');
    await room.localParticipant.setMicrophoneEnabled(false)
    await room.localParticipant.setCameraEnabled(false)
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
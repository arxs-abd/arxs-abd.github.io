const allBox = document.querySelectorAll('.kotak');
const broadcastChannel = new BroadcastChannel('matrix');

const pusher = new Pusher('914eb719506342bd7d28', {
    cluster: 'ap1'
});

pusher.subscribe('me-channel').bind('me-event', function(data) {
    const { box, block } = data;
    const targetBox = document.querySelector(`.kotak-kotak[data-kotak="${box}"]`);
    const targetKotak = targetBox.querySelector(`.kotak[data-id="${block}"]`);
    targetKotak.style.backgroundColor = 'black';
    targetKotak.style.color = 'white';
});

// broadcastChannel.onmessage = function(event) {
//     const { box, kotak } = event.data;
//     const targetBox = document.querySelector(`.kotak-kotak[data-kotak="${box}"]`);
//     const targetKotak = targetBox.querySelector(`.kotak[data-id="${kotak}"]`);

//     targetKotak.style.backgroundColor = 'black';
//     targetKotak.style.color = 'white';
// }

for (const box of allBox) {
    box.addEventListener('click', function() {
        box.style.backgroundColor = 'black';
        box.style.color = 'white';

        
    });
}
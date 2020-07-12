const checkVolume = () => {
    $('.volume-slider').val($('.volume-slider').val());
    $('#stream')[0].volume = $('.volume-slider').val();
};

$('.volume-slider')
.on('click', checkVolume)
.on('mousemove', checkVolume)
.on('mousedown', checkVolume)
.on('mouseup', checkVolume);
window.onload = () => { 
    $.getJSON("../package.json", data => {
        $("#ver").html(`v${data.version}`);
    })
    let count = 0;
    setInterval(() => {
        const cd = $("#cd");
        const delay = $("#del");
        const stream = $('#stream')[0];
        if(stream.paused) {
            count++
            delay.html(count);
            cd.fadeIn("slow");
        }
    }, 1000)
}

const togglePlay = () => {
    const stream = $('#stream');
    const button = $('.play-button');
    if (stream[0].paused) {
        button.removeClass('fa-play');
        button.removeClass('fa-pause');
        button.addClass('fa-spinner-third');
        stream.attr('src', 'https://stream.livida.net/keyfm');
        checkVolume();
        stream[0].play()
        .then(() => {
            button.removeClass('fa-play');
            button.removeClass('fa-spinner-third');
            button.addClass('fa-pause');
        })
        .catch(() => {
            button.removeClass('fa-pause');
            button.removeClass('fa-spinner-third');
            button.addClass('fa-play');
        });
    } else {
        stream[0].pause();
        button.removeClass('fa-pause');
        button.removeClass('fa-spinner-third');
        button.addClass('fa-play');
    };
};


const updateStats = () => {
    $.get('https://api.livida.net/api/radio/keyfm', (res) => {
        const {
            dj,
            song
        } = res.data;
        fetchJsonp('https://api.deezer.com/search/track/autocomplete?limit=1&q=' + song.name + ` ${song.artist}` + '&output=jsonp')
        .then(res => res.json())
        .then(res => {
            if (res.data[0]) {
                $('.song-art').attr('src', res.data[0].album.cover || `./assets/img/KeyFM.png`);
                $('.artist-image').attr('src', res.data[0].artist.picture || `./assets/img/KeyFM.png`);
            } else {
                $('.song-art').attr('src', `./assets/img/KeyFM.png`);
                $('.artist-image').attr('src', `./assets/img/KeyFM.png`);
            };
        })
        .catch((err) => {
            console.error(`Error whilst fetching from Deezer for ${song.name}:`, err);
            $('.song-art').attr('src', `./assets/img/KeyFM.png`);
            $('.artist-image').attr('src', `./assets/img/KeyFM.png`);
        });
        $('.song-title').text(song.name);
        $('.song-artist').text(song.artist);
        $('.dj-name').text(dj);
        const songText = `${song.name} by ${song.artist}`;
        if (window.prevSongText != songText) {
            $('.song-text').text(songText);
            if ($('.song-text').parent().prop('scrollHeight') > $('.song-text').parent().height() + 16) {
                const t = $('<div></div>').html(songText).text(),
                      m = `<marquee direction="right" scrollamount="8">${t}</marquee>`;
                $('.song-text').html(m);
            };
        };
        window.prevSongText = songText;
    })
    .fail((err) => {
        console.error(`Error whilst fetching song metadata:`, err);
        $('.song-art').attr('src', `./assets/img/KeyFM.png`);
        $('.artist-image').attr('src', `./assets/img/KeyFM.png`);
        $('.song-title').text('Stream Offline');
        $('.song-artist').text('Unknown');
        $('.dj-name').text('Stream Offline');
        $('.listeners').text('Unknown');
    });
};

updateStats();
setInterval(updateStats, 5000);
togglePlay();

$('.play-button').click(togglePlay);

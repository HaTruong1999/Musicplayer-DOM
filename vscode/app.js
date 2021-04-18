const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PlAYER_STORAGE_KEY = "F8_PLAYER"

const audio = $("#audio")
const cdThumb = $(".cd-thumb")
const heading = $("header h2")
const cd = $(".cd")
const playBtn = $(".btn-toggle-play")
const nextBtn = $(".btn-next")
const prevBtn = $(".btn-prev")
const randomBtn = $(".btn-random")
const repeatBtn = $(".btn-repeat")
const volumeIcon = $(".fa-volume-up")
const volumeBar = $(".volume-bar")
const volumeBarValue = $(".volume-bar-value")
const volumeArea = $(".btn-volume")
const playlist = $(".playlist")
const progressPlay = $(".progressPlay")
const player = $(".player")

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Anh Đếch Cần Gì Nhiều Ngoài em",
      singer: "Đen",
      path: "/assets/music/AnhDechCanGiNhieuNgoaiEm.mp3",
      image: "/assets/image/AnhDechCanGiNhieuNgoaiEm.jpg"
    },
    {
      name: "Bài Này Chill Phết",
      singer: "Đen ft Min",
      path: "/assets/music/BaiNayChillPhet.mp3",
      image: "/assets/image/BaiNayChillPhet.jpg"
    },
    {
      name: "Đi Theo Bóng Mặt Trời",
      singer: "Đen",
      path: "/assets/music/DiTheoBongMatTroi.mp3",
      image: "/assets/image/DiTheoBongMatTroi.jpg"
    },
    {
      name: "Đưa Nhau Đi Trốn",
      singer: "Đen",
      path: "/assets/music/DuaNhauDiTron.mp3",
      image: "/assets/image/DuaNhauDiTron.jpg"
    },
    {
      name: "At My Worst",
      singer: "Pink Sweat$",
      path: "/assets/music/AtMyWorst.mp3",
      image: "/assets/image/AtMyWorst.jpg"
    },
    {
      name: "Always Remember Us This Way",
      singer: "Lady Gaga",
      path: "/assets/music/AlwaysRememberUsThisWay.mp3",
      image: "/assets/image/AlwaysRememberUsThisWay.jpg"
    },
    {
      name: "Crying Over You",
      singer: "JustaTee, Binz",
      path: "/assets/music/CryingOverYou.mp3",
      image: "/assets/image/CryingOverYou.jpg"
    }
  ],
  setConfig: function (key, value) {
    this.config[key] = value

    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config))
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    if(this.currentIndex === 0){
      this.currentIndex = this.songs.length - 1
    } else{
      this.currentIndex--
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)

    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  handleEvents: function () {
    const _this = this
    const cdWidth = cd.offsetWidth

    // xử lí CD quay / dừng
    // Handle the CD spins / stops
    const cdThumbAnimate =cdThumb.animate([{ transform: "rotate(360deg)"}], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    // xử li phong to thu nhỏ CD
    // Handle CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    }

    // xử lí khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if(_this.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    } 

    // khi bài hát được play
    // when the song is played
    audio.onplay = function () {
      _this.isPlaying = true
      player.classList.add("playing")
      cdThumbAnimate.play()
      volumeBar.value = 100;
      volumeBarValue.style.width = "100%"
    }

    // khi bài hát bị dừng
    // when the song is paused
    audio.onpause = function () {
      _this.isPlaying = false
      player.classList.remove("playing")
      cdThumbAnimate.pause()
    }

    // khi tiến độ bài hát được thay đổi
    // when the songs's progress is changed
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        )
        progress.value = progressPercent
        progressPlay.style.width = Math.floor(progress.clientWidth * progress.value / 100) + "px"
      }
    }

    // khi bài hát được tua
    // when the song is seeked
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime
      progressPlay.style.width = Math.floor(progress.clientWidth * progress.value / 100) + "px"
    }

    // Xử lí bật / tắt random
    // Handling on / off random song
    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom
      _this.setConfig("isRandom", _this.isRandom)
      randomBtn.classList.toggle("active", _this.isRandom)
    }

    // when next song
    nextBtn.onclick = function (){
      if (_this.isRandom){
        _this.playRandomSong()
      } else {
        _this.nextSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // when prev song
    prevBtn.onclick = function() {
      if (_this.isRandom){
        _this.playRandomSong()
      }else {
        _this.prevSong()
      }
      audio.play()
      _this.render()
      _this.scrollToActiveSong()
    }

    // Xử lí khi lặp lại một bài hát
    // Single-parallel processing
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat
      _this.setConfig("isRepeat", _this.isRepeat)
      repeatBtn.classList.toggle("active", _this.isRepeat)
    }

    // xử lí chuyển bài khi bài hát kết thúc
    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    }

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e){
      const songNode = e.target.closest(".song:not(.active)")

      if (songNode || e.target.closest(".favorite")) {
        // Xử lí khi click vào song
        // handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index)
          _this.loadCurrentSong()
          _this.render()
          audio.play()
        }

        // Xử lí khi click vào song favorite
        if (e.target.closest(".favorite")) {
        }
      }
    }

    // Xử lí tăng giảm âm lượng
    // Handles the volume is changed
    volumeArea.onmouseover = function () {
      volumeBar.style.display = 'block';
      volumeBarValue.style.display = 'block';
      volumeIcon.style.color = '#ec1f55';
    }

    volumeArea.onmouseout = function () {
      volumeBar.style.display = 'none';
      volumeBarValue.style.display = 'none';
      volumeIcon.style.color = '#333';
    }

    volumeBar.onchange = function (e) {
      audio.volume = volumeBar.value / 100
      volumeBarValue.style.width = Math.floor(volumeBar.clientWidth * volumeBar.value / 100) + "px"
    }
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      })
    }, 300)
  },
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },
  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
      <div class="song ${
        index === this.currentIndex ? "active" : ""
      }" data-index="${index}">
          <div class="thumb"
              style="background-image: url('${song.image}')">
          </div>
          <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
          </div>
          <div class="favorite">
            <i class="fas fa-ellipsis-h"></i>
          </div>
      </div>
      `
    })
    playlist.innerHTML = htmls.join("")
  },
  start: function(){
    // gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // lắng nghe xử lí các sự kiện (DOM events)
    // listening / handling events (DOM events)
    this.handleEvents();

    //load current song
    this.loadCurrentSong();

    //render playlist
    this.render();
  }
}

app.start();

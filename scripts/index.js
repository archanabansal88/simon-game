const SimonGame = (function () {
  const obj = {
    green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
    red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
    blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
    yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3')
  }

  const colorArray = Object.keys(obj)

  class SimonGame {
    constructor (startButton, powerButton, strictButton, outerArea, center) {
      this.powerButton = powerButton
      this.startButton = startButton
      this.strictButton = strictButton
      this.outerArea = outerArea
      this.center = center
      this.isGameStarted = false
      this.isStrictMode = false
      this.init()
    }

    init () {
      this.attachEvent()
    }

    attachEvent () {
      this.powerButton.on('click', this.handlePowerClick.bind(this))
      this.startButton.on('click', this.handleStartClick.bind(this))
      this.strictButton.on('click', this.handleStrictClick.bind(this))
    }

    handlePowerClick () {
      this.isGameStarted = !this.isGameStarted
      this.powerButton.find('.input-button').toggleClass('isChecked')
      if (!this.isGameStarted) {
        this.center.find('.move-count').html('')
        clearTimeout(this.userTimer)
        clearTimeout(this.wrongTimer)
        this.isStrictMode = false
        this.center.find('.strict-light').removeClass('led-on')

        this.removeListener()
      } else {
        this.center.find('.move-count').html('--')
      }
    }
    handleStrictClick () {
      if (this.isGameStarted) {
        this.isStrictMode = !this.isStrictMode
        if (!this.isStrictMode) {
          this.center.find('.strict-light').removeClass('led-on')
        } else {
          this.center.find('.strict-light').addClass('led-on')
        }
      }
    }

    handleStartClick () {
      if (this.isGameStarted) {
        this.counter = 0
        this.count = 1
        this.moveArray = []
        this.center.find('.move-count').html(this.count)
        this.removeListener()
        this.generateRandomNumber()
        this.generateMove()
      }
    }

    generateRandomNumber () {
      var random = Math.round(Math.random() * (colorArray.length - 1))
      this.moveArray.push(colorArray[random])
      this.generateSound()
    }

    generateSound () {
      const { moveArray } = this
      for (let i = 0; i < moveArray.length; i++) {
        const colour = moveArray[i]
        this.playSound(colour, i)
      }
    }

    playSound (colour, i) {
      setTimeout(() => {
        this.outerArea.find('#' + colour).addClass('light')
        obj[colour].onended = () => {
          setTimeout(() => {
            this.outerArea.find('#' + colour).removeClass('light')
          }, 100)
        }
        obj[colour].play()
      }, 600 * i)
    }

    generateMove () {
      this.outerArea.on('click', '.outer', this.handleMoveClick.bind(this))
      this.outerArea.find('.outer').addClass('pointer')
      clearTimeout(this.userTimer)
      this.checkUserClick()
    }
    checkUserClick () {
      this.isUserClicked = false
      this.userTimer = setTimeout(() => {
        if (!this.isUserClicked) {
          this.handleWrongMove()
        }
      }, 5000)
    }

    removeListener () {
      this.outerArea.off('click', '**')
      this.outerArea.find('.outer').removeClass('pointer')
    }

    handleMoveClick (event) {
      this.isUserClicked = true
      clearTimeout(this.userTimer)
      const { moveArray } = this
      this.playSound(event.target.id, 0)
      if (event.target.id === moveArray[this.counter]) {
        this.counter++
        this.checkUserClick()

        this.handleIncrementCount()
      } else {
        this.handleWrongMove()
      }
    }
    handleIncrementCount () {
      if (this.counter === this.moveArray.length) {
        setTimeout(() => {
          if (this.count === 25) {
            this.center.find('.move-count').html('**')
            this.removeListener()

            setTimeout(() => {
              this.handleStartClick()
            }, 5000)
          } else {
            this.count++
            this.center.find('.move-count').html(this.count)
            this.counter = 0
            this.removeListener()
            this.generateRandomNumber()
            this.generateMove()
          }
        }, 2000)
      }
    }
    handleWrongMove () {
      this.center.find('.move-count').html('!!')

      this.wrongTimer = setTimeout(() => {
        if (this.isStrictMode) {
          this.handleStartClick()
        } else {
          this.counter = 0
          this.removeListener()
          this.generateSound()
          this.center.find('.move-count').html(this.count)
          this.generateMove()
        }
      }, 2000)
    }
  }

  return SimonGame
})();

(function () {
  new SimonGame($('.start'), $('.power-button'), $('.strict'), $('.outerArea'), $('.center'))
})()

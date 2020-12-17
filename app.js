document.addEventListener('DOMContentLoaded', () => {
  var currentValue = 0
  var nextInteger = 0
  var nextOperation = null
  var priorInteger = null
  var priorOperation = null

  function calculate () {
    if (nextOperation === '+') {
      currentValue += nextInteger
    } else if (nextOperation === '-') {
      currentValue -= nextInteger
    } else if (nextOperation === '*') {
      currentValue *= nextInteger
    } else if (nextOperation === '/') {
      currentValue /= nextInteger
    } else if (nextOperation === '%') {
      currentValue = currentValue % nextInteger
    }

    priorInteger = nextInteger
    priorOperation = nextOperation
    nextInteger = 0
    nextOperation = null
    updateOutput(currentValue)
    removeAllActive()
  }

  function control (e) {
    // Don't allow overflow
    if (currentValue === Number.POSITIVE_INFINITY || currentValue === Number.NEGATIVE_INFINITY || currentValue > Number.MAX_VALUE) {
      resetCalculator()
      return
    }
    if (e.keyCode !== undefined) {
      console.log("KEY:" +e.keyCode)
      var element = null
      switch (e.keyCode) {
        case 49:
          element = '#button1'
          break
        case 48:
          element = '#button0'
          break
        case 50:
          element = '#button2'
          break
        case 51:
          element = '#button3'
          break
        case 52:
          element = '#button4'
          break
        case 53:
          // they share a key code
          element = '#button5'
          if (e.key === '%') element = '#buttonmod'
          break
        case 54:
          element = '#button6'
          break
        case 55:
          element = '#button7'
          break
        case 56:
          element = '#button8'
          break
        case 57:
          element = '#button9'
          break
        case 67:
          element = '#buttonc'
          // make it have style
          document.querySelector(element).classList.add('active-elm')
          setTimeout(() => {
            removeAllActive()
          }, 100)
          break
        case 187:
          element = '#buttonadd'
          break
        case 190:
          element = '#buttonperiod'
          break
        case 189:
          element = '#buttonsubtract'
          break
        case 88:
          element = '#buttonmultiply'
          break
        case 13:
          element = '#buttonequals'
          break
        case 191:
          element = '#buttondiv'
          break
        case 192:
          element = '#buttonplusminus'
          break
        case 8:
          removeLastDigit()
          return
          break
      }

      // only process the key for keys that have a function
      if (element !== null) control(document.querySelector(element))
    } else {
      var elem
      if (e.target !== undefined || e.srcElement !== undefined) {
        elem = e.target || e.srcElement
      } else {
        elem = e
      }
      var number = elem.innerHTML
      // allow equal to perform prior calculation
      if (number === '=' && priorInteger && priorOperation && nextInteger === 0) {
        nextInteger = priorInteger
        nextOperation = priorOperation
        calculate()
        return
      }
      // then we're dealing with adding to current number
      if (Number.isInteger(parseInt(elem.innerHTML)) || elem.innerHTML === '0') {
        if (nextOperation === null) { // we should update the current value
          currentValue = parseFloat(currentValue.toString() + number)
          updateOutput(currentValue)
        } else { // we should update the nextInteger
          nextInteger = parseFloat(nextInteger.toString() + number)
          updateOutput(nextInteger)
        }
      } else { // must be a logical operation
        if (number === '+') {
          nextOperation = '+'
        } else if (number === '-') {
          nextOperation = '-'
        } else if (number === '/') {
          nextOperation = '/'
        } else if (number === 'X') {
          nextOperation = '*'
        } else if (number === '%') {
          nextOperation = '%'
        } else if (number === 'C') {
          // reset font fontSize
          resetCalculator()
          return
        } else if (number === '=') { // perform calculation
          calculate()
        } else if (number === '+/-') {
          var output = getOutput()
          if (output === currentValue) {
            currentValue *= -1
            updateOutput(currentValue)
          } else if (output === nextInteger) {
            nextInteger *= -1
            updateOutput(nextInteger)
          }
        } else if (number === '.') {
          if (nextOperation === null) { // we should update the current value
            currentValue = currentValue + 0.0
            updateOutput(currentValue)
          } else {
            nextInteger = parseFloat(nextInteger)
            updateOutput(nextInteger)
          }
        }

        // only apply active style to functions not integers
        removeAllActive()
        if (number !== '=' && number !== '+/-' && number !== '.') elem.classList.add('active-elm')
      }
    }

    // console.log('NEXTOP: ' + nextOperation)
    // console.log('CURVAL: ' + currentValue)
    // console.log('NEXINT: ' + nextInteger)
    // console.log('PRIINT: ' + priorInteger)
    // console.log('PRIOOP: ' + priorOperation)
    // console.log('---------')
  }

  function removeLastDigit () {
    var output = getOutput()
    var newValue
    // if it can be represented as an integer then let's
    var outputLength = output.toString().length
    newValue = parseFloat(output.toString().substr(0, outputLength - 1))
    if (parseInt(newValue) == newValue) newValue = parseInt(newValue)
    // ensure we never see NaN by setting it to Zero
    if (isNaN(newValue)) newValue = 0
    if (output === currentValue) {
      currentValue = newValue
      updateOutput(currentValue)
    } else if (output === nextInteger) {
      nextInteger *= newValue
      updateOutput(nextInteger)
    }
  }

  function removeAllActive () {
    document.querySelectorAll('.active-elm').forEach(active => {
      active.classList.remove('active-elm')
    })
  }

  function resetCalculator () {
    document.querySelector('#output span').style.fontSize = '66px'
    currentValue = 0
    nextOperation = null
    priorInteger = null
    priorOperation = null
    removeAllActive()
    updateOutput(currentValue)
  }

  function getOutput () {
    var output = document.querySelector('#output span').innerHTML
    return parseFloat(output.replace(/,/g, ''))
  }

  function updateOutput (int) {
    var outputBox = document.querySelector('#output')
    var outputBoxSpan = document.querySelector('#output span')
    // always start by ensuring fontSize is proper number : 66px
    outputBoxSpan.style.fontSize = '66px'
    outputBoxSpan.innerHTML = int.toLocaleString()

    // reduce size of text to fit within box
    while (outputBoxSpan.offsetWidth > outputBox.offsetWidth) {
      const fontSize = parseInt(window.getComputedStyle(outputBoxSpan).fontSize)
      const newSize = (fontSize * 0.90) + 'px'
      // cancel entire thing
      outputBoxSpan.style.fontSize = newSize
    }

    // trigger overflow if we cannot show number
    if (parseInt(window.getComputedStyle(outputBoxSpan).fontSize) < 10) {
      resetCalculator()
      return
    }
  }

  document.addEventListener('keydown', control)
  document.querySelectorAll('.numeral').forEach(numeral => numeral.addEventListener('click', control))
})

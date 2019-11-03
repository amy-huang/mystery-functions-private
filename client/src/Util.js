class Util {
  static getCurrentTime() {
    var today = new Date()
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    return date + ' ' + time
  }

  static newKey() {
    if (localStorage.getItem('actionKey') === null) {
      localStorage.setItem('actionKey', 0)
    } else {
      var k = parseInt(localStorage.getItem('actionKey')) + 1
      localStorage.setItem('actionKey', k)
    }
    return localStorage.getItem('actionKey')
  }

  static async sendToServer(obj) {
    // console.log(JSON.stringify(obj))
    const response = await fetch('/api/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
    const body = await response.text()
    console.log(body)
  }

}

export default Util
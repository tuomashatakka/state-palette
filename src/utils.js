'use babel'

export async function getBase64FromImageUrl(url) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')

  let response = await new Promise((resolve, reject) => {

    img.onload = function () {
      let canvas = document.createElement("canvas")
      canvas.width =this.width;
      canvas.height =this.height;

      let ctx = canvas.getContext("2d");
      ctx.drawImage(this, 0, 0);

      let dataURL = canvas.toDataURL("image/png")
      return resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ""))
    }
    img.onerror = (...args) => reject(url)
    img.onabort = (...args) => reject(url)
    img.src = url
  })
  return response
}

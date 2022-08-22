$(function () {
  $(".ShowThis").hide();
  let furl = "";

  document.querySelector("#formFileLg").addEventListener("change", function () {
    let url = URL.createObjectURL(this.files[0]);
    furl = url;
    console.log(url);
  });

  $("#SpeakBtn").click(function () {
    $(".ShowThis").show();

    let textFinal = "";
    Tesseract.recognize(furl, "eng", {
      logger: (m) => {
        let width = Math.ceil(m["progress"] * 100);
        console.log(width);
        $(".progress-bar").text(`${width}%`).css("width", `${width}%`);
        
      },
    }).then(({ data: { text } }) => {
      textFinal = text;
      textFinal = textFinal.replace(/\n/g, " ");

      Speak(textFinal);
    });
  });

  function Speak(text) {
    let textArr = text.split(" ");
    textArr.unshift(" ");
    console.log(textArr);

    $("#inputDiv").hide("slow");

    let sp = new SpeechSynthesisUtterance();
    sp.text = text;
    window.speechSynthesis.speak(sp);

    let i = 0;
    sp.onboundary = (event) => {
      if (textArr[i] != undefined) {

      
        $("#outputText").append(`<span class="highlight"> ${textArr[i]} </span>`);
        i = i + 1;
      }
    };
  }
});

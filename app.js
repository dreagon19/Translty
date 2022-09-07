$(function () {
  $(".ShowThis").hide();
  let furl = "";
  //File Picker 
  document.querySelector("#formFileLg").addEventListener("change", function () {
    let url = URL.createObjectURL(this.files[0]);
    furl = url;
  });

  //The big blue button that says "Read Aloud". This Functions runs when that button is clicked
  $("#SpeakBtn").click(function () {
    $(".ShowThis").show();

    let textFinal = "";
    Tesseract.recognize(furl, "eng", {
      logger: (m) => {
        let width = Math.ceil(m["progress"] * 100);    // This gives the percentage in the progress bar
        $(".progress-bar").text(`${width}%`).css("width", `${width}%`);
      },
    }).then(({ data: { text } }) => {
      textFinal = text;

      // Replaces all the new line in the extracted text to spaces,(Makes it easier for the model to read)
      textFinal = textFinal.replace(/\n/g, " "); 

      Speak(textFinal);
    });
  });
  function Speak(text) {
    let textArr = text.split(" ");
    textArr.unshift(" ");

    $("#inputDiv").hide("slow");

    let sp = new SpeechSynthesisUtterance();
    sp.text = text;
    sp.rate = 1; //TODO: Higher Rate means speaking fast
    
    window.speechSynthesis.speak(sp); //Models starts speaking here


    //Below lines shows the text on browser , that are being spoken right now
    let i = 0;
    sp.onboundary = (event) => {
      if (textArr[i] != undefined) {
        $("#outputText").append(`<span class="highlight"> ${textArr[i]} </span>`);
        i = i + 1;
      }
    };
  }
});

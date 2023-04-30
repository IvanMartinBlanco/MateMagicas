gameZone = document.querySelector(".game-zone");
num1 = Math.floor(Math.random() * 10) + 1;
num2 = Math.floor(Math.random() * 10) + 1;
answer = num1 + num2;
difficulty = parseInt(new URLSearchParams(window.location.search).get("nivel"));

hint = "";


gameZone.innerHTML = `
  <h1>Suma ${num1} + ${num2}</h1>
  <p>${hint}</p>
  <form>
    <label for="answer">Resultado:</label>
    <input type="number" name="answer" id="answer">
    <input type="submit" value="Comprobar">
  </form>
`;

 answerInput = document.getElementById("answer");
 form = document.querySelector("form");
form.addEventListener("submit", e => {
  e.preventDefault();
   userAnswer = parseInt(answerInput.value);
  if (userAnswer === answer) {
    alert("¡Correcto!");
  } else {
    alert("Incorrecto. Inténtalo de nuevo.");
  }
});
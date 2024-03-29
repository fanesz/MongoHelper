function getLocalTheme(){
  localStorage.getItem('theme') == null ? setLocalTheme('light') : localStorage.getItem('theme');
  return localStorage.getItem('theme');
}
function setLocalTheme(theme){
  localStorage.setItem('theme', theme);
}
setTheme();

function setTheme(isPressed=false) {
  if(isPressed) { setLocalTheme(getLocalTheme() == 'dark' ? 'light' : 'dark'); }
  let body = document.querySelector("body");
  let container = document.querySelector(".container");
  let shortcut = document.querySelector(".shortcut");
  let resultInsert = document.querySelector("#result-insert");
  let allElements = document.querySelectorAll("*");
  let button = document.querySelector(".themeButton");

  if (getLocalTheme() == "dark") {
    body.style.backgroundColor = "#1B2430";
    container.style.backgroundColor = "#5B8FB9";
    shortcut.style.backgroundColor = "#5B8FB9";
    resultInsert.style.backgroundColor = "#B6EADA";
    resultInsert.style.color = "black";
    allElements.forEach(function (element) {
      if (element.tagName !== 'TEXTAREA') {
        element.style.color = 'white';
      }
    });
    button.innerHTML = "make it Light";
    button.className = "themeButton btn border border-light";
    setLocalTheme('dark');

  } else if (getLocalTheme() == "light") {
    body.style.backgroundColor = "";
    container.style.backgroundColor = "";
    shortcut.style.backgroundColor = "";
    resultInsert.style.backgroundColor = "";
    resultInsert.style.color = "";
    allElements.forEach(function (element) {
      element.style.color = "";
    });
    button.innerHTML = "make it Dark"
    button.className = "themeButton btn border border-dark";
    setLocalTheme('light');
  }
}




var textareas = document.getElementsByTagName('textarea');
for (var i = 0; i < textareas.length; i++) {
  var textarea = textareas[i];
  textarea.addEventListener('keydown', function(event) {
    focusNext(event, this);
  });
}

document.addEventListener('keydown', function(event) {
  if (event.ctrlKey && event.key === 'Enter') {
    generateInsert();
  }
  if (event.ctrlKey && event.key === '=' || event.ctrlKey && event.key === '+') {
    tambah();
  }
  if (event.shiftKey && event.key === 'Backspace') {
    var currentElement = document.activeElement.parentNode.parentNode;
    hapus('dataTable', currentElement);
  }
});



function focusNext(event, currentTextarea) {
  var keyCode = event.keyCode;
  var shiftKey = event.shiftKey;
  var ctrlKey = event.ctrlKey;

  if ((keyCode === 13 && !shiftKey) || keyCode === 40) { // Enter key or Down arrow key
    event.preventDefault();

    var parentCell = currentTextarea.parentNode;
    var columnIndex = Array.from(parentCell.parentNode.children).indexOf(parentCell);
    var nextRow = parentCell.parentNode.nextElementSibling;

    if (nextRow) {
      var nextCell = nextRow.children[columnIndex];
      var nextTextarea = nextCell.querySelector('textarea');
      if (nextTextarea) {
        nextTextarea.focus();
      }
    } else if(keyCode === 40) {
      tambah();

    }
  } else if (keyCode === 37 && !shiftKey && ctrlKey) { // Left arrow key
    event.preventDefault();

    var previousCell = currentTextarea.parentNode.previousElementSibling;

    if (previousCell) {
      var previousTextarea = previousCell.querySelector('textarea');

      if (previousTextarea) {
        previousTextarea.focus();
      }
    }
  } else if (keyCode === 38 && !shiftKey) { // Up arrow key
    event.preventDefault();

    var parentCell = currentTextarea.parentNode;
    var columnIndex = Array.from(parentCell.parentNode.children).indexOf(parentCell);
    var previousRow = parentCell.parentNode.previousElementSibling;

    if (previousRow) {
      var previousCell = previousRow.children[columnIndex];
      var previousTextarea = previousCell.querySelector('textarea');

      if (previousTextarea) {
        previousTextarea.focus();
      }
    }
  } else if (keyCode === 39 && !shiftKey && ctrlKey) { // Right arrow key
    event.preventDefault();

    var nextCell = currentTextarea.parentNode.nextElementSibling;

    if (nextCell) {
      var nextTextarea = nextCell.querySelector('textarea');

      if (nextTextarea) {
        nextTextarea.focus();
      }
    }
  }
}


function tambah(element="dataTable") {
  var table = document.getElementById(element);
  var newRow = table.insertRow();
  var leftCell = newRow.insertCell(0);
  var rightCell = newRow.insertCell(1);
  var checkboxCell = newRow.insertCell(2);
  var deleteCell = newRow.insertCell(3);

  leftCell.className = "left";
  rightCell.className = "right";
  checkboxCell.className = "checkbox";
  deleteCell.className = "delete";

  var leftTextarea = document.createElement("textarea");
  leftTextarea.setAttribute("id", "textarea1");
  leftTextarea.setAttribute("placeholder", "key");
  leftTextarea.setAttribute("rows", "1");
  leftTextarea.addEventListener("keydown", function(event) {
    focusNext(event, this);
  });
  leftCell.appendChild(leftTextarea);
  leftTextarea.focus();

  var rightTextarea = document.createElement("textarea");
  rightTextarea.setAttribute("id", "textarea2");
  rightTextarea.setAttribute("placeholder", "value");
  rightTextarea.setAttribute("rows", "1");
  rightTextarea.addEventListener("keydown", function(event) {
    focusNext(event, this);
  });
  rightCell.appendChild(rightTextarea);

  checkboxCell.innerHTML =
    '<div class="form-check form-check-inline">\n<input class="form-check-input" type="checkbox" name="int" id="intCheckbox">\n<label class="form-check-label" for="intCheckbox">int</label>\n</div>\n<div class="form-check form-check-inline">\n<input class="form-check-input" type="checkbox" name="array" id="arrayCheckbox">\n<label class="form-check-label" for="arrayCheckbox">array</label>\n</div>';

  deleteCell.innerHTML = `<button class="btn btn-danger" onclick="hapus('${element}', this.parentNode.parentNode)">-</button>`;
}


function hapus(element, row) {
  try{
    var previousTextarea = row.previousElementSibling.querySelector('textarea');
    previousTextarea.focus();
    if (previousTextarea) {
      var table = document.getElementById(element);
      table.deleteRow(row.rowIndex);
      event.preventDefault();
    }
  } catch(err) {}
}

function copyToClipboard(result) {
  var resultTextArea = document.getElementById(result);
  resultTextArea.select();
  resultTextArea.setSelectionRange(0, 99999);

  document.execCommand("copy");

  var copyButton = document.getElementById("copyButton");
  copyButton.textContent = "Copied!";
  setTimeout(function() {
    copyButton.textContent = "Click to Copy";
  }, 2000);
}


function generateInsert() {
  var table = document.getElementById('dataTable');
  var rows = table.getElementsByTagName("tr");

  var result = {};

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var key = row.querySelector(".left textarea").value;
    var value = row.querySelector(".right textarea").value;
    var isArray = row.querySelector("[name='array']").checked;
    var isInt = row.querySelector("[name='int']").checked;

    if (key && value) {
      if (isArray) {
        value = value.split(",").map(item => item.trim());

        if (isInt) {
          value = value.map(item => parseInt(item));
        }
      } else if (isInt) {
        if (value.includes(".")) {
          value = parseFloat(value);
        } else {
          value = parseInt(value);
        }
      }
      result[key] = value;
    }
  }

  var resultTextArea = document.getElementById('result-insert');
  resultTextArea.value = JSON.stringify(result);
}

// function generateFind() {
//   var table = document.getElementById('dataTable2');
//   var rows = table.getElementsByTagName("tr");

//   var result = {};

//   for (var i = 0; i < rows.length; i++) {
//     var row = rows[i];
//     var key = row.querySelector(".left textarea").value;
//     var value = row.querySelector(".right textarea").value;
//     var isShow = row.querySelector("[name='show']").checked;

//     if (key && value) {
//       if (isArray) {
//         value = value.split(",").map(item => item.trim());
//       } else if (isInt) {
//         value = parseInt(value);
//       }
//       result[key] = value;
//     }
//   }

//   var resultTextArea = document.getElementById('result-insert');
//   resultTextArea.value = JSON.stringify(result);
// }



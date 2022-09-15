
let colors = document.getElementById("color").cloneNode(true);
document.getElementsByClassName('creation')[0].querySelectorAll('div')[2].appendChild(colors);

function openDrawer() {
    document.getElementsByClassName('drawer')[0].style.display = "block";
}

// enter title and subtitle
let title;
function getTitle(event) {
    title = event.target.value;
    if (title.length > 0) {
        document.getElementById('title0').innerText = '';
    }
}
let subTitle;
function getSubTitle(event) {
    subTitle = event.target.value;
    if (subTitle.length > 0) {
        document.getElementById('Subtitle0').innerText = '';
    }
}

//choose a color to create items
let currColor;
let prevClass;
let currId;
function colorChosen() {
    if (prevClass != undefined) {
        prevClass.remove('onclickColor');
        prevClass.add('circle');
    }
    this.classList.remove('circle');
    this.classList.add('onclickColor');
    prevClass = this.classList;
    currId = this.id;
    let index = idsArr.indexOf(currId)
    if (index != -1) {
        currColor = colorArr[index];
    }
    else {
        currColor = this.style.backgroundColor;
    }
    document.getElementById('verifyColor').innerText = '';
}

for (var i = 0; i < 8; i++) {
    let elem = document.getElementsByClassName('circle')[i];
    elem.id = `${i}`;
    elem.addEventListener('click', filterByColor);
}
for (var i = 8; i < 16; i++) {
    let elemnt = document.getElementsByClassName('circle')[i];
    elemnt.id = `${i}`;
    elemnt.addEventListener('click', colorChosen);
}
let newcolor;
function edit(event) {
    if (idsArr.indexOf(currId) == -1) {
        newcolor = event.target.value;
        document.getElementById(currId).style.backgroundColor = newcolor;
        document.getElementById(`${currId - 8}`).style.backgroundColor = newcolor;
        currColor = newcolor;
        document.getElementById('verifyColor').innerText = '';
    }
    else {
        document.getElementById('verifyColor').innerText = 'Can not be edited since this color item has been added already !';
    }

}
function getColors() {
    for (let i = 0; i < idsArr.length; i++) {
        let id = idsArr[i];
        document.getElementById(id).style.backgroundColor = colorArr[i];
        document.getElementById(`${id - 8}`).style.backgroundColor = colorArr[i];
    }
}

// add to local storage
function storeData() {
    getDataStorage();
      if (colorArr.length >= 5) {
        document.getElementById('verifyColor').innerText = 'Maximum 5 items can be added !';
    }
    if ((title != undefined && title.length != 0) && (subTitle != undefined && subTitle.length != 0)
        && currId != undefined) {
        if (titleArr.length < 5) {
            titleArr.push(title);
            localStorage.setItem("Title", titleArr);
        }
        if (subTitleArr.length < 5) {
            subTitleArr.push(subTitle);
            localStorage.setItem("SubTitle", subTitleArr);
        }
        if (colorArr.length < 5) {
            colorArr.push(currColor);
            localStorage.setItem("Color", colorArr);
            idsArr.push(currId);
            localStorage.setItem('Ids', idsArr);
            document.getElementById('verifyColor').innerText = '';
        }
        progressBar();
    }
    else {
        if (title == undefined || title.length == 0) {
            document.getElementById('title0').innerText = 'Title is not entered !';
        }
        if (subTitle == undefined || subTitle.length == 0) {
            document.getElementById('Subtitle0').innerText = 'Sub Title is not entered !';
        }
        if (currColor == undefined) {
            document.getElementById('verifyColor').innerText = 'Color is not selected !';
        }
    }
}

function getDataStorage() {
    titleArr = [];
    subTitleArr = [];
    colorArr = [];
    idsArr = [];

    if (localStorage.getItem('Title') != null) {
        titleArr = localStorage.getItem('Title').split(',');
    }
    if (localStorage.getItem('SubTitle') != null) {
        subTitleArr = localStorage.getItem('SubTitle').split(',');
    }
    if (localStorage.getItem("Color") != null) {
        colorArr = localStorage.getItem('Color').split(',');
    }
    if (localStorage.getItem("Ids") != null) {
        idsArr = localStorage.getItem('Ids').split(',');
    }
}

getDataStorage();
getColors();

function progressBar() {
    document.getElementById('itemNum').innerText = titleArr.length + "/5" + "  Creatives";
    document.getElementsByClassName('progress_bar')[0].style.width = 20 * (titleArr.length) + '%';
}
progressBar();

function deleteCreatives() {
    for (let i = 0; i < titleArr.length; i++) {
        element = document.getElementById('color').getElementsByClassName('onclickColor')[i];
        if (element != undefined) {
            element.classList.remove('onclickColor');
            element.classList.add('circle');
            removeItem(i);
        }
    }
    localStorage.clear();
    getDataStorage();
    progressBar();
    filter();
}
// end of createItems and storeData

// filter
let currTitleToFilter;
let currColorToFilter;
let currColorClass;
function filterByColor() {
    let currid = this.id;
    colorIndex = idsArr.indexOf(`${currid - 0 + 8}`);
    if (colorIndex != -1) {
        currColorToFilter = colorArr[colorIndex];
    }
    if (this.className == 'onclickColor') {
        this.classList.remove('onclickColor');
        this.classList.add('circle');
    }
    else {
        if (colorIndex != -1) {
            this.classList.remove('circle');
            this.classList.add('onclickColor');
            currColorClass = 'onclickColor';
        }

    }
    filter();
}

function filterByTitle(event) {
    currTitleToFilter = event.target.value;
    filter();
}
function filter() {
    let selectedColors = document.getElementById('color').getElementsByClassName('onclickColor')
    for (let i = 0; i < idsArr.length; i++) {
        let titleMatch = false;
        let colorMatch = false;
        if (selectedColors.length == 0) {
            if (currTitleToFilter != undefined && currTitleToFilter.length > 0) colorMatch = true;
        }
        else {
            for (let j = 0; j < selectedColors.length; j++) {
                let id = selectedColors[j].id - 0 + 8;
                if (`${id}` == idsArr[i]) colorMatch = true;
            }
        }
        if (currTitleToFilter == undefined || currTitleToFilter.length == 0) {
            if (selectedColors.length != 0) titleMatch = true;
        }
        else {
            if (currTitleToFilter == titleArr[i] || currTitleToFilter == subTitleArr[i]) titleMatch = true;
        }
        if (titleMatch == true && colorMatch == true) createItem(i);
        else removeItem(i);
    }
    let element = document.querySelector('.filter');
    element.scrollTop = element.scrollHeight;
}

function createItem(index) {
    // let element = document.getElementsByClassName('filteredItems')[0].getElementsByTagName('div')[index];
    let element = document.querySelectorAll('.myitem')[index];
    element.innerHTML = `<div class = "itemcreated">
                             <h2>  ${titleArr[index]}</h2> <b> ${subTitleArr[index]}</b><br>
                        </div>
                        <div class = "itemdelete" >
                             <button onclick = "hideItem(event)" data-index = ${index} style = "margin-right:10%;">hide</button>
                             <button onclick = "deleteItem(event)" data-index = ${index}>delete</button>
                        </div> `; 
                                              
                                           
    let curritem = element.querySelector('.itemcreated');
    element.style.display = 'flex';
    curritem.style.borderStyle = 'groove';
    curritem.style.backgroundColor = `${colorArr[index]}`;
}
function deleteItem(event){
    let element =  event.target.parentNode.parentNode;
    let index = event.target.dataset.index;
    idsArr.splice(index,1);
    colorArr.splice(index,1);
    titleArr.splice(index,1);
    subTitleArr.splice(index,1);
    localStorage.setItem('Ids',idsArr);
    localStorage.setItem('Title',titleArr);
    localStorage.setItem('SubTitle',subTitleArr);
    localStorage.setItem('Color',colorArr);
     let items = document.querySelectorAll('.itemcreated');
     let buttons = document.querySelectorAll('.itemdelete');
    for(let i = 0; i < items.length; i++){
        items[i].remove();
        buttons[i].remove();
    } 
     if(idsArr.length>0){
       filter();
      getColors();
      progressBar(); 
     }
     else deleteCreatives();     
}
function hideItem(event){
    // let element =  event.target.parentNode.parentNode;
    let index = event.target.getAttribute("data-index");
    removeItem(index);
}
function removeItem(index) {
    // let element = document.getElementsByClassName('filteredItems')[0].getElementsByTagName('div')[index];
    let element = document.querySelectorAll('.myitem')[index];
    element.style.display = 'none';
}



var currentpage = 1,
    pageCount = 4,
    animating = false,
    gridVisible = false,
    asseturl = '',
    nextPage,
    currentElement,
    nextElement,
    overlayBg,
    overlayCntn,
    overlay,
    grid,
    blinder,
    rightBtn,
    leftBtn,
    closeBtn,
    container,
    gridarray = [
        {img: 'img/icon/yellowstone1.png', color: '#ba3214'},
        {img: 'img/icon/yellowstone4.png', color: '#88ab7d'},
        {img: 'img/icon/yellowstone2.png', color: '#1567ba'},
        {img: 'img/icon/yellowstone3.png', color: '#ba8815'}
    ];

function showBlinder() {
    blinder.style.display = 'block';
    setTimeout(function () {
        blinder.style.opacity = '.5';
    }, 10);
}

function hideBlinder() {
    blinder.style.opacity = '0';
    setTimeout(function () {
        blinder.style.display = 'none';
    }, 200);
}

function getOverlayColor() {
    var newColor;

    switch (currentpage) {
    case 1:
        newColor = '#ba3214';
        break;
    case 2:
        newColor = '#88ab7d';
        break;
    case 3:
        newColor = '#1567ba';
        break;
    default:
        newColor = '#ba8815';
        break;
    }

    return newColor;
}

function populateGrid() {
    var gridBlends = document.getElementById('grid-blends-content'),
        gridImages = document.getElementById('grid-images-content'),
        image,
        blend,
        i;

    for (i = 0; i < gridarray.length; i += 1) {
        image = new Image();
        image.src = asseturl + gridarray[i].img;
        image.width = image.height = "100";
        gridImages.appendChild(image);

        blend = document.createElement('div');
        blend.id = 'grid-item-' + i;
        blend.className = 'grid-blend';
        blend.style.background = gridarray[i].color;
        gridBlends.appendChild(blend);
        blend.addEventListener('click', handle_gridItem_CLICK);
    }
}

function resetOverlay() {
    overlayBg.style.height = window.innerHeight + 'px';
    overlayBg.style.width = window.innerWidth + 'px';
    overlayBg.style.marginTop =  - (window.innerHeight / 2) + 'px';

    overlayCntn.style.height = window.innerHeight + 'px';
    overlayCntn.style.width = window.innerWidth + 'px';
    overlayCntn.style.marginTop =  - (window.innerHeight / 2) + 'px';
}

/*
 * set value to percents to allow resizing
 */
function handle_overlay_COMPLETE() {

    switch (currentpage) {
    case 1:
        overlayBg.style.width = '100%';

        overlayCntn.style.width = '100%';
        break;
    case 2:
        overlayBg.style.height = '100%';
        overlayBg.style.width = '100%';

        overlayCntn.style.height = '100%';
        overlayCntn.style.width = '100%';
        break;
    case 3:
        overlayBg.style.height = '100%';

        overlayCntn.style.height = '100%';
        break;
    case 4:
        overlayBg.style.height = '100%';
        overlayBg.style.width = '100%';

        overlayCntn.style.height = '100%';
        overlayCntn.style.width = '100%';
        break;
    }

    overlayBg.removeEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
    overlayBg.removeEventListener('transitionend', handle_overlay_COMPLETE);

    overlayCntn.removeEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
    overlayCntn.removeEventListener('transitionend', handle_overlay_COMPLETE);
}

/*
 * transition overlay to new values
 */
function updateOverlay() {

    overlayBg.style.background = getOverlayColor();
    resetOverlay();

    if (currentpage === 2) {

        overlayBg.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
        overlayBg.addEventListener('transitionend', handle_overlay_COMPLETE);

        overlayCntn.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
        overlayCntn.addEventListener('transitionend', handle_overlay_COMPLETE);

    } else if (currentpage === 3) {

        setTimeout(function () {
            overlayBg.style.width = '220px';
            overlayBg.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
            overlayBg.addEventListener('transitionend', handle_overlay_COMPLETE);

            overlayCntn.style.width = '220px';
            overlayCntn.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
            overlayCntn.addEventListener('transitionend', handle_overlay_COMPLETE);

        }, 10);

    } else if (currentpage === 4) {

        overlayBg.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
        overlayBg.addEventListener('transitionend', handle_overlay_COMPLETE);

        overlayCntn.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
        overlayCntn.addEventListener('transitionend', handle_overlay_COMPLETE);

    } else {

        setTimeout(function () {
            overlayBg.style.height = '220px';
            overlayBg.style.marginTop = '-150px';
            overlayBg.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
            overlayBg.addEventListener('transitionend', handle_overlay_COMPLETE);

            overlayCntn.style.height = '220px';
            overlayCntn.style.marginTop = '-150px';
            overlayCntn.addEventListener('webkitTransitionEnd', handle_overlay_COMPLETE);
            overlayCntn.addEventListener('transitionend', handle_overlay_COMPLETE);
        }, 10);
    }
}

function handle_animIn_COMPLETE(e) {
    animating = false;
    nextElement.removeEventListener('webkitTransitionEnd', handle_animIn_COMPLETE, true);
    nextElement.removeEventListener('transitionend', handle_animIn_COMPLETE, true);
    updateOverlay();
}

function animIn() {

    currentElement.removeEventListener('webkitTransitionEnd', animIn, true);
    currentElement.removeEventListener('transitionend', animIn, true);
    currentpage = nextPage;
    nextElement = document.getElementById('page' + currentpage);
    nextElement.style.display = 'block';

    setTimeout(function () {

        nextElement.style.webkitTransform = 'translateZ(0px) rotateX(0deg)';
        nextElement.style.MozTransform = 'translateZ(0px) rotateX(0deg)';
        nextElement.addEventListener('webkitTransitionEnd', handle_animIn_COMPLETE, true);
        nextElement.addEventListener('transitionend', handle_animIn_COMPLETE, true);
    }, 10);
}

function gotoPage(newPage) {
    animating = true;
    nextPage = newPage;

    currentElement = document.getElementById('page' + currentpage);
    currentElement.style.webkitTransform = 'translateZ(-1000px) rotateX(90deg)';
    currentElement.style.MozTransform = 'translateZ(-1000px) rotateX(90deg)';
    currentElement.addEventListener('webkitTransitionEnd', animIn, true);
    currentElement.addEventListener('transitionend', animIn, true);
}

function showGrid() {
    grid.style.top = '0px';
    gridVisible = true;
    showBlinder();
}

function hideGrid() {
    grid.style.top = '-450px';
    gridVisible = false;
    hideBlinder();
}

function toggleGrid() {
    if (gridVisible !== true) {
        showGrid();
    } else {
        hideGrid();
    }
}

function handle_gridItem_CLICK(e) {
    var newPage = parseInt(e.target.id.replace('grid-item-', ''));
    gotoPage(newPage + 1);
    hideGrid();
}

function handle_document_KEY_PRESS(e) {

    if (animating === false) {
        var pageNumber;

        switch (e.keyCode) {
        case 39: //forward
            pageNumber = currentpage !== pageCount ? currentpage + 1 : 1;
            gotoPage(pageNumber);
            break;
        case 37: //backward
            pageNumber = currentpage !== 1 ? currentpage - 1 : pageCount;
            gotoPage(pageNumber);
            break;
        case 71:
            toggleGrid();
            break;
        default:
            break;
        }

    }
}

function handle_down_CLICK(e) {
    showGrid();
}

function handle_blinder_CLICK(e) {
    hideGrid();
}

function handle_leftBtn_CLICK(e) {
    var newPage = currentpage == 1 ? pageCount : currentpage - 1;
    console.log('a', newPage);
    gotoPage(newPage);
    hideGrid();
}

function handle_rightBtn_CLICK(e) {
    console.log('--', currentpage);
    console.log('--', pageCount);
    var newPage = currentpage === pageCount ? 1 : currentpage + 1;
    console.log('b', newPage);
    gotoPage(newPage);
    hideGrid();
}

window.onload = function () {
    overlayBg = document.getElementById('overlay-bg');
    overlayCntn = document.getElementById('overlay-content');
    overlay = document.getElementById('overlay');
    container = document.getElementById('container');
    closeBtn = document.getElementById('down-btn');
    leftBtn = document.getElementById('left-btn');
    rightBtn = document.getElementById('right-btn');
    grid = document.getElementById('grid');
    blinder = document.getElementById('blinder');

    leftBtn.addEventListener('click', handle_leftBtn_CLICK);
    rightBtn.addEventListener('click', handle_rightBtn_CLICK);
    closeBtn.addEventListener('click', handle_down_CLICK);
    blinder.addEventListener('click', handle_blinder_CLICK);
    document.addEventListener('keydown', handle_document_KEY_PRESS);

    populateGrid();
}




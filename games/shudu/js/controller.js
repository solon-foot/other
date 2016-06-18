/**
 * Created by zhangzhi on 16/6/17.
 */
'use strict'

var shudu;//数独对象
var shudu2;//
var currentPos;//当前位置
var canvas;//画布

var screenWidth;
var screenHeight;
var item_width;
var padding;
var font_size;
var font_offsetH;
var font_offsetV;
var cell_width;

function main() {
    initSelect();
    init(0);
    canvas = document.getElementById("canvas");
    reDraw();
    canvas.addEventListener("click", selectGrid, true);
}
main();

function initSelect() {
    var select = document.getElementById("select");
    var size = games.length;
    for(var i=0;i<size;i++) {
        select.options.add(new Option("第"+(i+1)+"题",i));
    }
}

function init(index) {
    shudu = new Shudu(getGame(index));
    shudu2 = shudu.copy();
}

function reDraw() {
    screenWidth = getWinSize();
    screenHeight = screenWidth * 1.11;
    item_width = screenWidth / 10;
    padding = item_width / 3;
    font_size = item_width * 2 / 3;
    font_offsetH = item_width / 2 - font_size / 4;
    font_offsetV = item_width / 2 + font_size / 2;
    canvas.width = screenWidth;
    canvas.height = screenHeight;
    cell_width = (screenWidth - padding * 2) / 10 - 0.5;
    draw();
}

function selectGrid(event) {
    var posX = event.pageX - canvas.offsetTop;
    var posY = event.pageY - canvas.offsetLeft;
    if (posX > padding && posX < screenWidth - padding
        && posY > padding && posY < screenWidth - padding
    ) {
        currentPos = [Math.round(posY / item_width) - 1, Math.round(posX / item_width) - 1];
        if (shudu.shudu[currentPos[0]][currentPos[1]]) {
            currentPos = null;
        }
        draw();
        return;
    } else if (posX > padding && posX < screenWidth - padding && posY > item_width * 10 && posY < item_width * 11) {
        if (currentPos != null) {
            //var temp = Math.round(posX/item_width);
            shudu2.shudu[currentPos[0]][currentPos[1]] = Math.round(posX / cell_width) - 1;
            draw();
        }
    } else {
        currentPos = null;
        draw();
    }

}

function qiujie() {
    if(isCreate){
        return;
    }
    shudu2 = execute(shudu.copy());
    draw();
}

var isCreate = false;
function create(btn) {
    //console.log(btn.toSource());

    if(isCreate) {
        isCreate=false;
        shudu = shudu2.copy();
        btn.innerHTML="自定义游戏";
        currentPos = null;
    } else {
        isCreate=true;
        shudu =new Shudu();
        shudu2 = new Shudu();
        currentPos = null;
        btn.innerHTML="完成";
    }
    draw();
}

function choose(select) {
    if(isCreate){
        return;
    }
    init(select.selectedIndex);
    draw();
}

window.onresize = function () {
    reDraw();
}


function getWinSize() {
    var winWidth = 0;
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    return winWidth;
}


function draw() {
    var context = canvas.getContext("2d");


    context.clearRect(0, 0, screenWidth, screenHeight);


    //绘制数字
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            //绘制数字

            if (shudu.shudu[i][j]) {
                context.fillStyle = "#999";
                context.fillRect(padding + j * item_width, padding + i * item_width, item_width, item_width);
                context.fillStyle = "black";
                context.font = "lighter " + font_size + "px sans-serif";
                //context.fontsize=font_size+"px";
                context.fontWeight = "normal"
                context.fillText(
                    shudu.shudu[i][j],
                    item_width * j + padding + font_offsetH,
                    item_width * i + padding + font_offsetV
                );
            } else if (shudu2 && shudu2.shudu[i][j]) {
                context.fillStyle = "black";
                context.font = font_size + "px sans-serif";
                context.fillText(
                    shudu2.shudu[i][j],
                    item_width * j + padding + font_offsetH,
                    item_width * i + padding + font_offsetV
                );
            }
        }
    }


    //绘制底部选择区域

    for (var i = 0; i < 10; i++) {
        context.strokeStyle = 'gray'
        context.strokeRect(
            i * cell_width + padding,
            item_width * 10,
            cell_width,
            cell_width
        );
        context.fillStyle = "black";
        context.font = font_size + "px sans-serif";
        context.fillText(
            i == 0 ? 'X' : i,
            cell_width * i + padding + cell_width / 2 - font_size / 4,
            item_width * 10 + cell_width / 2 + font_size / 2
        );

    }


    //绘制细线
    context.strokeStyle = "black";
    context.beginPath();
    context.lineWidth = 1;
    for (var i = 0; i < 10; i++) {
        if (i == 0 || i == 9 || i == 3 || i == 6) {
            continue;
        }
        context.moveTo(padding, padding + i * item_width);
        context.lineTo(padding + item_width * 9, i * item_width + padding);
        context.moveTo(padding + i * item_width, padding)
        context.lineTo(padding + i * item_width, padding + item_width * 9);
    }
    context.stroke();
    //绘制中间线
    context.lineWidth = 3;
    context.beginPath();
    for (var i = 0; i < 10; i++) {
        if (i == 0 || i == 9) {
            continue;
        } else if (i == 3 || i == 6) {

        } else {
            continue;
        }
        context.moveTo(padding, padding + i * item_width);
        context.lineTo(padding + item_width * 9, i * item_width + padding);
        context.moveTo(padding + i * item_width, padding)
        context.lineTo(padding + i * item_width, padding + item_width * 9);

    }
    context.stroke();
    //绘制外边框
    context.lineWidth = 4;
    context.strokeRect(padding, padding, item_width * 9, item_width * 9);


    //绘制选中区
    context.lineWidth = 3;
    context.strokeStyle = "blue";
    if (currentPos != null) {
        context.strokeRect(
            currentPos[1] * item_width + padding,
            currentPos[0] * item_width + padding,
            item_width,
            item_width
        );
    }


}
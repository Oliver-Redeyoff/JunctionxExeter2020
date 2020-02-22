var c = document.getElementById("myCanvas");
c.onmousemove = function(){
    c.style.cursor = "crosshair";
};

var ctx = c.getContext("2d");

var root = null;
var selectedNode = null;
var placingNode = false;

var nodeRadius = 30;
var canvasWidth = c.width;
var canvasHeight = c.height;
var branchFactor = 1;
var nodePlacementLeft = false;
var nodePlacementRight = false;

var firstClick = true;

// root.left = {x:200, y:canvasHeight/2, left:null, right:null};
// root.right = {x:200, y:canvasHeight/2-100, left:null, right:null};

c.addEventListener('click', (e) => {
    console.log("click");
    const pos = {
        x: e.clientX-10,
        y: e.clientY-94
    };

    if(firstClick){
        firstClick = false;
        root = {x:pos.x, y:pos.y, left:null, right:null, parent: null};
    }

    if (nodePlacementLeft){
        nodePlacementLeft = false;
        selectedNode.left = {x: pos.x, y: pos.y, parent:selectedNode, left:null, right:null, parent: selectedNode};
        draw();
        return;
    }
    else if(nodePlacementRight){
        nodePlacementRight = false;
        selectedNode.right = {x: pos.x, y: pos.y, parent:selectedNode, left:null, right:null, parent: selectedNode};
        draw();
        return;
    }
    draw();


    let stack = [];
    stack.push(root);
    while (stack.length > 0) {
        let node = stack.pop();
        if (node.left !== null) {
            stack.push(node.left);
        }
        if (node.right !== null) {
            stack.push(node.right);
        }
        let nodeCenter = {
            x: node.x,
            y: node.y
        };
        if (isSelected(pos, nodeCenter)) {
            console.log(node + " is selected");
            ctx.moveTo(node.x,node.y);
            ctx.beginPath();
            ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2, true);
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 4;
            ctx.stroke();
            selectedNode = node;
            break;
        }
    }
});

function drawNode(x,y){
    ctx.moveTo(x,y);
    ctx.beginPath();
    ctx.arc(x, y, nodeRadius, 0, Math.PI * 2, true);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.stroke();
};

function addChild(){
    console.log(selectedNode);
    // add a top node first
    if(selectedNode.left === null){
        nodePlacementLeft = true;
    }
    // if top node exists add bottom node
    else if(selectedNode.right === null){
        nodePlacementRight = true;
    }
    // if both exist then limit is reached
    else {
        console.log("limit reached");
    }
}

function nodeRemove(node) {
    if (node !== null) {
        nodeRemove(node.left);
        nodeRemove(node.right);
        node.left = null;
        node.right = null;
        node = null;
    }
}

function nodeRemoveWrapper() {
    nodeRemove(selectedNode);
    console.log(selectedNode);
    if (selectedNode.left) {
        selectedNode.parent.left = null;
    } else {
        selectedNode.parent.right = null;
    }
}

function drawLine(x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function isSelected(point, node) {
    console.log(point);
    console.log(node);
    return Math.sqrt(Math.pow((point.x-node.x),2) + Math.pow((point.y-node.y),2)) < nodeRadius+20;
}

// draw each node and lines inbetween parent and child nodes
function draw(){
  ctx.clearRect(0, 0, c.width, c.height);
  recDraw(root);
}
function recDraw(node){
  // draw the current node
  drawNode(node.x, node.y);
  if(node.left !== null){
    // draw left node
    recDraw(node.left);
    // draw line between the two
    drawLine(node.x, node.y, node.left.x, node.left.y);
  }
  if(node.right !== null){
    // draw right node
    recDraw(node.right);
    // draw line between the two
    drawLine(node.x, node.y, node.right.x, node.right.y);
  }
}
<<<<<<< HEAD
=======

function sendHandler() {
    let end = selectedNode;
    if (end === null) {
        alert("No Selected Node");
        return;
    }
    let stack = [];
    let curr = end;
    while (curr != null) {
        console.log(curr);
        stack.push(curr);
        curr = curr.parent;
    }
    console.log(stack);
    let out = [];
    var current = stack.pop();
    while (current != null) {
        let next = stack.pop();
        console.log(current);
        out.push(current.left == next ? 0 : 1);
        current = next;
    }
    out.pop();
    console.log(out);
    fetch("http://ARDUINO_IP/recdir", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({"array": out})
    }).then((resp) => console.log(resp)).catch((err) => console.log(err));
}
>>>>>>> 8ff0becc9aa0bb40346945bcc8c97ba1122f2bc2

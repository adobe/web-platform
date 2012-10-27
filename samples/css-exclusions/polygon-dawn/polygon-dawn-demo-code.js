/*
Copyright 2012 Adobe Systems, Incorporated
This work is licensed under a Creative Commons Attribution-Noncommercial-Share Alike 3.0 Unported License http://creativecommons.org/licenses/by-nc-sa/3.0/ .
Permissions beyond the scope of this license, pertaining to the examples of code included within this work are available at Adobe http://www.adobe.com/communities/guidelines/ccplus/commercialcode_plus_permission.html .
*/
function createPolygon(vertices) {
    var xCoordinates = vertices.map( function(p) { return p.x; } );
    var yCoordinates = vertices.map( function(p) { return p.y; } );
    return {
        vertices: vertices,
        minX: Math.min.apply(null, xCoordinates),
        maxX: Math.max.apply(null, xCoordinates),
        minY: Math.min.apply(null, yCoordinates),
        maxY: Math.max.apply(null, yCoordinates)
    };
}

function createRegularPolygonVertices(size, nSides, padding)
{
    var radius = size / (2 * Math.cos(Math.PI / nSides));
    var vertices = [];
    for (var i = 0; i < nSides/2; i++) {
        var a = (1 + 2*i) * (Math.PI / nSides);
        vertices[i] = {x: Math.floor(radius * Math.cos(a)), y: Math.floor(radius * Math.sin(a))};
        vertices[nSides - i - 1] = {x: vertices[i].x, y: -vertices[i].y}  // Y axis symmetry
    }

    var inset = size/2 + padding;
    var insetVertices = []
    var shift  = nSides/2 + Math.max(0, nSides/4 - 1); // shift vertex[0...] from lower right to upper left
    for (var i = 0; i < nSides; i++) {
        insetVertices[i] = vertices[(i + shift) % nSides];
        insetVertices[i].x += inset;
        insetVertices[i].y += inset;
    }

    return insetVertices;
}

// Insert two copies of each vertex after every other existing vertex, starting with vertex 1.  This 
// doubles the total number of vertices so that we can animate between a regular polygon with N vertices
// to one with N*2 vertices.

function insertDuplicateVertices(vertices) {
    for (var i = vertices.length - 1; i > 0; i -= 2) 
        vertices.splice(i, 0, vertices[i], vertices[i]);
    return vertices;
}

// For each corresponding pair of vertices v0,v1 in start,endPolygon compute
// {x: ux, y: uy, l: |v1-v0|}, where ux,uy is the v0,v1 unit vector and "|v1-v0|"
// is the length of v0,v1.

function createVertexDeltas(startPolygon, endPolygon)
{
    var vertexDeltas = [];
    for (var i = 0; i < startPolygon.vertices.length; i++) {
        var v0 = startPolygon.vertices[i];
        var v1 = endPolygon.vertices[i];
        var dx = v1.x - v0.x;
        var dy = v1.y - v0.y;
        var length = Math.sqrt(dx*dx + dy*dy);
        vertexDeltas.push({ux: (length == 0) ? 0 : dx/length, uy: (length == 0) ? 0 : dy/length, l: length});
    }
    return vertexDeltas;
}

var animationScenes = [
    // {startTime:, duration:, startPolygon, endPolygon, vertexDeltas}
];

var animationSceneIndex = 0;

function updateAnimation(t, svgElementId, shapeElementId) {
    var scene = animationScenes[animationSceneIndex];
    if (scene.startTime === undefined) {
        scene.startTime = t;
        return;
    }

    var percentComplete = Math.min(1, Math.max(0, (t - scene.startTime) / scene.duration));
    var startPolygon = scene.startPolygon;
    var vertexDeltas = scene.vertexDeltas;
    var vertices = [];

    for (var i = 0; i < startPolygon.vertices.length; i++) {
        var x = startPolygon.vertices[i].x + (percentComplete * vertexDeltas[i].l * vertexDeltas[i].ux);
        var y = startPolygon.vertices[i].y + (percentComplete * vertexDeltas[i].l * vertexDeltas[i].uy);
        vertices.push({x: x, y: y});
    }

    var svgPolygon = document.getElementById("svgPolygon");
    svgPolygon.setAttribute("points", vertices.map( function(p) { return p.x + "," + p.y; } ).join(" "));

    var cssVerticesString = vertices.map( function(p) { return p.x + "px " + p.y + "px"; } ).join(", ");
    document.getElementById(shapeElementId).style.webkitShapeInside = "polygon(" + cssVerticesString + ")"

    if (percentComplete >= 1) {
        if (animationSceneIndex < animationScenes.length - 1)
            animationSceneIndex += 1;
        else
            return true;
    }
    return false;
}

function generatePolygonShapeInsideElement(shapeElementId, size) {
    var shapeElement = document.getElementById(shapeElementId);
    shapeElement.style.width = size + "px"
    shapeElement.style.height = size + "px"
}

function generatePolygonSVGElement(svgElementId, size) {
    var svgNS = "http://www.w3.org/2000/svg";
    var svgPolygon = document.createElementNS(svgNS, "polygon");
    svgPolygon.setAttribute("id", "svgPolygon");

    var svgElement = document.getElementById(svgElementId);
    svgElement.style.width = size + "px";
    svgElement.style.height = size + "px";
    svgElement.appendChild(svgPolygon);
}

function initializeAnimation(svgElementId, shapeElementId) {
    var size = 525;
    var padding = 20;

    generatePolygonShapeInsideElement(shapeElementId, size + padding*2);
    generatePolygonSVGElement(svgElementId, size + padding*2);  // creates "svgPolygon"

    var vertexCount = 4;
    var sceneIndex = 0;

    animationScenes[0] = {
        duration: 800, 
        startPolygon: createPolygon(insertDuplicateVertices(createRegularPolygonVertices(size, vertexCount, padding))),
        endPolygon: createPolygon(createRegularPolygonVertices(size, vertexCount*2, padding))
    };

    animationScenes[1] = {
        duration: 900, 
        startPolygon: createPolygon(insertDuplicateVertices(createRegularPolygonVertices(size, vertexCount*2, padding))),
        endPolygon: createPolygon(createRegularPolygonVertices(size, vertexCount*4, padding))
    };

    animationScenes[2] = {
        duration: 1000, 
        startPolygon: animationScenes[1].endPolygon,
        endPolygon: animationScenes[1].endPolygon,
    };

    animationScenes[3] = {
        duration: 900, 
        startPolygon: animationScenes[1].endPolygon,
        endPolygon: animationScenes[1].startPolygon,
    };

    animationScenes[4] = {
        duration: 800, 
        startPolygon: animationScenes[0].endPolygon,
        endPolygon: animationScenes[0].startPolygon,
    };

    for (var i = 0; i < animationScenes.length; i++) {
        var scene = animationScenes[i];
        scene.vertexDeltas = createVertexDeltas(scene.startPolygon, scene.endPolygon);
    }
}

// window.{request,cancel}AnimationFrame shim from
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

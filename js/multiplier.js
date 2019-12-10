/**
Danny Abou-Chakra
Danny_AbouChakra@student.uml.edu
Danny Abou-Chakra Umass Lowell CS student, Copyright (c)
12/8/2019
Implementing sliders and tabs to multiplication table
**/

//given a row this function inserts a cell
function insertCell(row, text, attr = []) {
    var cell = document.createElement("td");
    if(attr.length){cell.setAttribute(attr[0],attr[1]); }
    var cellText = document.createTextNode(text);
    cell.appendChild(cellText);
    row.appendChild(cell);
}
//Draws table, takes inputs as an array
function drawTable(inputs) {
    
    hmin = inputs[0];
    hmax = inputs[1];
    vmin = inputs[2];
    vmax = inputs[3];
    
    //reference to div1  
    var div1 = document.getElementById("div1");

    //creating a table 
    var tbl = document.createElement("table");
    var tblBody = document.createElement("tbody");

    //hack to insert empty cell 
    var insertEmpty = 1;

    for(var j = vmin; j <= vmax; j++) { 
        //creating the rows
        var row = document.createElement("tr");
        //creates the header row
        var hrow = document.createElement("tr");
        hrow.setAttribute("id", "multiplier");
        //creating the cells 
        for (var i = hmin; i <= hmax; i++) {
            //add cells to header row
            if(j == vmin) {
                insertCell(hrow, i);
                if(insertEmpty) {
                    var empt = hrow.insertCell(0);
                    empt.innerHTML = "";
                    insertEmpty = 0;
                }            
                tblBody.appendChild(hrow);
            }
            //adds the column header
            if(i == hmin) {
                insertCell(row, j, ["id", "multiplicand"]);
            }
            insertCell(row, j*i);
        }
        tblBody.appendChild(row);
    }
    //append table body to table
    tbl.appendChild(tblBody);
    tbl.setAttribute("id", "multiplicationTable");

    //append table to div1
    if(div1.hasChildNodes()) {
        var exisitingTable = document.getElementById("multiplicationTable");
        div1.replaceChild(tbl, exisitingTable);
    }
    else { 
        div1.appendChild(tbl);
    }
}

$(document).ready(function(){  
    //parameters slider name and slider value 
    //generates new table based on change of slider
    function bindingSliders (slideName, slideValue) { 
        $("#"+slideName).slider({
            min: -50, max: 50, step: 1, value: 1,
            //upon slide generate a new table
            slide: function( event, ui ) {
                $("#"+slideValue).val(ui.value);
                if(slideValue == "horz1") {
                    drawTable([ui.value, $("#horz2").val(), $("#vert1").val(), $("#vert2").val()]);
                }
                if(slideValue == "horz2") { 
                    drawTable([$("#horz1").val(), ui.value, $("#vert1").val(), $("#vert2").val()]);
                }
                if(slideValue == "vert1") { 
                    drawTable([$("#horz1").val(), $("#horz2").val(), ui.value, $("#vert2").val()]);
                }
                if(slideValue == "vert2") { 
                    drawTable([$("#horz1").val(), $("#horz2").val(), $("#vert1").val(), ui.value]);
                }
            }
        });
        //saving old data in case user goes over limit 
        var initialValue = $("#"+slideName).slider("option", "value");
        $("#"+slideValue).val(initialValue);
        $("#"+slideValue).change(function() {
            var oldVal = $("#"+slideName).slider("option", "value");
            var newVal = $(this).val();
            if (isNaN(newVal) || newVal < -50 || newVal > 50) {
                //if user goes over limit replace with old value
                $("#"+slideValue).val(oldVal);
            } else {
                $("#"+slideName).slider("option", "value", newVal);
            }
        });
    }

    //initializing variables
    var horz1 = $("#horz1");
    var horz2 = $("#horz2"); 
    var vert1 = $("#vert1"); 
    var vert2 = $("#vert2");

    //slider-1
    bindingSliders("slider-1","horz1");
    //slider-2
    bindingSliders("slider-2","horz2");
    //slider-3
    bindingSliders("slider-3","vert1");
    //slider-4
    bindingSliders("slider-4","vert2");

    //dynamically creating table upon change of form value
    $('input').each(function() {
        var inputId = $(this).attr("id");
        $('#'+inputId).change(function() {
            drawTable([$("#horz1").val(), $("#horz2").val(), $("#vert1").val(), $("#vert2").val()]);
        });
    });

    //saving tabs
    $("#saveButton").click(function() {
            $("#tabs").tabs();
            //used to generate random ID for each new tab 
            var newTabID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            //used to generate random ID for each new cloned table
            var newTableID = Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5);
            //appending new tabs
            $("#listOfTabs").append("<li><a href=\"" + "#" +newTabID + "\">"+horz1.val() + " to " + horz2.val() + " by " + vert1.val() + " to " + vert2.val() +"</a></li>");
            $("#listOfTabs").after("<div id=" + "\'" + newTabID + "\'" + "></div>");
            //cloning table
            var savedTable = $("#multiplicationTable").clone();
            savedTable.attr("id",newTableID);
            savedTable.appendTo($("#"+newTabID));
            $("#tabs").tabs("refresh");
        
    });

    //remove tabs
    $("#removeTabs").click(function() {
        if($("#listOfTabs li").length > 0) {
            var tabIndex = parseInt($("#indexValue").val(), 10);
            var tab = $( "#tabs" ).find(".ui-tabs-nav li:eq(" + tabIndex + ")");
            var tabID = tab.attr("aria-controls");
            tab.remove();
            $("#" +tabID).remove();
            $("#tabs").tabs("refresh");
        } else {
            console.log("Can only remove exisiting tabs");
        }
    });
    
    //remove all tabs by deleting all index 0
    $("#removeAllTabs").click(function() { 
        var tab_count = $("#listOfTabs li").length;
        for (i=0; i<tab_count; i++){
            tab = $( "#tabs" ).find(".ui-tabs-nav li:eq(" + 0 + ")");
            var tabID = tab.attr("aria-controls");
            tab.remove();
            $("#" +tabID).remove();
            $("#tabs").tabs("refresh");
        }
    });
});

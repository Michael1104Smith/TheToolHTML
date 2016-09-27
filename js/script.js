/* 
 * Attach a context menu to a D3 element
 */
contextMenuShowing = false;

d3.select("body").on('click', function(d) {
    d3.select(".popup").remove();
    contextMenuShowing = false;
    //$("#hidObjectID").val(0);
});

d3.select("body").on('contextmenu', function(d, i) {
    var pageX = d3.event.pageX;
    var pageY = d3.event.pageY;
    if (contextMenuShowing) {
        d3.event.preventDefault();
        d3.select(".popup").remove();
        contextMenuShowing = false;
        //$("#hidObjectID").val(0);
    } else {
        //return;
        d3_target = d3.select(d3.event.target);
        if ((d3_target.classed("nodetext")) || (d3_target.classed("nodecircle"))) {
            d3.event.preventDefault();
            contextMenuShowing = true;

            d = d3_target.datum();
            var tContent = d.content;
            var tContentArray = tContent.split('|');
            var tName = tContentArray[0]
            var tObjectID = tContentArray[1];
            var tNodeType = tContentArray[2];
            var tDescription = tContentArray[3];
            if (tNodeType == "undefined")
                tNodeType = "Argument";
            if (tNodeType == "Argument") {
                var tPreamble = tContentArray[4];
                var tConclusion = tContentArray[5];
            }

            // Build the popup
            canvas = d3.select(".d3view");

            $('.d3view').each(function(){
                var offset = $(this).offset();
                var top = offset.top;
                var left = offset.left;
                var width = $(this).width();
                var height = $(this).height();
                if(pageX >= left && pageX <= left + width && pageY >= top && pageY <= top + height){
                    var id = $(this).attr('id');
                    var res = id.split('d3view');
                    toolIndex = parseInt(res[1]);
                    canvas = d3.select("#"+id);
                }
            });
            mousePosition = d3.mouse(canvas.node());

            popup = canvas.append("div")
                .attr("class", "popup")
                .style("left", pageX + "px")
                .style("top", (pageY-35) + "px");
            // popup.append("h2").text(d.display_division);
            // Details
            popup.append("input")
                .attr("type", "button")
                .attr("name", "Details")
                .attr("value", "Details")
                .attr("onclick", "ViewWithObjectID('" + tName + "', " + tObjectID + ", '" + tNodeType + "', '" + tDescription + "', '" + tPreamble + "', '" + tConclusion + "')");
            // add break
            if (tNodeType != "Reference") {
                popup.append("p");
                // Add New Object
                popup.append("input")
                    .attr("type", "button")
                    .attr("name", "Add")
                    .attr("value", "Add")
                    .attr("onclick", "addWithObjectID(" + tObjectID + ", '" + tNodeType + "')");
                popup.append("p");
                // Add New Object
                popup.append("input")
                    .attr("type", "button")
                    .attr("name", "Delete")
                    .attr("value", "Delete")
                    .attr("onclick", "deleteWithObjectID('" + tName + "', " + tObjectID + ", '" + tNodeType + "', '" + tDescription + "', '" + tPreamble + "', '" + tConclusion + "')");
            }
            //popup.append("p")
            //.append("a")
            //.attr("href", d.link)
            //.text(d.link_text);

            canvasSize = [
                canvas.node().offsetWidth,
                canvas.node().offsetHeight
            ];

            popupSize = [
                popup.node().offsetWidth,
                popup.node().offsetHeight
            ];

            if (popupSize[0] + mousePosition[0] > canvasSize[0]) {
                popup.style("left", "auto");
                popup.style("right", 0);
            }

            if (popupSize[1] + mousePosition[1] > canvasSize[1]) {
                popup.style("top", "auto");
                popup.style("bottom", 0);
            }
        }
    }
});

function ViewWithObjectID(pName, pObjectID, pNodeType, pDescr, pPreamble, pConclusion) {
    if (contextMenuShowing) {
        d3.select(".popup").remove();
        contextMenuShowing = false;

        // Set the text fields for preview
        $("#txtName").val(pName);
        $("#txtDescription").val(pDescr);

        // Set Modal header text
        $("#modalDetailsLabel").text(pNodeType + " Details");

        // Set ObjectId in hidden field for easier access to backend code
        $("#hidObjectID").val(pObjectID);
        $("#hidNodeType").val(pNodeType);

        // Hide The Preamble and Cocnclusion if not Argument
        if (pNodeType == "Argument") {
            $(".preamble").show();
            $(".conclusion").show();
            $("#txtPreamble").val(pPreamble);
            $("#txtConclusion").val(pConclusion);
        } else {
            $(".preamble").hide();
            $(".conclusion").hide();
            $("#txtPreamble").val("");
            $("#txtConclusion").val("");
        }


        // hide the "Add" button
        $("#btnSubmitAdd").attr("disabled", "disabled");
        $("#btnSubmitAdd").hide();

        $('#modalDetails .ModalDetails').show();
        // Show Popup
        $('#modalDetails').modal('show');
        crud_status = UPDATE;
        selected_pName = pName;
        selected_pObjectID = pObjectID;
        selected_pNodeType = pNodeType;
        selected_pDescr = pDescr;
        selected_pPreamble = pPreamble;
        selected_pConclusion = pConclusion;
    }
};

function addWithObjectID(pObjectID, pNodeType) {
    if (contextMenuShowing) {
        d3.select(".popup").remove();
        contextMenuShowing = false;

        // Set Modal header text
        if (pNodeType == "Argument") {
            if (pObjectID == 0)
                $("#modalDetailsLabel").text("Add Argument");
            else
                $("#modalDetailsLabel").text("Add Argument Premise");
        } else if (pNodeType == "Premise")
            $("#modalDetailsLabel").text("Add Premise Support");
        else if (pNodeType == "Support")
            $("#modalDetailsLabel").text("Add Support Reference");
        else
            $("#modalDetailsLabel").text("Add Some Random Stuff");

        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#txtPreamble").val("");
        $("#txtConclusion").val("");

        // Hide The Preamble and Cocnclusion 
        $(".preamble").hide();
        $(".conclusion").hide();
        $("#txtPreamble").val("");
        $("#txtConclusion").val("");


        // Set ObjectId in hidden field for easier access to backend code
        $("#hidObjectID").val(pObjectID);
        $("#hidNodeType").val(pNodeType);
        // show the "Add" button
        $("#btnSubmitAdd").removeAttr('disabled');
        $("#btnSubmitAdd").hide();

        $('#modalDetails .ModalDetails').show();
        // Show Popup
        $('#modalDetails').modal('show');

        crud_status = CREATE;
        selected_pObjectID = pObjectID;
        selected_pNodeType = pNodeType;
    }
};

function deleteWithObjectID(pName, pObjectID, pNodeType, pDescr, pPreamble, pConclusion) {
    if (contextMenuShowing) {
        d3.select(".popup").remove();
        contextMenuShowing = false;

        $('#modalDetailsLabel').text('Do you really remove the "'+pName+'"?');

        $("#txtName").val("");
        $("#txtDescription").val("");
        $("#txtPreamble").val("");
        $("#txtConclusion").val("");

        // Hide The Preamble and Cocnclusion 
        $(".preamble").hide();
        $(".conclusion").hide();
        $("#txtPreamble").val("");
        $("#txtConclusion").val("");


        // Set ObjectId in hidden field for easier access to backend code
        $("#hidObjectID").val(pObjectID);
        $("#hidNodeType").val(pNodeType);
        // show the "Add" button
        $("#btnSubmitAdd").removeAttr('disabled');
        $("#btnSubmitAdd").hide();

        $('#modalDetails .ModalDetails').hide();
        // Show Popup
        $('#modalDetails').modal('show');

        crud_status = DELETE;
        selected_pObjectID = pObjectID;
        selected_pNodeType = pNodeType;
    }
};

function addNewArgument() {
    $("#hidObjectID").val("0");
    $("#hidNodeType").val("Argument");
    $("#modalDetailsLabel").text("Add Argument");
    $('#btnSubmitAdd').hide();
    $('#modalDetails .ModalDetails').show();
    $('#modalDetails').modal('show');
    crud_status = ROOT_CREATE;
};

function refreshView() {
    //demo.run({
    //    data: flare2treed(toolData),
    //    ctrlOptions: {
    //        noCollapseRoot: false
    //    },
    //    el: 'editme',
    //    noTitle: true
    //}, initD3);
}


//<![CDATA[
var Page_Validators = new Array(document.getElementById("ctl06"), document.getElementById("ctl08"));
//]]>


//<![CDATA[
var ctl06 = document.all ? document.all["ctl06"] : document.getElementById("ctl06");
ctl06.controltovalidate = "txtName";
ctl06.focusOnError = "t";
ctl06.errormessage = "<br />Name is required.";
ctl06.display = "Dynamic";
ctl06.validationGroup = "AddObject";
ctl06.evaluationfunction = "RequiredFieldValidatorEvaluateIsValid";
ctl06.initialvalue = "";
var ctl08 = document.all ? document.all["ctl08"] : document.getElementById("ctl08");
ctl08.controltovalidate = "txtDescription";
ctl08.errormessage = "<br />Description is required.";
ctl08.display = "Dynamic";
ctl08.validationGroup = "AddObject";
ctl08.evaluationfunction = "RequiredFieldValidatorEvaluateIsValid";
ctl08.initialvalue = "";
//]]>


//<![CDATA[
$('.modal').modal('hide');
refreshView();
var Page_ValidationActive = false;
if (typeof(ValidatorOnLoad) == "function") {
    ValidatorOnLoad();
}

function ValidatorOnSubmit() {
    if (Page_ValidationActive) {
        return ValidatorCommonOnSubmit();
    } else {
        return true;
    }
}

document.getElementById('ctl06').dispose = function() {
    Array.remove(Page_Validators, document.getElementById('ctl06'));
}

document.getElementById('ctl08').dispose = function() {
        Array.remove(Page_Validators, document.getElementById('ctl08'));
    }
    //]]>

$(document).ready(function(){

    maxId = parseInt(toolData[0].myid);
    getMaxId(toolData);

    $('#ok_btn').click(function(){
        $('.modal').modal('hide');
        switch(crud_status){
            case CREATE:
                create_details();
                break;
            case READ:
                break;
            case UPDATE:
                update_details();
                break;
            case DELETE:
                delete_details();
                break;
            case ROOT_CREATE:
                root_create();
                break;
        }
        crud_status = NONE;
    });
})

function getMaxId(children){
    if(children){
        var myid = parseInt(children.myid);
        if(maxId < myid){
            maxId = myid;
        }
        var i;
        for(i = 0; i < children.length; i++){
            getMaxId(children[i]);
            if(children[i].children){
                getMaxId(children[i].children);
            }
        }
    }
}

function replaceObject(children, txtName, Description){
    if(children){
        if(children.name == selected_pName && children.myid == selected_pObjectID 
            && children.nodetype == selected_pNodeType && children.description == selected_pDescr){
            children.name = txtName;
            children.description = Description;
            return;
        }else{
            var i;
            for(i = 0; i < children.length; i++){
                replaceObject(children[i], txtName, Description);
                if(children[i].children){
                    replaceObject(children[i].children, txtName, Description);
                }
            }
        }
    }
}

function addObject(children, txtName, Description){
    if(children){
        if(children.myid == selected_pObjectID && children.nodetype == selected_pNodeType){
            var i;
            for(i = 0; i < NodeTypeLevel.length; i++){
                if(selected_pNodeType == NodeTypeLevel[i]){
                    break;
                }
            }
            maxId++;
            var tmp = {name : txtName, myid : maxId, nodetype : NodeTypeLevel[i+1], description : Description};
            if(children.children){
                children.children.push(tmp);
            }else{
                children.children = [tmp];
            }
            return;
        }else{
            var i;
            for(i = 0; i < children.length; i++){
                addObject(children[i], txtName, Description);
                if(children[i].children){
                    addObject(children[i].children, txtName, Description);
                }
            }
        }
    }
}

function deleteObject(children, parent){
    if(children){
        if(children.myid == selected_pObjectID && children.nodetype == selected_pNodeType){
            var i;
            for(i = 0; i < parent.length; i++){
                if(parent[i].myid == selected_pObjectID && parent[i].nodetype == selected_pNodeType){
                    parent.splice(i,1);
                    return;
                }
            }
        }else{
            if(children.children){
                var i;
                for(i = 0; i < children.children.length; i++){
                    deleteObject(children.children[i], children.children);
                }
            }
        }
    }
}

function searchObject(children){
    if(children){
        if(children.myid == selected_pObjectID && children.nodetype == selected_pNodeType){
            return children;
        }else{
            if(children.children){
                var i;
                for(i = 0; i < children.children.length; i++){
                    deleteObject(children.children[i]);
                }
            }
        }
    }
}

function deleteSVG(children){
    if(children){
        for(i = 0; i < children.length; i++){
            var g = $('#_'+children[i].nodetype+'-'+children[i].myid);
            var path = $('#link_'+children[i].nodetype+'-'+children[i].myid);
            g.remove();
            path.remove();
            if(children[i].children){
                deleteSVG(children[i].children);
            }
        }
    }
}

function update_details(){
    var txtName = $('#txtName').val();
    var Description = $('#txtDescription').val();
    if(selected_pNodeType == 'Argument'){
        var txtPreamble = $('#txtPreamble').val();
        var txtConclusion = $('#txtConclusion').val();
        toolData[toolIndex].name = txtName;
        toolData[toolIndex].description = Description;
        toolData[toolIndex].preamble = txtPreamble;
        toolData[toolIndex].conclusion = txtConclusion;
        topLevelName[toolIndex] = txtName + "|" + toolData[toolIndex].myid + "|" + toolData[toolIndex].nodetype + "|" + toolData[toolIndex].description + "|" + toolData[toolIndex].preamble + "|" + toolData[toolIndex].conclusion + "|" + toolData[toolIndex].subargumentid;
        selected_D.content = topLevelName[toolIndex];
        var text = $('#_'+selected_pNodeType+'-'+selected_pObjectID+' text');
        text.html(txtName);
    }else{
        var text = $('#_'+selected_pNodeType+'-'+selected_pObjectID+' text');
        text.html(txtName);
        selected_SVG_Id = '#_'+selected_pNodeType+'-'+selected_pObjectID;
        replaceObject(toolData[toolIndex].children, txtName, Description);
        var content = selected_D.content;
        var content_arr = content.split('|');
        selected_D.content = txtName+"|"+content_arr[1]+"|"+content_arr[2]+"|"+Description+"|"+content_arr[4]+"|"+content_arr[5]+"|"+content_arr[6];
    }
}

function create_details(){
    var txtName = $('#txtName').val();
    var Description = $('#txtDescription').val();
    if(txtName == ''){
        alert('You should input Name');
    }else if(Description == ''){
        alert('You should input Description');
    }else{
        if(selected_pNodeType == 'Argument'){
            maxId++;
            var tmp = {name : txtName, myid : maxId, nodetype : NodeTypeLevel[1], subargumentid:"0", description : Description};
            toolData[toolIndex].children.push(tmp);
        }else{
            console.log(selected_D);
            addObject(toolData[toolIndex].children, txtName, Description);
        }
        rootFlag = 2;
        demo.run({
            data: flare2treed(toolData[toolIndex]),
            ctrlOptions: {
                noCollapseRoot: false
            },
            el: 'editme',
            noTitle: true
        }, initD3);
    }
}

function delete_details(){
    if(selected_pNodeType == 'Argument'){
        var i;
        for(i = 0; i < toolData.length; i++){
            if(toolData[i].myid == selected_pObjectID){
                toolData.splice(i,1);
                topLevelName.splice(i,1);
                $('#d3view'+i).remove();
                $('.d3view').each(function(){
                    var id = $(this).attr('id');
                    var res = id.split('d3view');
                    var ind = parseInt(res[1]);
                    if(ind > i){
                        $(this).attr('id','d3view'+(ind-1));
                    }
                })
                break;
            }
        }
    }else{

        var i;
        // var children;
        // for(i = 0; i < toolData[toolIndex].children.length; i++){
        //     var tmp = searchObject(toolData[toolIndex].children[i]);
        //     if(tmp) {
        //         children = tmp;
        //         break;
        //     }
        // }
        // deleteSVG(children.children);
        for(i = 0; i < toolData[toolIndex].children.length; i++){
            deleteObject(toolData[toolIndex].children[i], toolData[toolIndex].children);
        }
        // var g = $('#_'+selected_pNodeType+'-'+selected_pObjectID);
        // var path = $('#link_'+selected_pNodeType+'-'+selected_pObjectID);
        // g.remove();
        // path.remove();
        demo.run({
            data: flare2treed(toolData[toolIndex]),
            ctrlOptions: {
                noCollapseRoot: false
            },
            el: 'editme',
            noTitle: true
        }, initD3);
    }
}

function root_create(){
    var txtName = $('#txtName').val();
    var Description = $('#txtDescription').val();
    var txtPreamble = $('#txtPreamble').val();
    var txtConclusion = $('#txtConclusion').val();
    maxId++;
    var tmp = {name : txtName, myid : maxId, nodetype : 'Argument', description : Description, preamble : txtPreamble, conclusion : txtConclusion, children: []};
    var length = toolData.length;
    toolData.push(tmp);
    $('#charts').append('<div id="d3view'+length+'" class="d3view"></div>');

    rootFlag = 1;

    toolIndex = toolData.length - 1;
    demo.run({
        data: flare2treed(toolData[toolIndex]),
        ctrlOptions: {
            noCollapseRoot: false
        },
        el: 'editme',
        noTitle: true
    }, initD3);
}
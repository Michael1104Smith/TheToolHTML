var NONE = 0;
var CREATE = 1;
var READ = 2;
var UPDATE = 3;
var DELETE = 4;
var ROOT_CREATE = 5;
var ROOT_DELETE = 6;
var crud_status = 0;
var selected_pName;
var selected_pObjectID;
var selected_pNodeType;
var selected_pDescr;
var selected_pPreamble;
var selected_pConclusion;
var maxId = 0;
var NodeTypeLevel = ['Argument','Premise','Support','Add1','Add2','Add3','Add4','Add5','Add6'];
var toolData;
var toolIndex = 0;
var rootFlag = 1;
var selected_SVG_Id = '#d3view0';
var selected_D;
//<![CDATA[
toolData = [{
    "name": "Ban Assault Rifles",
    "myid": "1",
    "nodetype": "Argument",
    "description": "Assault rifles are not useful for personal defense or sport.  They present a danger to the general community.  They should not be legal to own or operate without special permission.",
    "preamble": "General introduction.",
    "conclusion": "Wrap-up of the argument.",
    "children": [{
        "name": "Premise 10",
        "myid": "13",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "P10"
    }, {
        "name": "Premise 9",
        "myid": "12",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "P9"
    }, {
        "name": "Premise 8",
        "myid": "11",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "P8"
    }, {
        "name": "Premise 7 SUBARG",
        "myid": "10",
        "nodetype": "Premise",
        "subargumentid": "1",
        "description": "jf"
    }, {
        "name": "Premise 6",
        "myid": "9",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "Test new premise"
    }, {
        "name": "Premise 4",
        "myid": "4",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "Premise 4 Description",
        "children": [{
            "name": "refresh 10",
            "myid": "26",
            "nodetype": "Support",
            "description": "10"
        }, {
            "name": "refresh 10",
            "myid": "27",
            "nodetype": "Support",
            "description": "refres 10"
        }, {
            "name": "refresh 12",
            "myid": "28",
            "nodetype": "Support",
            "description": "refresh 12"
        }, {
            "name": "refresh 13",
            "myid": "29",
            "nodetype": "Support",
            "description": "13"
        }, {
            "name": "refresh 14",
            "myid": "30",
            "nodetype": "Support",
            "description": "14"
        }, {
            "name": "refresh 15",
            "myid": "31",
            "nodetype": "Support",
            "description": "15"
        }, {
            "name": "refresh 16",
            "myid": "32",
            "nodetype": "Support",
            "description": "16"
        }]
    }, {
        "name": "Premise 5 SUBARG",
        "myid": "7",
        "nodetype": "Premise",
        "subargumentid": "1",
        "description": "Sub",
        "children": [{
            "name": "yes?",
            "myid": "54",
            "nodetype": "Support",
            "description": "t"
        }, {
            "name": "one more time",
            "myid": "55",
            "nodetype": "Support",
            "description": "one more"
        }, {
            "name": "NewSupp1b",
            "myid": "8",
            "nodetype": "Support",
            "description": "SupDesc1b",
            "children": [{
                "name": "SRef2",
                "myid": "7",
                "nodetype": "Reference",
                "description": "SrefRef2"
            }, {
                "name": "SRef1",
                "myid": "6",
                "nodetype": "Reference",
                "description": "SrefRef1"
            }]
        }, {
            "name": "NewSupp2b",
            "myid": "9",
            "nodetype": "Support",
            "description": "SupDesc2b"
        }]
    }, {
        "name": "Premise 3",
        "myid": "3",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "Premise 3 Description",
        "children": [{
            "name": "gn",
            "myid": "33",
            "nodetype": "Support",
            "description": "cgfn"
        }, {
            "name": "testing 123",
            "myid": "52",
            "nodetype": "Support",
            "description": "testing"
        }, {
            "name": "testing 123",
            "myid": "53",
            "nodetype": "Support",
            "description": "testing"
        }, {
            "name": "Support 1",
            "myid": "1",
            "nodetype": "Support",
            "description": "Support 1 Description",
            "children": [{
                "name": "http://cygnusoft.com",
                "myid": "2",
                "nodetype": "Reference",
                "description": "Jus plain badass!"
            }, {
                "name": "http://www.houndcomputers.com",
                "myid": "1",
                "nodetype": "Reference",
                "description": "Finest custom software on the planet."
            }]
        }, {
            "name": "Support 2",
            "myid": "2",
            "nodetype": "Support",
            "description": "Support 2 Description"
        }, {
            "name": "Support 3",
            "myid": "3",
            "nodetype": "Support",
            "description": "Support 3 Description",
            "children": [{
                "name": "details",
                "myid": "15",
                "nodetype": "Reference",
                "description": "details"
            }]
        }]
    }, {
        "name": "Premise 2",
        "myid": "2",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "Premise 2 Description",
        "children": [{
            "name": "gnnfxgn",
            "myid": "34",
            "nodetype": "Support",
            "description": "fgxn"
        }, {
            "name": "yes?",
            "myid": "35",
            "nodetype": "Support",
            "description": "yes"
        }, {
            "name": "come on",
            "myid": "36",
            "nodetype": "Support",
            "description": "come on"
        }, {
            "name": "getting mad",
            "myid": "37",
            "nodetype": "Support",
            "description": "grrrr"
        }, {
            "name": "11111",
            "myid": "38",
            "nodetype": "Support",
            "description": "11"
        }, {
            "name": "22222",
            "myid": "39",
            "nodetype": "Support",
            "description": "2222"
        }, {
            "name": "3333",
            "myid": "40",
            "nodetype": "Support",
            "description": "333"
        }, {
            "name": "444",
            "myid": "41",
            "nodetype": "Support",
            "description": "444"
        }, {
            "name": "444",
            "myid": "42",
            "nodetype": "Support",
            "description": "444"
        }, {
            "name": "555",
            "myid": "43",
            "nodetype": "Support",
            "description": "555"
        }, {
            "name": "666666",
            "myid": "44",
            "nodetype": "Support",
            "description": "6666"
        }, {
            "name": "777",
            "myid": "45",
            "nodetype": "Support",
            "description": "7777"
        }, {
            "name": "888",
            "myid": "46",
            "nodetype": "Support",
            "description": "888"
        }, {
            "name": "9999999999",
            "myid": "47",
            "nodetype": "Support",
            "description": "9999999999"
        }, {
            "name": "101010101",
            "myid": "48",
            "nodetype": "Support",
            "description": "10"
        }, {
            "name": "11111",
            "myid": "49",
            "nodetype": "Support",
            "description": "11111"
        }, {
            "name": "121212",
            "myid": "50",
            "nodetype": "Support",
            "description": "12"
        }, {
            "name": "13",
            "myid": "51",
            "nodetype": "Support",
            "description": "13"
        }, {
            "name": "Support Test 1",
            "myid": "12",
            "nodetype": "Support",
            "description": "Testing adding support to Premise 2"
        }, {
            "name": "Support Test 2",
            "myid": "13",
            "nodetype": "Support",
            "description": "Support Test 2 descr",
            "children": [{
                "name": "ref",
                "myid": "10",
                "nodetype": "Reference",
                "description": "ref 1"
            }, {
                "name": "one mre ref",
                "myid": "9",
                "nodetype": "Reference",
                "description": "one mre ref"
            }, {
                "name": "Add Support Test 2 Reference",
                "myid": "8",
                "nodetype": "Reference",
                "description": "Add Support Test 2 Reference"
            }]
        }]
    }, {
        "name": "Premise 1",
        "myid": "1",
        "nodetype": "Premise",
        "subargumentid": "0",
        "description": "Premise 1 Description",
        "children": [{
            "name": "refresh test",
            "myid": "17",
            "nodetype": "Support",
            "description": "dgr"
        }, {
            "name": "refresh 2",
            "myid": "18",
            "nodetype": "Support",
            "description": "refresh 2"
        }, {
            "name": "refresh 3",
            "myid": "19",
            "nodetype": "Support",
            "description": "refresh 3"
        }, {
            "name": "refresh 4",
            "myid": "20",
            "nodetype": "Support",
            "description": "refresh 4"
        }, {
            "name": "refresh 5",
            "myid": "21",
            "nodetype": "Support",
            "description": "refresh 5"
        }, {
            "name": "refresh 5",
            "myid": "22",
            "nodetype": "Support",
            "description": "refresh 5"
        }, {
            "name": "ref 6",
            "myid": "23",
            "nodetype": "Support",
            "description": "ref 6"
        }, {
            "name": "refresh 7",
            "myid": "24",
            "nodetype": "Support",
            "description": "7"
        }, {
            "name": "refresh 8",
            "myid": "25",
            "nodetype": "Support",
            "description": "8"
        }, {
            "name": "Prem 1 Support",
            "myid": "16",
            "nodetype": "Support",
            "description": "hh"
        }]
    }]
}]; //]]>


//<![CDATA[
if (typeof(Sys) === 'undefined') throw new Error('ASP.NET Ajax client-side framework failed to load.');
//]]>


//<![CDATA[
function WebForm_OnSubmit() {
    if (typeof(ValidatorOnSubmit) == "function" && ValidatorOnSubmit() == false) return false;
    return true;
}
//]]>


//<![CDATA[
Sys.WebForms.PageRequestManager._initialize('ScriptManager1', 'form1', [], [], [], 90, '');
//]]>
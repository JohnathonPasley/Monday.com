//this script just assumes you are going to take the first row in a sheet and add it to Monday.com. Make modifications to this snippet if you want to loop through rows.

function InsertRows2Monday()
{
  var url = "https://api.monday.com/v2";
  var boardid = 123456789; // what is the board you'll like to use. 
  var key = "zeyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI0Mjc1Nbg4J1aWQiOjk4Mjk3NzIsImlhZCI6IjIwMTktMTAtMTEgMDM6MDABDVVRDIiwicGVyIjoibWU6d3JpdGUifQ.hxxxxxxxxx"; //fake key, replace with yours from your Monday.com
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName("Account Assignments")); // Update the sheet you are pulling from
  var accountid = SpreadsheetApp.getActiveSheet().getRange('AH2').getValue(); //rename the variables to what you want, also change to the column you want
  var accountname = SpreadsheetApp.getActiveSheet().getRange('AI2').getValue();
  var querycreation = "mutation {create_item (board_id:" + boardid + ",item_name: \"" + accountname + "\",column_values:";
  var querycreation2= "{\"text\":\""+accountid+"\"}";
  var querycreation3 = "){id}}";
  var jsonquery = JSON.stringify(querycreation2);
  var cleanedquery = querycreation + jsonquery + querycreation3; // I also hate writing queries where you need to escape character so I broke it out in parts. Very lazy but update as you see fit.
  Logger.log("API: " + cleanedquery); // not necessary I just happened to like to see what was going into Monday.com in the logs

  var variables = {
    "board" : boardid
  };
    var options = {
    "method" : "post",
    "muteHttpExceptions": true,
    "headers" : {
      "Authorization" : key,
    },
    "payload" : JSON.stringify({
      "query" : cleanedquery,
      "variables" : variables
    }),
    "contentType" : "application/json"
  };
  var response=UrlFetchApp.fetch(url,options);
  Logger.log("API results: " + response.getContentText());
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  SpreadsheetApp.setActiveSheet(spreadsheet.getSheetByName("Pulse ID")); //I saved my ids in a sheet, sorta like a db. Eliminating duplicates. This just tells the app we are going to be saving data in the Pulse ID tab, rename as you see fit.
  SpreadsheetApp.getActiveSheet().getRange('B2:B2').activate();
  SpreadsheetApp.getActiveSheet().insertRowsBefore(2,1); //creating a new row at the top of the sheet
  SpreadsheetApp.getActiveSheet().getRange('A2').setValue(data.data.create_item.id);
  SpreadsheetApp.getActiveSheet().getRange('B2').setValue(accountid);
  SpreadsheetApp.getActiveSheet().getRange('C2').setValue(boardid);
};


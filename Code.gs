function getSheetForDate() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const today = new Date();
  const sheetName = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM");
  
  // Try to get existing sheet for current month
  let sheet = ss.getSheetByName(sheetName);
  
  // If sheet doesn't exist, create it
  if (!sheet) {
    // Get the template sheet (first sheet)
    const templateSheet = ss.getSheets()[0];
    
    // Create new sheet as a copy of the template
    sheet = templateSheet.copyTo(ss);
    sheet.setName(sheetName);
    
    // Clear any existing data in the new sheet
    const lastRow = sheet.getLastRow();
    if (lastRow > 10) {
      sheet.getRange(11, 1, lastRow - 10, sheet.getLastColumn()).clearContent();
    }
  }
  
  return sheet;
}

function findExistingEntry(sheet, name, job, date) {
  const data = sheet.getDataRange().getValues();
  // Start from row 11 (index 10) to skip headers
  for (let i = 10; i < data.length; i++) {
    const row = data[i];
    if (!row[0]) continue; // Skip empty rows
    
    // Convert date to string for comparison
    const rowDate = Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (rowDate === date && 
        row[1] && row[1].toString().toLowerCase() === name.toLowerCase() && 
        row[2] && row[2].toString().toLowerCase() === job.toLowerCase() &&
        (!row[5] || row[5] === '')) { // Check if sign-out time is empty
      return i + 1; // Return 1-based row number
    }
  }
  return null;
}

function calculateWorkHours(signInTime, signOutTime) {
  try {
    // Convert times to Date objects for today
    const today = new Date();
    const [signInHours, signInMinutes] = signInTime.split(':').map(Number);
    const [signOutHours, signOutMinutes] = signOutTime.split(':').map(Number);
    
    const signInDate = new Date(today);
    signInDate.setHours(signInHours, signInMinutes, 0);
    
    const signOutDate = new Date(today);
    signOutDate.setHours(signOutHours, signOutMinutes, 0);
    
    // Calculate difference in minutes
    const diffMinutes = (signOutDate - signInDate) / (1000 * 60);
    
    // Convert to hours and minutes
    const hours = Math.floor(diffMinutes / 60);
    const minutes = Math.round(diffMinutes % 60);
    
    return `${hours}h ${minutes}m`;
  } catch (e) {
    return 'Error calculating hours';
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getSheetForDate();
    const today = new Date();
    const dateStr = Utilities.formatDate(today, Session.getScriptTimeZone(), "yyyy-MM-dd");
    
    if (data.type === 'signin') {
      // Calculate late time
      const currentTime = new Date();
      const deadline = new Date();
      deadline.setHours(8, 15, 0); // 8:15 AM deadline
      
      let status = 'on-time';
      let lateTime = '';
      
      if (currentTime > deadline) {
        status = 'late';
        const diffMinutes = Math.round((currentTime - deadline) / (1000 * 60));
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        lateTime = `${hours}h ${minutes}m`;
      }
      
      // Add new entry
      const timeStr = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), "HH:mm");
      const rowData = [
        dateStr,
        data.name,
        data.job,
        timeStr,
        status,
        '', // Sign-out time (empty for now)
        lateTime,
        data.comments || ''
      ];
      
      sheet.appendRow(rowData);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Sign-in recorded successfully',
        status: status,
        lateTime: lateTime
      })).setMimeType(ContentService.MimeType.JSON);
      
    } else if (data.type === 'signout') {
      // Find existing entry
      const row = findExistingEntry(sheet, data.name, data.job, dateStr);
      
      if (row) {
        const currentTime = new Date();
        const timeStr = Utilities.formatDate(currentTime, Session.getScriptTimeZone(), "HH:mm");
        
        // Get sign-in time
        const signInTime = sheet.getRange(row, 4).getValue();
        
        // Calculate work hours
        const workHours = calculateWorkHours(signInTime, timeStr);
        
        // Update sign-out time and work hours
        sheet.getRange(row, 6).setValue(timeStr);
        sheet.getRange(row, 7).setValue(workHours);
        
        return ContentService.createTextOutput(JSON.stringify({
          success: true,
          message: 'Sign-out recorded successfully',
          workHours: workHours
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'No matching sign-in record found for today'
        })).setMimeType(ContentService.MimeType.JSON);
      }
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'Error: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
} 
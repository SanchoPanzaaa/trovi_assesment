export async function handleRequest(req) {
    const rows = await queryDatabaseData(req)

    const attendanceRecords = rows.sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
    let dailyRecords = attendanceRecords.filter(record => {
        const recordDate = new Date(record.datetime).setHours(0, 0, 0, 0);
        return recordDate === currentDate.setHours(0, 0, 0, 0);
    });
    const processedRecords = this.proccessData(dailyRecords);
    
    currentDate.setDate(currentDate.getDate()); // currentDate + 1

    return processedRecords;
    }
}

export function proccessData(dailyRecords) {
    
    let firstInTime, lastOutTime, totalBreakDuration = 0;
    let isBreak = false, breakStartTime;
  
    let adjustedLastOutTime = lastOutTime; 
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999); 
    
    if (!lastOutTime || isBreak) {
      // (!out || in break) === endOfDay
      adjustedLastOutTime = isBreak ? breakStartTime : endOfDay;
    }
    
    dailyRecords.forEach(record => {
      const action = record.action;
      const currentTime = new Date(record.datetime);
      if (action === 'in' && currentTime > lastOutTime) {
        adjustedLastOutTime = endOfDay;
      }
    });
    
    let totalWorkDuration = adjustedLastOutTime - firstInTime - totalBreakDuration;
    
    totalWorkDuration = Math.max(0, totalWorkDuration);
    
    let processedRecordsArray = [];
    processedRecordsArray.push({
      date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD
      firstInTime: firstInTime.toISOString(),
      lastOutTime: adjustedLastOutTime.toISOString(),
      totalWorkDuration: totalWorkDuration,
      totalBreakDuration
    });

    return processedRecordsArray
}

async function queryDatabaseData(requestData) {
  return await db.query(
    'SELECT * FROM slack_attendance WHERE username = ? AND datetime BETWEEN ? AND ?',
    [requestData.username, new Date(requestData.startDate), new Date(requestData.endDate)]
  );
}

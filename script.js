let currentAlarms = [];

function generateRandomAlarms() {
    const alarmList = document.getElementById("alarmList");
    alarmList.innerHTML = "";

    const alarmCount = 5; // จำนวนเวลาที่จะสุ่ม
    const startHour = 9;
    const endHour = 21;

    let times = new Set();

    while (times.size < alarmCount) {
        let hour = Math.floor(Math.random() * (endHour - startHour + 1)) + startHour;
        let minute = Math.floor(Math.random() * 60);
        let timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.add(timeStr);
    }

    currentAlarms = [...times].sort();

    currentAlarms.forEach(time => {
        const li = document.createElement("li");
        li.textContent = `🕒 ${time}`;
        alarmList.appendChild(li);
    });
}

function downloadICS() {
    if (currentAlarms.length === 0) return alert("ยังไม่มีเวลาที่จะส่งเข้าแอปปฏิทิน!");

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n`;
    const today = new Date().toISOString().split("T")[0];

    currentAlarms.forEach((time, index) => {
        const [hour, minute] = time.split(":");
        const dtStart = `${today}T${hour}${minute}00`;
        const dtEnd = `${today}T${hour}${(parseInt(minute) + 5).toString().padStart(2, '0')}00`;
        icsContent += `BEGIN:VEVENT\nSUMMARY:⏰ เตือนสติ (เวลา ${time})\nDTSTART:${dtStart.replace(/[-:]/g, '')}\nDTEND:${dtEnd.replace(/[-:]/g, '')}\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent.replace(/\n/g, "\r\n")], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'random-alarms.ics';
    link.click();
}
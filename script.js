
        let currentAlarms = [];

        function generateRandomAlarms() {
            const alarmList = document.getElementById("alarmList");
            alarmList.innerHTML = "";

            const alarmCount = 5;
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

            document.getElementById("downloadBtn").disabled = false;
        }

        function downloadICS() {
            if (currentAlarms.length === 0) return alert("ยังไม่มีเวลาที่จะส่งเข้าแอปปฏิทิน!");

            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');
            const todayStr = `${year}${month}${day}`;
            const dtStamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

            let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n` +
                             `BEGIN:VTIMEZONE\nTZID:Asia/Bangkok\nBEGIN:STANDARD\nDTSTART:19700101T000000\nTZOFFSETFROM:+0700\nTZOFFSETTO:+0700\nTZNAME:ICT\nEND:STANDARD\nEND:VTIMEZONE\n`;

            currentAlarms.forEach((time, index) => {
                const [hour, minute] = time.split(":");
                const dtStart = `${todayStr}T${hour}${minute}00`;
                const endMinute = (parseInt(minute) + 5).toString().padStart(2, '0');
                const dtEnd = `${todayStr}T${hour}${endMinute}00`;
                const uid = `${todayStr}-${hour}${minute}-${index}@randomalarm`;

                icsContent += `BEGIN:VEVENT\n` +
                              `UID:${uid}\n` +
                              `DTSTAMP:${dtStamp}\n` +
                              `SUMMARY:⏰ เตือนสติ (เวลา ${time})\n` +
                              `DTSTART;TZID=Asia/Bangkok:${dtStart}\n` +
                              `DTEND;TZID=Asia/Bangkok:${dtEnd}\n` +
                              `END:VEVENT\n`;
            });

            icsContent += `END:VCALENDAR`;

            const blob = new Blob([icsContent.replace(/\n/g, "\r\n")], { type: 'text/calendar;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'random-alarms.ics';
            link.click();
        }

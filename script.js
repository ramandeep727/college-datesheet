let holidays = [];
let courses = {};

function addCourse(){

    let college = document.getElementById("college").value;
    let course = document.getElementById("course").value;
    let semester = document.getElementById("semester").value;
    let subjects = document.getElementById("subjects").value;

    if(!subjects){
        alert("Enter subjects");
        return;
    }

    if(!colleges[college]){
        colleges[college] = [];
    }

    colleges[college].push({
        course,
        semester,
        subjects: subjects.split(",").map(s=>s.trim())
    });

    document.getElementById("subjects").value = "";

    showPreview();
}


function showPreview(){

    let html = "";

    for(let college in colleges){

        html += `<h3>${college}</h3>`;

        colleges[college].forEach(c=>{
            html += `<p>${c.course} - ${c.semester}: ${c.subjects.join(", ")}</p>`;
        });
    }

    preview.innerHTML = html;
}

function generate(){

    let startDate = document.getElementById("startDate").value;

    if(Object.keys(colleges).length==0 || !startDate){
        alert("Add courses and start date");
        return;
    }

    let gap = Number(document.getElementById("gap").value);
    let slots = Number(document.getElementById("slots").value);


    let subjectSet = new Set();

    let allSubjects = new Set();

for(let college in colleges){
    colleges[college].forEach(c=>{
        c.subjects.forEach(s=>allSubjects.add(s));
    });
}

allSubjects = Array.from(allSubjects);

    let allSubjects = Array.from(subjectSet);

    let subjectDates = {};
    let start = new Date(startDate);

    let current = new Date(start);
let slotIndex = 0;

allSubjects.forEach(s=>{

    current = getNextWorkingDate(current);

    let slotName = (slotIndex % slots === 0) ? "Morning" : "Evening";

    subjectDates[s] = {
        date: current.toDateString(),
        slot: slotName
    };

    slotIndex++;

    // If both slots used, move to next day
    if(slotIndex % slots === 0){
        current.setDate(current.getDate() + gap);
    }
});


    let output = "<table><tr><th>College</th><th>Course</th><th>Semester</th><th>Subject</th><th>Date</th><th>Slot</th></tr>";

for(let college in colleges){

    colleges[college].forEach(c=>{

        c.subjects.forEach(s=>{

            output += `<tr>
            <td>${college}</td>
            <td>${c.course}</td>
            <td>${c.semester}</td>
            <td>${s}</td>
            <td>${subjectDates[s].date}</td>
            <td>${subjectDates[s].slot}</td>
            </tr>`;

        });

    });
}

output += "</table>";

    result.innerHTML = output;
}
function addHoliday(){

    let h = document.getElementById("holidayDate").value;

    if(h){
        holidays.push(new Date(h).toDateString());
        showHolidays();
    }
}

function showHolidays(){
    holidayList.innerHTML = "<b>Holidays:</b> " + holidays.join(", ");
}
function getNextWorkingDate(date){

    let d = new Date(date);

    while(true){

        let day = d.getDay(); // 0 Sunday, 6 Saturday

        if(skipSunday.checked && day===0){
            d.setDate(d.getDate()+1);
            continue;
        }

        if(skipSaturday.checked && day===6){
            d.setDate(d.getDate()+1);
            continue;
        }

        if(holidays.includes(d.toDateString())){
            d.setDate(d.getDate()+1);
            continue;
        }

        break;
    }

    return d;
}
async function exportPDF(){

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("College Examination DateSheet", 14, 10);

    doc.autoTable({
        html: "#result table",
        startY: 20
    });

    doc.save("DateSheet.pdf");
}
function exportExcel(){

    let table = document.querySelector("#result table");

    if(!table){
        alert("Generate table first");
        return;
    }

    let html = table.outerHTML.replace(/ /g, '%20');

    let link = document.createElement("a");

    link.href = 'data:application/vnd.ms-excel,' + html;
    link.download = 'DateSheet.xls';

    link.click();
}

const model = {
    attendanceNames:[
        "Adam the Anaconda",
        "Gregory the Goat",
        "Paulrus the Walrus",
        "Lilly the Lizard",
        "Slappy the Frog"
    ]
};

const octopus = {
    init: function() {
        this.table = document.querySelector('.main-table');

        this.createTable(12);
    },

    createTable: function (num) {
    //    Create Headlines
        const headlines = document.createElement('thead');
        const headlineRow = document.createElement('tr');
        this.createTableElement('th', 'Student Name', headlineRow, 'name-col');
        for( let i = 1; i <= num; i++) {
            this.createTableElement('th', i, headlineRow);
        }
        this.createTableElement('th', 'Days Missed-col', headlineRow, 'missed-col');

        headlines.appendChild(headlineRow);
    //    Loop names
        const tableBody = document.createElement('tbody');
        for (const name of model.attendanceNames) {
            const attendaceRow = document.createElement('tr');
            this.createTableElement('td', name, attendaceRow, 'name-col');
            for( let i = 1; i <= num; i++) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                this.createTableElement('td', checkbox, attendaceRow, 'attend-col');
            }
            this.createTableElement('td', 0, attendaceRow, 'missed-col');
            tableBody.appendChild(attendaceRow);
        }


        this.table.appendChild(headlines);
        this.table.appendChild(tableBody);
    },

    createTableElement: function (type, innerText, appendTo, setClass = null) {
        const element = document.createElement(type);
        if(setClass) element.classList.add(setClass);
        (typeof(innerText) === 'object') ? element.appendChild(innerText) : element.innerHTML = innerText;
        appendTo.appendChild(element);
    }
};

(function() {
    octopus.init();
})();

/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());


/* STUDENT APPLICATION */
$(function() {
    var attendance = JSON.parse(localStorage.attendance),
        $allMissed = $('tbody .missed-col'),
        $allCheckboxes = $('tbody input');

    // Count a student's missed days
    function countMissing() {
        $allMissed.each(function() {
            var studentRow = $(this).parent('tr'),
                dayChecks = $(studentRow).children('td').children('input'),
                numMissed = 0;

            dayChecks.each(function() {
                if (!$(this).prop('checked')) {
                    numMissed++;
                }
            });

            $(this).text(numMissed);
        });
    }

    // Check boxes, based on attendace records
    $.each(attendance, function(name, days) {
        var studentRow = $('tbody .name-col:contains("' + name + '")').parent('tr'),
            dayChecks = $(studentRow).children('.attend-col').children('input');

        dayChecks.each(function(i) {
            $(this).prop('checked', days[i]);
        });
    });

    // When a checkbox is clicked, update localStorage
    $allCheckboxes.on('click', function() {
        var studentRows = $('tbody .student'),
            newAttendance = {};

        studentRows.each(function() {
            var name = $(this).children('.name-col').text(),
                $allCheckboxes = $(this).children('td').children('input');

            newAttendance[name] = [];

            $allCheckboxes.each(function() {
                newAttendance[name].push($(this).prop('checked'));
            });
        });

        countMissing();
        localStorage.attendance = JSON.stringify(newAttendance);
    });

    countMissing();
}());

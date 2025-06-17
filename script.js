const targetMuDaily = 340;
const targetSkuDaily = 120;

let myFlatpickrInstance;

document.addEventListener('DOMContentLoaded', () => {
    displayCurrentDateTime();

    myFlatpickrInstance = flatpickr("#specialOffDays", {
        mode: "multiple",
        dateFormat: "d/m/Y",
        locale: "th",
        onChange: function(selectedDates, dateStr, instance) {
            calculate();
        }
    });

    calculate();

    document.getElementById('skuDone').addEventListener('input', calculate);
    document.getElementById('muDone').addEventListener('input', calculate);
});

function displayCurrentDateTime() {
    const today = new Date();
    const currentYearInBuddhist = today.getFullYear() + 543;
    const dateString = today.toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' }) +
                       ` ${currentYearInBuddhist}` +
                       today.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('currentDateDisplay').textContent = dateString;
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getDayOfWeek(year, month, day) {
    return new Date(year, month, day).getDay();
}

function calculate() {
    try {
        const muDone = parseInt(document.getElementById('muDone').value || '0');
        const skuDone = parseInt(document.getElementById('skuDone').value || '0');

        const specialOffDates = myFlatpickrInstance ? myFlatpickrInstance.selectedDates : [];

        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        const specialOffDays = new Set(
            specialOffDates
                .filter(date => date.getMonth() === currentMonth && date.getFullYear() === currentYear)
                .map(date => date.getDate())
        );

        const currentDay = today.getDate();

        const totalDaysInCurrentMonth = getDaysInMonth(currentYear, currentMonth);

        let actualWorkDaysInMonthCount = 0;
        for (let i = 1; i <= totalDaysInCurrentMonth; i++) {
            const dayOfWeek = getDayOfWeek(currentYear, currentMonth, i);
            if (dayOfWeek !== 3 && !specialOffDays.has(i)) {
                actualWorkDaysInMonthCount++;
            }
        }
        document.getElementById('totalWorkDaysInMonth').textContent = actualWorkDaysInMonthCount;

        let remainingWorkDaysCount = 0;
        for (let i = currentDay; i <= totalDaysInCurrentMonth; i++) {
            const dayOfWeek = getDayOfWeek(currentYear, currentMonth, i);
            if (dayOfWeek !== 3 && !specialOffDays.has(i)) {
                remainingWorkDaysCount++;
            }
        }
        document.getElementById('remainingWorkDays').textContent = remainingWorkDaysCount;

        const targetMuMonthly = actualWorkDaysInMonthCount * targetMuDaily;
        const targetSkuMonthly = actualWorkDaysInMonthCount * targetSkuDaily;
        document.getElementById('targetMuMonthly').textContent = Math.max(0, targetMuMonthly);
        document.getElementById('targetSkuMonthly').textContent = Math.max(0, targetSkuMonthly);

        const muNeeded = Math.max(0, targetMuMonthly - muDone);
        const skuNeeded = Math.max(0, targetSkuMonthly - skuDone);
        document.getElementById('muNeeded').textContent = muNeeded;
        document.getElementById('skuNeeded').textContent = skuNeeded;

        let avgMuRemainingDaily = 0;
        let avgSkuRemainingDaily = 0;

        if (remainingWorkDaysCount > 0) {
            avgMuRemainingDaily = muNeeded / remainingWorkDaysCount;
            avgSkuRemainingDaily = skuNeeded / remainingWorkDaysCount;
        }

        document.getElementById('avgMuRemainingDaily').textContent = avgMuRemainingDaily.toFixed(2);
        document.getElementById('avgSkuRemainingDaily').textContent = avgSkuRemainingDaily.toFixed(2);

    } catch (error) {
        console.error("An error occurred during calculation:", error);
    }
}

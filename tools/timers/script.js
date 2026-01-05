document.addEventListener('DOMContentLoaded', () => {
    const timersContainer = document.getElementById('timers');
    const addTimerButton = document.getElementById('addTimer');
    const startAllButton = document.getElementById('startAll');
    const schoolModeButton = document.getElementById('schoolMode');

    addTimerButton.addEventListener('click', addTimer);
    startAllButton.addEventListener('click', startAllTimers);
    schoolModeButton.addEventListener('click', schoolMode);

    function addTimer() {
        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        // Store state on the timer div element
        timerDiv.isPaused = false;
        timerDiv.timeLeft = 0;
        timerDiv.initialHours = 0;
        timerDiv.initialMinutes = 0;
        timerDiv.initialSeconds = 0;

        const hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.placeholder = 'HH';
        hoursInput.min = 0;
        hoursInput.max = 23;
        hoursInput.value = '00';

        const minutesInput = document.createElement('input');
        minutesInput.type = 'number';
        minutesInput.placeholder = 'MM';
        minutesInput.min = 0;
        minutesInput.max = 59;
        minutesInput.value = '00';

        const secondsInput = document.createElement('input');
        secondsInput.type = 'number';
        secondsInput.placeholder = 'SS';
        secondsInput.min = 0;
        secondsInput.max = 59;
        secondsInput.value = '00';

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pause';
        pauseButton.disabled = true;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';

        const timerDisplay = document.createElement('div');
        timerDisplay.classList.add('timer-display');

        const timerButtons = document.createElement('div');
        timerButtons.classList.add('timer-buttons');
        timerButtons.appendChild(startButton);
        timerButtons.appendChild(pauseButton);
        timerButtons.appendChild(resetButton);
        timerButtons.appendChild(removeButton);

        timerDiv.appendChild(timerDisplay);
        timerDiv.appendChild(hoursInput);
        timerDiv.appendChild(minutesInput);
        timerDiv.appendChild(secondsInput);
        timerDiv.appendChild(timerButtons);

        timersContainer.appendChild(timerDiv);

        startButton.addEventListener('click', () => {
            if (timerDiv.isPaused) {
                // Resume the timer
                resumeTimer(timerDiv, startButton, pauseButton);
            } else {
                // Start a new timer
                startTimer(hoursInput, minutesInput, secondsInput, timerDiv, startButton, pauseButton);
            }
        });

        pauseButton.addEventListener('click', () => {
            pauseTimer(timerDiv, startButton, pauseButton);
        });

        resetButton.addEventListener('click', () => {
            resetTimer(timerDiv, hoursInput, minutesInput, secondsInput, startButton, pauseButton);
        });

        removeButton.addEventListener('click', () => {
            if (timerDiv.interval) {
                clearInterval(timerDiv.interval);
            }
            timerDiv.remove();
        });
    }

    function createTimer(hours, minutes, seconds) {
        const timerDiv = document.createElement('div');
        timerDiv.classList.add('timer');
        // Store state on the timer div element
        timerDiv.isPaused = false;
        timerDiv.timeLeft = 0;
        timerDiv.initialHours = hours;
        timerDiv.initialMinutes = minutes;
        timerDiv.initialSeconds = seconds;

        const timerDisplay = document.createElement('div');
        timerDisplay.classList.add('timer-display');

        const hoursInput = document.createElement('input');
        hoursInput.type = 'number';
        hoursInput.placeholder = 'HH';
        hoursInput.min = 0;
        hoursInput.max = 23;
        hoursInput.value = hours;

        const minutesInput = document.createElement('input');
        minutesInput.type = 'number';
        minutesInput.placeholder = 'MM';
        minutesInput.min = 0;
        minutesInput.max = 59;
        minutesInput.value = minutes;

        const secondsInput = document.createElement('input');
        secondsInput.type = 'number';
        secondsInput.placeholder = 'SS';
        secondsInput.min = 0;
        secondsInput.max = 59;
        secondsInput.value = seconds;

        const startButton = document.createElement('button');
        startButton.textContent = 'Start';

        const pauseButton = document.createElement('button');
        pauseButton.textContent = 'Pause';
        pauseButton.disabled = true;

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset';

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';

        const timerButtons = document.createElement('div');
        timerButtons.classList.add('timer-buttons');
        timerButtons.appendChild(startButton);
        timerButtons.appendChild(pauseButton);
        timerButtons.appendChild(resetButton);
        timerButtons.appendChild(removeButton);

        timerDiv.appendChild(timerDisplay);
        timerDiv.appendChild(hoursInput);
        timerDiv.appendChild(minutesInput);
        timerDiv.appendChild(secondsInput);
        timerDiv.appendChild(timerButtons);

        timersContainer.appendChild(timerDiv);

        startButton.addEventListener('click', () => {
            if (timerDiv.isPaused) {
                // Resume the timer
                resumeTimer(timerDiv, startButton, pauseButton);
            } else {
                // Start a new timer
                startTimer(hoursInput, minutesInput, secondsInput, timerDiv, startButton, pauseButton);
            }
        });

        pauseButton.addEventListener('click', () => {
            pauseTimer(timerDiv, startButton, pauseButton);
        });

        resetButton.addEventListener('click', () => {
            resetTimer(timerDiv, hoursInput, minutesInput, secondsInput, startButton, pauseButton);
        });

        removeButton.addEventListener('click', () => {
            if (timerDiv.interval) {
                clearInterval(timerDiv.interval);
            }
            timerDiv.remove();
        });
    }

    function schoolMode() {
        // Remove all existing timers
        const timerDivs = document.querySelectorAll('.timer');
        timerDivs.forEach(timerDiv => {
            if (timerDiv.interval) {
                clearInterval(timerDiv.interval);
            }
            timerDiv.remove();
        });

        // Create 5 new timers with specific times
        createTimer(0, 5, 0);   // 5 minutes
        createTimer(0, 15, 0);  // 10 minutes
        createTimer(0, 25, 0);  // 10 minutes
        createTimer(0, 40, 0);  // 15 minutes
        createTimer(0, 45, 0);   // 5 minutes
    }

    function startAllTimers() {
        const timerDivs = document.querySelectorAll('.timer');
        timerDivs.forEach(timerDiv => {
            const startButton = timerDiv.querySelector('.timer-buttons button:nth-child(1)');
            const pauseButton = timerDiv.querySelector('.timer-buttons button:nth-child(2)');
            const timerDisplay = timerDiv.querySelector('.timer-display');

            if (timerDisplay && timerDisplay.textContent === "Time's up!") {
                const resetButton = timerDiv.querySelector('.timer-buttons button:nth-child(3)');
                if (resetButton) {
                    resetButton.click();
                    startButton.click();
                }
            } else if (startButton && !startButton.disabled) {
                startButton.click();
            }
        });
    }

    function startTimer(hoursInput, minutesInput, secondsInput, timerDiv, startButton, pauseButton) {
        let initialHours = parseInt(hoursInput.value || '0') || 0;
        let initialMinutes = parseInt(minutesInput.value || '0') || 0;
        let initialSeconds = parseInt(secondsInput.value || '0') || 0;

        const totalSeconds = initialHours * 3600 + initialMinutes * 60 + initialSeconds;

        if (totalSeconds <= 0) {
            alert('Please enter a valid time.');
            return;
        }

        // Store initial values and timeLeft on the timerDiv for use when resuming
        timerDiv.initialHours = initialHours;
        timerDiv.initialMinutes = initialMinutes;
        timerDiv.initialSeconds = initialSeconds;
        timerDiv.timeLeft = totalSeconds;
        timerDiv.isPaused = false;

        let timerDisplay = timerDiv.querySelector('.timer-display');
        
        hoursInput.classList.add('hidden');
        minutesInput.classList.add('hidden');
        secondsInput.classList.add('hidden');
        startButton.disabled = true;
        pauseButton.disabled = false;

        // Clear any existing interval
        if (timerDiv.interval) {
            clearInterval(timerDiv.interval);
        }

        // Update display immediately
        updateDisplay(timerDiv.initialHours, timerDiv.initialMinutes, timerDiv.initialSeconds, timerDiv.timeLeft, timerDisplay);

        // Store the interval on the timerDiv element for access from other functions
        timerDiv.interval = setInterval(() => {
            timerDiv.timeLeft--;
            if (timerDiv.timeLeft < 0) {
                clearInterval(timerDiv.interval);
                timerDisplay.textContent = "Time's up!";
                pauseButton.disabled = true;
                startButton.disabled = false;
                timerDiv.isPaused = false;
            } else {
                updateDisplay(timerDiv.initialHours, timerDiv.initialMinutes, timerDiv.initialSeconds, timerDiv.timeLeft, timerDisplay);
            }
        }, 1000);
    }

    function pauseTimer(timerDiv, startButton, pauseButton) {
        clearInterval(timerDiv.interval);
        timerDiv.isPaused = true;
        pauseButton.disabled = true;
        startButton.disabled = false;
        // Start button text changes to indicate resume functionality
        startButton.textContent = 'Resume';
    }

    function resumeTimer(timerDiv, startButton, pauseButton) {
        // Change button text back to normal
        startButton.textContent = 'Start';
        
        let timerDisplay = timerDiv.querySelector('.timer-display');
        startButton.disabled = true;
        pauseButton.disabled = false;
        timerDiv.isPaused = false;

        // Update display immediately
        updateDisplay(timerDiv.initialHours, timerDiv.initialMinutes, timerDiv.initialSeconds, timerDiv.timeLeft, timerDisplay);

        // Resume from the current timeLeft
        timerDiv.interval = setInterval(() => {
            timerDiv.timeLeft--;
            if (timerDiv.timeLeft < 0) {
                clearInterval(timerDiv.interval);
                timerDisplay.textContent = "Time's up!";
                pauseButton.disabled = true;
                startButton.disabled = false;
                timerDiv.isPaused = false;
            } else {
                updateDisplay(timerDiv.initialHours, timerDiv.initialMinutes, timerDiv.initialSeconds, timerDiv.timeLeft, timerDisplay);
            }
        }, 1000);
    }

    function resetTimer(timerDiv, hoursInput, minutesInput, secondsInput, startButton, pauseButton) {
        clearInterval(timerDiv.interval);
        
        hoursInput.classList.remove('hidden');
        minutesInput.classList.remove('hidden');
        secondsInput.classList.remove('hidden');
        
        // Reset to initial values if they exist, otherwise to default values
        hoursInput.value = timerDiv.initialHours || '00';
        minutesInput.value = timerDiv.initialMinutes || '00';
        secondsInput.value = timerDiv.initialSeconds || '00';
        
        let timerDisplay = timerDiv.querySelector('.timer-display');
        timerDisplay.textContent = '';
        
        startButton.textContent = 'Start';
        startButton.disabled = false;
        pauseButton.disabled = true;
        timerDiv.isPaused = false;
    }

    function updateDisplay(initialHours, initialMinutes, initialSeconds, timeLeft, timerDisplay) {
        let hours = Math.floor(timeLeft / 3600);
        let minutes = Math.floor((timeLeft % 3600) / 60);
        let seconds = timeLeft % 60;

        timerDisplay.textContent = `Original: ${initialHours.toString().padStart(2, '0')}:${initialMinutes.toString().padStart(2, '0')}:${initialSeconds.toString().padStart(2, '0')} | Remaining: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    addTimer(); // Add one timer on page load
});
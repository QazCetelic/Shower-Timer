const background_elem = document.querySelector("#background");
const timer_element_elem = document.querySelector("#timer");
const timer_minutes_elem = document.querySelector("#timer-minutes");
const timer_seconds_elem = document.querySelector("#timer-seconds");
const water_usage_amount_elem = document.querySelector("#water-usage-amount");
const energy_usage_amount_elem = document.querySelector("#energy-usage-amount");
const water_usage_per_second_elem = document.querySelector("#water-usage-amount-per-second");
const energy_usage_per_second_elem = document.querySelector("#energy-usage-amount-per-second");
const reset_button_elem = document.querySelector("#reset");

const hard_limit = 60 * 10 - 1;
const liter_per_second = 0.1;
const kwh_per_second = 0.0576;

water_usage_per_second_elem.innerText = liter_per_second;
energy_usage_per_second_elem.innerText = kwh_per_second;

let paused = false;
let seconds_passed = 0;

const stages = [
    {
        name: "Start",
        duration: 60 * 2,
        hue: 120,
    },
    {
        name: "Middle",
        duration: 60 * 3,
        hue: 60,
    },
    {
        name: "End",
        duration: 60 * 4,
        hue: 0,
    },
    {
        name: "Overtime",
        duration: Number.MAX_VALUE,
        hue: 0,
    }
];

function update() {
    if (seconds_passed >= hard_limit) {
        paused = true;
    }
    const minutes = Math.floor(seconds_passed / 60);
    const seconds = seconds_passed % 60;
    timer_minutes_elem.innerText = minutes;
    timer_seconds_elem.innerText = String(seconds).padStart(2, "0");
    water_usage_amount_elem.innerText = (seconds_passed * liter_per_second).toFixed(1);
    energy_usage_amount_elem.innerText = (seconds_passed * kwh_per_second).toFixed(1);
    const stage = stages.find((stage) => seconds_passed < stage.duration);
    background_elem.style.backgroundColor = `hsl(${stage.hue}, 80%, 50%)`;
}

function each_second() {
    if (!paused) {
        seconds_passed += 1;
        const total_seconds = parseInt(localStorage.getItem("total_seconds") || 0);
        localStorage.setItem("total_seconds", (total_seconds + 1).toString());
        update();
    }
}

reset_button_elem.addEventListener("click", (event) => {
    seconds_passed = 0;
    paused = false;
    reset_button_elem.classList.add("clicked");
    setTimeout(() => reset_button_elem.classList.remove("clicked"), 100);
    update();
});

const pause_elements = [background_elem, timer_element_elem, timer_minutes_elem, timer_seconds_elem];
background_elem.addEventListener("click", (event) => {
    const tapped_pause_elements = pause_elements.some((elem) => elem === event.target);
    if (tapped_pause_elements) {
        paused = !paused;
        background_elem.classList.add("clicked");
        setTimeout(() => background_elem.classList.remove("clicked"), 100);
        if (paused) {
            background_elem.classList.add("paused");
        }
        else {
            background_elem.classList.remove("paused");
        }
    }
});

setInterval(() => each_second(), 1000);
update();

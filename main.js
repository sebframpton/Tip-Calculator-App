/* Grab the form and the inputs */
const form = document.forms[0];
const billInput = form.elements["bill"];
const tipPercentageInputs = Array.from(form.elements["tip-percentage"]);
const customTipPercentageInput = form.elements["custom-tip-percentage"];
const numberOfPeopleInput = form.elements["number-of-people"];


/* Grab the output elements */
const tipOutput = document.querySelector("#tip-output");
const totalOutput = document.querySelector("#total-output");

/* Get the button */
const button = document.querySelector("button");

/* Variable to track which radio button is checked */
let radioCheckedIndex = null;

/* Variable to track if the calculation was done */
let calculationDone = false;


function disallowLetters(event, allowDecimalDot = false) {
    const input = event.target;
    const keyPressed = event.key;
    if (allowDecimalDot && keyPressed === "." && !input.value.includes(".") && input.value !== "") {
        return;
    }
    if (isNaN(keyPressed)) {
        event.preventDefault();
    }
}

function validateTextInputs({ target: input }) {
    const { valid, valueMissing, patternMismatch } = input.validity;
    const value = input.value;
    const inputParent = input.parentElement;

    if (!valid) {
        const errorSpan = inputParent.querySelector(".error");
        let errMsg = "";
        inputParent.classList.add("invalid");

        if (valueMissing) {
            errMsg = "Required!";
        } else if (patternMismatch) {
            if (isNaN(value)) {
                errMsg = "Enter a valid number";
            } else if (value.includes(".")) {
                if (input === billInput) {
                    errMsg = "Only up to two decimals";
                } else {
                    errMsg = "No decimals allowed";
                }
            }
            else {
                errMsg = "No Starting zeroes";
            }
        }
        errorSpan.textContent = errMsg;
        resetCalculation();
    } else {
        inputParent.classList.remove("invalid");
        calculateAmounts();
    }
}

function uncheckRadios() {
    tipPercentageInputs.forEach(element => {
        element.checked = false;
    });
    radioCheckedIndex = null;
    resetCalculation();
}

function handleRadioCheck({target}) {
    customTipPercentageInput.value = "";
    radioCheckedIndex = tipPercentageInputs.findIndex(radio => radio === target);
    calculateAmounts();
}

function calculateTipAmount(bill, tipPercentage, numberOfPeople) {
    const tipAmountPerPerson = ((bill * tipPercentage) / 100) / numberOfPeople;
    return tipAmountPerPerson.toFixed(2);
}

function calculateTotal(bill, tipAmountPerPerson, numberOfPeople) {
    const totalWithoutTipPerPerson = bill / numberOfPeople;
    const totalPerPerson = totalWithoutTipPerPerson + Number(tipAmountPerPerson);
    return totalPerPerson.toFixed(2);
}

function calculateAmounts() {
    /* Check if all inputs  are valid to start the calculation */
    const formValid = form.checkValidity();
    const tipPercentageSelected = radioCheckedIndex !== null || customTipPercentageInput.value !== 0

    if (formValid && tipPercentageSelected) {
        const bill = +billInput.value;
        const tipPercentage = radioCheckedIndex !== null ? +tipPercentageInputs[radioCheckedIndex].value : +customTipPercentageInput.value;
        const numberOfPeople = +numberOfPeopleInput.value;
        const tipAmountPerPerson = calculateTipAmount(bill, tipPercentage, numberOfPeople);
        const totalPerPerson = calculateTotal(bill, tipAmountPerPerson, numberOfPeople);
        tipOutput.textContent = `$${tipAmountPerPerson}`;
        totalOutput.textContent = `$${totalPerPerson}`;
        button.disabled = false;
        calculationDone = true;
    } 
}

function resetCalculation() {
    if (calculationDone) {
        tipOutput.textContent = totalOutput.textContent = `$0.00`;
        button.disabled = true;
        calculationDone = false;
    }
}

/* Disallow Inputting Letters in the text inputs */
billInput.addEventListener("keydown", (event) => disallowLetters(event, true));
numberOfPeopleInput.addEventListener("keydown", disallowLetters);
customTipPercentageInput.addEventListener("keydown", disallowLetters);

/* Validate the text inputs */
billInput.addEventListener("change", validateTextInputs);
numberOfPeopleInput.addEventListener("change", validateTextInputs);
customTipPercentageInput.addEventListener("change", validateTextInputs);

/* Handle the relationship between the custom input and the radio buttons */
customTipPercentageInput.addEventListener("focus", uncheckRadios);
tipPercentageInputs.forEach(element => element.addEventListener("change", handleRadioCheck));

/* Listen for the reset event */
form.addEventListener("reset", resetCalculation);


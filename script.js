// =====================================
// 1. SELECT HTML ELEMENTS
// =====================================

const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);


// =====================================
// 2. MOBILE NAVIGATION AND DROPDOWNS
// =====================================

const menuButton = $("menu");
const navLinks = $("nav");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
}


// Handle all dropdown buttons
const dropdownButtons = $$(".dropdown-btn");

dropdownButtons.forEach(function (button) {

    button.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        const menuId = button.getAttribute("aria-controls");
        const currentMenu = $(menuId);

        if (!currentMenu) return;

        const shouldOpen = !currentMenu.classList.contains("open");

        // Close all dropdown menus first
        $$(".dropdown-menu").forEach(function (menu) {
            menu.classList.remove("open");
        });

        dropdownButtons.forEach(function (otherButton) {
            otherButton.setAttribute("aria-expanded", "false");
        });

        // Open the selected dropdown
        if (shouldOpen) {
            currentMenu.classList.add("open");
            button.setAttribute("aria-expanded", "true");
        }

    });

});


// Close dropdown when clicking outside
document.addEventListener("click", function (event) {

    if (!event.target.closest(".dropdown")) {

        $$(".dropdown-menu").forEach(function (menu) {
            menu.classList.remove("open");
        });

        dropdownButtons.forEach(function (button) {
            button.setAttribute("aria-expanded", "false");
        });

    }

});


// Close mobile navigation when a link is selected
if (navLinks && menuButton) {

    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("open");

            menuButton.setAttribute("aria-expanded", "false");

            const parentDropdown = link.closest(".dropdown");

            if (parentDropdown) {

                const menu = parentDropdown.querySelector(".dropdown-menu");
                const button = parentDropdown.querySelector(".dropdown-btn");

                if (menu) menu.classList.remove("open");

                if (button) button.setAttribute("aria-expanded", "false");

            }

        });

    });

}


// =====================================
// 3. BUDGETBEE CHATBOT
// =====================================

const chatToggle = $("chatToggle");
const chatWindow = $("chatWindow");
const chatClose = $("chatClose");
const chatForm = $("chatForm");
const questionInput = $("question");
const chatMessages = $("chat");


// Open and close chatbot
if (chatToggle && chatWindow) {

    chatToggle.addEventListener("click", function () {

        const isHidden = chatWindow.classList.contains("hidden");

        chatWindow.classList.toggle("hidden");

        chatToggle.setAttribute(
            "aria-expanded",
            String(isHidden)
        );

        if (isHidden && questionInput) {
            questionInput.focus();
        }

    });

}


// Close chatbot
if (chatClose && chatWindow && chatToggle) {

    chatClose.addEventListener("click", function () {

        chatWindow.classList.add("hidden");

        chatToggle.setAttribute("aria-expanded", "false");

    });

}


// Display chatbot messages
function addChatMessage(message, sender) {

    if (!chatMessages) return;

    const messageElement = document.createElement("div");

    messageElement.classList.add(sender);

    messageElement.textContent = message;

    chatMessages.appendChild(messageElement);

    chatMessages.scrollTop = chatMessages.scrollHeight;

}


// Generate chatbot answers
function getBudgetAnswer(question) {

    const text = question.toLowerCase();

    if (text.includes("need")) {

        return "A need is something essential, such as food, housing, or necessary transport.";

    }

    if (text.includes("save")) {

        return "Choose a savings goal, set aside an affordable amount regularly, and track your progress.";

    }

    if (text.includes("overspend") || text.includes("spending")) {

        return "Create a budget, track your expenses, prioritize needs, and pause before impulse purchases.";

    }

    if (text.includes("50-30-20") || text.includes("50 30 20")) {

        return "The 50-30-20 guideline allocates 50% to needs, 30% to wants, and 20% to savings or debt repayment.";

    }

    if (text.includes("want")) {

        return "A want is something optional, such as a non-essential purchase or entertainment subscription.";

    }

    if (text.includes("budget")) {

        return "A budget is a plan for how you will use your income to pay expenses, save, and reach your goals.";

    }

    return "I can help with budgeting, saving, needs versus wants, and spending habits. What would you like to learn?";

}


// Send chatbot questions
if (chatForm && questionInput) {

    chatForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const question = questionInput.value.trim();

        if (!question) return;

        addChatMessage(question, "user");

        addChatMessage(getBudgetAnswer(question), "bot");

        questionInput.value = "";

        questionInput.focus();

    });

}


// Suggested chatbot questions
$$(".prompt").forEach(function (button) {

    button.addEventListener("click", function () {

        if (!questionInput || !chatForm) return;

        questionInput.value = button.textContent.trim();

        chatForm.requestSubmit();

    });

});


// =====================================
// 4. DARK MODE
// =====================================

const darkButton = $("dark");

if (darkButton) {

    darkButton.addEventListener("click", function () {

        document.body.classList.toggle("dark");

    });

}


// =====================================
// 5. NEEDS VS WANTS ACTIVITY
// =====================================

const item = $("item");
const classMsg = $("classMsg");
const nextButton = $("next");
const classifyButtons = $$(".classify");


// Practice examples
const examples = [

    {
        item: "Food for regular meals",
        answer: "need",
        explanation: "Food for regular meals is a need because it is essential for survival."
    },

    {
        item: "Buying a luxury wristwatch",
        answer: "want",
        explanation: "A luxury wristwatch is a want because it is not essential."
    },

    {
        item: "Paying your house rent",
        answer: "need",
        explanation: "House rent is a need because you need a place to live."
    },

    {
        item: "Buying expensive designer shoes",
        answer: "want",
        explanation: "Expensive designer shoes are generally a want when affordable alternatives meet your needs."
    },

    {
        item: "Transport to work or school",
        answer: "need",
        explanation: "Transport needed to get to work or school is generally a need."
    }

];


let currentExample = 0;
let answered = false;
let score = 0;
const scoreDisplay = $("score");

// Display current example
function showExample() {

    item.textContent = examples[currentExample].item;

    classMsg.textContent = "";

    answered = false;

    classifyButtons.forEach(function (button) {

        button.disabled = false;

    });

    nextButton.textContent =
        currentExample === examples.length - 1
            ? "Start again ↻"
            : "Next example →";

}
// =====================================
// QUIZ ANSWER BUTTONS
// =====================================

classifyButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (answered) return;

        const selectedAnswer = this.dataset.type;
        const correctAnswer = examples[currentExample];

        if (selectedAnswer === correctAnswer.answer) {

            score++;

            classMsg.textContent =
                "Correct! " + correctAnswer.explanation;

        } else {

            classMsg.textContent =
                "Not quite. " + correctAnswer.explanation;

        }

        answered = true;

        scoreDisplay.textContent =
            "Your Score: " + score + " / " + examples.length;

        classifyButtons.forEach(function (btn) {
            btn.disabled = true;
        });

    });

});


// =====================================
// NEXT EXAMPLE BUTTON
// =====================================

nextButton.addEventListener("click", function () {

    if (!answered) {

        classMsg.textContent =
            "Please select Need or Want before moving to the next example.";

        return;
    }

    if (currentExample === examples.length - 1) {

        currentExample = 0;
        score = 0;

        scoreDisplay.textContent = "Your Score: 0 / 5";

    } else {

        currentExample++;

    }

    showExample();

});


// DISPLAY FIRST QUESTION

showExample();


// Check user's answer
classifyButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        if (answered) return;

        const selectedType = button.dataset.type;

        const example = examples[currentExample];
        if (selectedType === example.answer) {
    score++;
    scoreDisplay.textContent = "Your Score: " + score + " / " + examples.length;

    classMsg.textContent = "Correct! " + example.explanation;
}

        else {

            classMsg.textContent =
                "Not quite. This is a " +
                example.answer +
                ". " +
                example.explanation;

        }

        answered = true;

        classifyButtons.forEach(function (btn) {

            btn.disabled = true;

        });

    });

});


// Move to next example



// =====================================
// 6. 50-30-20 BUDGET CALCULATOR
// =====================================

const incomeInput = $("monthlyIncome");
const calculateButton = $("calculateBudget");

const budgetResults = $("budgetResults");
const budgetError = $("budgetError");

const needsAmount = $("needsAmount");
const wantsAmount = $("wantsAmount");
const savingsAmount = $("savingsAmount");
const totalIncome = $("totalIncome");


// Format amounts as Nigerian Naira
function formatNaira(amount) {

    return new Intl.NumberFormat("en-NG", {

        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2

    }).format(amount);

}


// Calculate budget
if (
    incomeInput &&
    calculateButton &&
    budgetResults &&
    budgetError
) {

    calculateButton.addEventListener("click", function () {

        const income = Number(incomeInput.value);

        // Validate income
        if (
            incomeInput.value.trim() === "" ||
            !Number.isFinite(income) ||
            income <= 0
        ) {

            budgetError.textContent =
                "Please enter a valid monthly income greater than zero.";

            budgetResults.hidden = true;

            return;

        }


        // Calculate 50-30-20 breakdown
        const needs = income * 0.50;

        const wants = income * 0.30;

        const savings = income * 0.20;


        // Display results
        needsAmount.textContent = formatNaira(needs);

        wantsAmount.textContent = formatNaira(wants);

        savingsAmount.textContent = formatNaira(savings);

        totalIncome.textContent = formatNaira(income);


        budgetError.textContent = "";

        budgetResults.hidden = false;

    });


    // Allow Enter key to calculate
    incomeInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            calculateButton.click();

        }

    });

}


// =====================================
// 7. EXPENSE PLANNER
// =====================================

const expenseForm = $("expenseForm");

const expenseAmount = $("expenseAmount");

const expenseResult = $("expenseResult");

const expenseTotal = $("expenseTotal");

const expenseError = $("expenseError");


if (
    expenseForm &&
    expenseAmount &&
    expenseResult &&
    expenseTotal &&
    expenseError
) {

    expenseForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const inputValue = expenseAmount.value.trim();

        const amount = Number(inputValue);


        // Validate expense
        if (
            inputValue === "" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {

            expenseError.textContent =
                "Please enter a valid expense greater than zero.";

            expenseResult.hidden = true;

            return;

        }


        // Display expense
        expenseTotal.textContent = formatNaira(amount);

        expenseError.textContent = "";

        expenseResult.hidden = false;

    });

}

// =====================================
// 8. FUTURE INCOME CALCULATOR
// =====================================

const futureAmount = $("futureAmount");
const incomeFrequency = $("incomeFrequency");
const futureYears = $("futureYears");
const calculateFuture = $("calculateFuture");
const futureError = $("futureError");
const futureResult = $("futureResult");
const futureTotal = $("futureTotal");

if (calculateFuture) {
    calculateFuture.addEventListener("click", function () {

        const amount = Number(futureAmount.value);
        const years = Number(futureYears.value);

        if (
            futureAmount.value.trim() === "" ||
            futureYears.value.trim() === "" ||
            !Number.isFinite(amount) ||
            !Number.isFinite(years) ||
            amount <= 0 ||
            years <= 0 ||
            !Number.isInteger(years)
        ) {
            futureError.textContent =
                "Please enter a valid income and number of years.";
            futureResult.hidden = true;
            return;
        }

        let paymentsPerYear;

        if (incomeFrequency.value === "weekly") {
            paymentsPerYear = 52;
        } else if (incomeFrequency.value === "monthly") {
            paymentsPerYear = 12;
        } else {
            paymentsPerYear = 1;
        }

        const total = amount * paymentsPerYear * years;

        futureTotal.textContent = formatNaira(total);

        futureError.textContent = "";
        futureResult.hidden = false;
    });
}
// =====================================
// 9. UNEXPECTED INCOME PLANNER
// =====================================


const unexpectedAmount = $("unexpectedAmount");
const calculateUnexpected = $("calculateUnexpected");
const unexpectedError = $("unexpectedError");
const unexpectedResult = $("unexpectedResult");

const unexpectedNeeds = $("unexpectedNeeds");
const unexpectedSavings = $("unexpectedSavings");
const unexpectedDebt = $("unexpectedDebt");
const unexpectedPersonal = $("unexpectedPersonal");

// Percentage inputs
const needsPercent = $("needsPercent");
const savingsPercent = $("savingsPercent");
const debtPercent = $("debtPercent");
const personalPercent = $("personalPercent");

const percentageTotal = $("percentageTotal");

if (calculateUnexpected) {

    calculateUnexpected.addEventListener("click", function () {

        const amount = Number(unexpectedAmount.value);

        const needsRate = Number(needsPercent.value);
        const savingsRate = Number(savingsPercent.value);
        const debtRate = Number(debtPercent.value);
        const personalRate = Number(personalPercent.value);

        // Check the income amount
        if (
            unexpectedAmount.value.trim() === "" ||
            !Number.isFinite(amount) ||
            amount <= 0
        ) {
            unexpectedError.textContent =
                "Please enter a valid amount greater than zero.";

            unexpectedResult.hidden = true;
            return;
        }

        // Check the percentages
        const percentages = [
            needsRate,
            savingsRate,
            debtRate,
            personalRate
        ];

        if (
            percentages.some(value =>
                !Number.isFinite(value) || value < 0 || value > 100
            )
        ) {
            unexpectedError.textContent =
                "Please enter percentages between 0 and 100.";

            unexpectedResult.hidden = true;
            return;
        }

        // Add all percentages
        const totalPercentage =
            needsRate + savingsRate + debtRate + personalRate;

        percentageTotal.textContent =
            "Total allocation: " + totalPercentage + "%";

        // Ensure the total is exactly 100%
        if (totalPercentage !== 100) {

            unexpectedError.textContent =
                "Your percentages must add up to exactly 100%.";

            unexpectedResult.hidden = true;
            return;
        }

        // Calculate each allocation
        const needs = amount * needsRate / 100;
        const savings = amount * savingsRate / 100;
        const debt = amount * debtRate / 100;
        const personal = amount * personalRate / 100;

        // Display the results
        unexpectedNeeds.textContent = formatNaira(needs);
        unexpectedSavings.textContent = formatNaira(savings);
        unexpectedDebt.textContent = formatNaira(debt);
        unexpectedPersonal.textContent = formatNaira(personal);

        unexpectedError.textContent = "";
        unexpectedResult.hidden = false;

    });

}

// =====================================
// FEEDBACK AND CONTACT DROPDOWN
// =====================================

const contactDropdownBtn = document.getElementById("contactDropdownBtn");

const contactDropdown = document.getElementById("contactDropdown");

if (contactDropdownBtn && contactDropdown) {

    contactDropdownBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        const isOpen = contactDropdown.classList.toggle("open");

        contactDropdownBtn.setAttribute(
            "aria-expanded",
            isOpen
        );

    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (event) {

        if (!event.target.closest(".dropdown")) {

            contactDropdown.classList.remove("open");

            contactDropdownBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    });

    // Close dropdown after selecting a link
    contactDropdown.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            contactDropdown.classList.remove("open");

            contactDropdownBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}

// =====================================
// 9. WEBSITE STATISTICS
// =====================================

const visitsElement = $("visits");

const dateElement = $("date");

const timeElement = $("time");


// Count local visits
if (visitsElement) {

    try {

        const visitKey = "bbVisits";

        const previousVisits = Number(
            localStorage.getItem(visitKey) || 0
        );


        if (
            Number.isSafeInteger(previousVisits) &&
            previousVisits >= 0 &&
            previousVisits < Number.MAX_SAFE_INTEGER
        ) {

            const currentVisits = previousVisits + 1;

            localStorage.setItem(visitKey, currentVisits);

            visitsElement.textContent =
                currentVisits.toLocaleString();

        } else {

            visitsElement.textContent = "Unavailable";

        }

    } catch (error) {
 
        visitsElement.textContent = "Unavailable";

    }

}


// Display current date and time
function updateWebsiteClock() {

    const now = new Date();


    if (dateElement) {

        dateElement.textContent = now.toLocaleDateString("en-NG", {

            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"

        });

    }


    if (timeElement) {

        timeElement.textContent = now.toLocaleTimeString("en-NG", {

            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true

        });

    }

}
// =====================================
// 10. CONTACT FORM SUCCESS MESSAGE
// =====================================

const contactForm = $("contactForm");
const formStatus = $("formStatus");

if (contactForm && formStatus) {

    contactForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const submitButton = contactForm.querySelector(
            'button[type="submit"]'
        );

        submitButton.disabled = true;
        submitButton.textContent = "Sending...";

        formStatus.textContent = "";

        try {

            const response = await fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Message could not be sent.");
            }

            formStatus.textContent =
                "Thank you for contacting BudgetBasics! Your message has been sent successfully.";

            contactForm.reset();

        } catch (error) {

            formStatus.textContent =
                "Sorry, your message could not be sent. Please try again.";

        } finally {

            submitButton.disabled = false;
            submitButton.textContent = "Send Message";

        }

    });

}


// Display immediately
updateWebsiteClock();


// Update time every second
setInterval(updateWebsiteClock, 1000);
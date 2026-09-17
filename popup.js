/* =========================================
   RISKIQ
   SIMPLE + BROKER-AWARE CALCULATOR
========================================= */


/* =========================================
   STATE
========================================= */

let riskMode = "percent";

let direction = "BUY";

let appMode = "quick";

let customValuePerMove = 0;


/* =========================================
   QUICK PRESETS
=========================================

   IMPORTANT:
   These are generic starter presets.
   Broker specifications can differ.

========================================= */

const presets = {

    XAUUSD: {
        valuePerMove: 100,
        lotStep: 0.01
    },

    NAS100: {
        valuePerMove: 1,
        lotStep: 0.01
    },

    US30: {
        valuePerMove: 1,
        lotStep: 0.01
    },

    SPX500: {
        valuePerMove: 1,
        lotStep: 0.01
    },

    EURUSD: {
        valuePerMove: 100000,
        lotStep: 0.01
    },

    GBPUSD: {
        valuePerMove: 100000,
        lotStep: 0.01
    },

    USDJPY: {
        valuePerMove: 100000,
        lotStep: 0.01
    },

    BTCUSD: {
        valuePerMove: 1,
        lotStep: 0.01
    },

    ETHUSD: {
        valuePerMove: 1,
        lotStep: 0.01
    }

};


/* =========================================
   ELEMENTS
========================================= */

const balance =
    document.getElementById("balance");

const riskInput =
    document.getElementById("riskInput");

const riskPrefix =
    document.getElementById("riskPrefix");

const percentMode =
    document.getElementById("percentMode");

const dollarMode =
    document.getElementById("dollarMode");

const targetRisk =
    document.getElementById("targetRisk");

const targetRiskResult =
    document.getElementById("targetRiskResult");


const quickMode =
    document.getElementById("quickMode");

const customMode =
    document.getElementById("customMode");

const quickFields =
    document.getElementById("quickFields");

const customFields =
    document.getElementById("customFields");


const instrument =
    document.getElementById("instrument");


const customSymbol =
    document.getElementById("customSymbol");

const calibrationLot =
    document.getElementById("calibrationLot");

const calibrationMove =
    document.getElementById("calibrationMove");

const calibrationPnL =
    document.getElementById("calibrationPnL");

const calibrateButton =
    document.getElementById("calibrateButton");

const calibrationResult =
    document.getElementById("calibrationResult");

const customLotStep =
    document.getElementById("customLotStep");


const entry =
    document.getElementById("entry");

const stop =
    document.getElementById("stop");

const takeProfit =
    document.getElementById("takeProfit");


const buy =
    document.getElementById("buy");

const sell =
    document.getElementById("sell");


const lotSize =
    document.getElementById("lotSize");

const riskAmount =
    document.getElementById("riskAmount");

const potentialProfit =
    document.getElementById("potentialProfit");

const rr =
    document.getElementById("rr");


const stopLossResult =
    document.getElementById("stopLossResult");

const takeProfitResult =
    document.getElementById("takeProfitResult");

const stopLossDistance =
    document.getElementById("stopLossDistance");

const takeProfitDistance =
    document.getElementById("takeProfitDistance");


const riskDifference =
    document.getElementById("riskDifference");

const tradeMessage =
    document.getElementById("tradeMessage");


/* =========================================
   APP MODE
========================================= */

quickMode.addEventListener(
    "click",
    () => {

        appMode = "quick";

        quickMode.classList.add(
            "selected"
        );

        customMode.classList.remove(
            "selected"
        );

        quickFields.style.display =
            "block";

        customFields.style.display =
            "none";

        calculate();

    }
);


customMode.addEventListener(
    "click",
    () => {

        appMode = "custom";

        customMode.classList.add(
            "selected"
        );

        quickMode.classList.remove(
            "selected"
        );

        quickFields.style.display =
            "none";

        customFields.style.display =
            "block";

        calculate();

    }
);


/* =========================================
   RISK MODE
========================================= */

percentMode.addEventListener(
    "click",
    () => {

        riskMode = "percent";

        percentMode.classList.add(
            "selected"
        );

        dollarMode.classList.remove(
            "selected"
        );

        riskPrefix.textContent =
            "%";

        riskInput.value = "1";

        calculate();

    }
);


dollarMode.addEventListener(
    "click",
    () => {

        riskMode = "dollar";

        dollarMode.classList.add(
            "selected"
        );

        percentMode.classList.remove(
            "selected"
        );

        riskPrefix.textContent =
            "$";

        riskInput.value = "100";

        calculate();

    }
);


/* =========================================
   DIRECTION
========================================= */

buy.addEventListener(
    "click",
    () => {

        direction = "BUY";

        buy.classList.add(
            "selected"
        );

        sell.classList.remove(
            "selected"
        );

        calculate();

    }
);


sell.addEventListener(
    "click",
    () => {

        direction = "SELL";

        sell.classList.add(
            "selected"
        );

        buy.classList.remove(
            "selected"
        );

        calculate();

    }
);


/* =========================================
   CALIBRATE FROM MT5
========================================= */

calibrateButton.addEventListener(
    "click",
    () => {

        const lot =
            Number(
                calibrationLot.value
            );

        const movement =
            Number(
                calibrationMove.value
            );

        const pnl =
            Number(
                calibrationPnL.value
            );


        if (
            lot <= 0 ||
            movement <= 0 ||
            pnl <= 0
        ) {

            calibrationResult.textContent =
                "Enter all three values.";

            calibrationResult.className =
                "calibration-result error";

            return;

        }


        /*
            Effective value per
            1.00 price movement
            at 1.00 lot.

            Example:

            $253.64 loss
            / 8.284 movement
            / 0.34 lot

            = ~$90.04
        */

        customValuePerMove =
            pnl /
            movement /
            lot;


        calibrationResult.textContent =
            "✓ Calibrated: $" +
            customValuePerMove.toFixed(4) +
            " per 1.00 move / 1 lot";


        calibrationResult.className =
            "calibration-result success";


        calculate();

    }
);


/* =========================================
   INPUT LISTENERS
========================================= */

[
    balance,
    riskInput,
    instrument,
    customSymbol,
    customLotStep,
    entry,
    stop,
    takeProfit

].forEach(
    element => {

        element.addEventListener(
            "input",
            calculate
        );

        element.addEventListener(
            "change",
            calculate
        );

    }
);


/* =========================================
   TARGET RISK
========================================= */

function getTargetRisk() {

    const account =
        Number(
            balance.value
        );

    const risk =
        Number(
            riskInput.value
        );


    if (
        account <= 0 ||
        risk <= 0
    ) {

        return 0;

    }


    if (riskMode === "percent") {

        return (
            account *
            risk /
            100
        );

    }


    return risk;

}


/* =========================================
   GET VALUE PER MOVE
========================================= */

function getValuePerMove() {

    if (appMode === "quick") {

        const preset =
            presets[
                instrument.value
            ];

        return preset
            ? preset.valuePerMove
            : 0;

    }


    return customValuePerMove;

}


/* =========================================
   GET LOT STEP
========================================= */

function getLotStep() {

    if (appMode === "quick") {

        const preset =
            presets[
                instrument.value
            ];

        return preset
            ? preset.lotStep
            : 0.01;

    }


    const step =
        Number(
            customLotStep.value
        );

    return step > 0
        ? step
        : 0.01;

}


/* =========================================
   ROUND LOT
========================================= */

function roundLot(
    value,
    step
) {

    return Number(
        (
            Math.round(
                value / step
            ) * step
        ).toFixed(8)
    );

}


/* =========================================
   MAIN CALCULATOR
========================================= */

function calculate() {

    const target =
        getTargetRisk();

    const valuePerMove =
        getValuePerMove();

    const lotStep =
        getLotStep();


    /* =====================================
       TARGET RISK
    ===================================== */

    targetRisk.textContent =
        "$" +
        formatMoney(target);

    targetRiskResult.textContent =
        "$" +
        formatMoney(target);


    /* =====================================
       VALIDATION
    ===================================== */

    const entryPrice =
        Number(
            entry.value
        );

    const stopPrice =
        Number(
            stop.value
        );

    const tpPrice =
        Number(
            takeProfit.value
        );


    if (
        target <= 0 ||
        valuePerMove <= 0 ||
        lotStep <= 0 ||
        entryPrice <= 0 ||
        stopPrice <= 0
    ) {

        resetResults();

        return;

    }


    /* =====================================
       DIRECTION VALIDATION
    ===================================== */

    if (direction === "BUY") {

        if (
            stopPrice >= entryPrice
        ) {

            showError(
                "BUY: Stop Loss must be below Entry."
            );

            resetResults();

            return;

        }


        if (
            tpPrice > 0 &&
            tpPrice <= entryPrice
        ) {

            showError(
                "BUY: Take Profit must be above Entry."
            );

            resetResults();

            return;

        }

    }


    if (direction === "SELL") {

        if (
            stopPrice <= entryPrice
        ) {

            showError(
                "SELL: Stop Loss must be above Entry."
            );

            resetResults();

            return;

        }


        if (
            tpPrice > 0 &&
            tpPrice >= entryPrice
        ) {

            showError(
                "SELL: Take Profit must be below Entry."
            );

            resetResults();

            return;

        }

    }


    clearError();


    /* =====================================
       DISTANCES
    ===================================== */

    const slDistanceValue =
        Math.abs(
            entryPrice -
            stopPrice
        );


    const tpDistanceValue =
        tpPrice > 0
            ? Math.abs(
                tpPrice -
                entryPrice
            )
            : 0;


    /* =====================================
       RISK PER LOT
    ===================================== */

    const riskPerLot =
        slDistanceValue *
        valuePerMove;


    if (
        riskPerLot <= 0
    ) {

        resetResults();

        return;

    }


    /* =====================================
       THEORETICAL LOT
    ===================================== */

    const theoreticalLot =
        target /
        riskPerLot;


    /* =====================================
       EXECUTABLE LOT
    ===================================== */

    const actualLot =
        roundLot(
            theoreticalLot,
            lotStep
        );


    if (
        actualLot <= 0
    ) {

        showError(
            "Required position is below the available lot step."
        );

        resetResults();

        return;

    }


    /* =====================================
       ACTUAL RISK
    ===================================== */

    const actualRisk =
        slDistanceValue *
        valuePerMove *
        actualLot;


    /* =====================================
       ACTUAL PROFIT
    ===================================== */

    const actualProfit =
        tpDistanceValue > 0

            ? tpDistanceValue *
              valuePerMove *
              actualLot

            : 0;


    /* =====================================
       R:R
    ===================================== */

    const rewardRatio =
        tpDistanceValue > 0

            ? tpDistanceValue /
              slDistanceValue

            : 0;


    /* =====================================
       DISPLAY
    ===================================== */

    lotSize.textContent =
        formatLot(actualLot);


    riskAmount.textContent =
        "$" +
        formatMoney(actualRisk);


    potentialProfit.textContent =
        "$" +
        formatMoney(actualProfit);


    rr.textContent =
        rewardRatio > 0

            ? "1:" +
              rewardRatio.toFixed(2)

            : "—";


    stopLossResult.textContent =
        "-$" +
        formatMoney(actualRisk);


    takeProfitResult.textContent =
        tpDistanceValue > 0

            ? "+$" +
              formatMoney(actualProfit)

            : "+$0.00";


    stopLossDistance.textContent =
        formatDistance(
            slDistanceValue
        ) +
        " distance";


    takeProfitDistance.textContent =
        tpDistanceValue > 0

            ? formatDistance(
                tpDistanceValue
              ) +
              " distance"

            : "No target";


    /* =====================================
       RISK DIFFERENCE
    ===================================== */

    const difference =
        actualRisk -
        target;


    if (
        Math.abs(difference) < 0.005
    ) {

        riskDifference.textContent =
            "✓ Actual risk matches target.";

        riskDifference.className =
            "risk-difference good";

    }

    else if (
        difference > 0
    ) {

        riskDifference.textContent =
            "⚠ Actual risk is $" +
            formatMoney(difference) +
            " above target.";

        riskDifference.className =
            "risk-difference warning";

    }

    else {

        riskDifference.textContent =
            "Actual risk is $" +
            formatMoney(
                Math.abs(difference)
            ) +
            " below target.";

        riskDifference.className =
            "risk-difference good";

    }

}


/* =========================================
   ERROR
========================================= */

function showError(
    message
) {

    tradeMessage.textContent =
        message;

    tradeMessage.className =
        "trade-message error";

}


function clearError() {

    tradeMessage.textContent =
        "";

    tradeMessage.className =
        "trade-message";

}


/* =========================================
   RESET
========================================= */

function resetResults() {

    lotSize.textContent =
        "0.00";

    riskAmount.textContent =
        "$0.00";

    potentialProfit.textContent =
        "$0.00";

    rr.textContent =
        "—";

    stopLossResult.textContent =
        "-$0.00";

    takeProfitResult.textContent =
        "+$0.00";

    stopLossDistance.textContent =
        "0.00 distance";

    takeProfitDistance.textContent =
        "0.00 distance";

    riskDifference.textContent =
        "Enter your trade setup.";

    riskDifference.className =
        "risk-difference";

}


/* =========================================
   FORMATTING
========================================= */

function formatMoney(
    value
) {

    return Number.isFinite(value)
        ? value.toFixed(2)
        : "0.00";

}


function formatLot(
    value
) {

    return Number.isFinite(value)
        ? value.toFixed(2)
        : "0.00";

}


function formatDistance(
    value
) {

    if (
        !Number.isFinite(value)
    ) {

        return "0.00";

    }

    return value
        .toFixed(5)
        .replace(
            /\.?0+$/,
            ""
        );

}


/* =========================================
   START
========================================= */

calculate();

$(document).ready(function () {

    $("#month").change(function () {

        var selectedMonth = $("#month").val();

        if (selectedMonth >= 1 && selectedMonth <= 3) {
            $("#quater")[0].selectedIndex = 0;
        }
        else if (selectedMonth >= 4 && selectedMonth <= 6) {
            $("#quater")[0].selectedIndex = 1;
        }
        else if (selectedMonth >= 7 && selectedMonth <= 9) {
            $("#quater")[0].selectedIndex = 2;
        }
        else if (selectedMonth >= 10 && selectedMonth <= 12) {
            $("#quater")[0].selectedIndex = 3;
        }
    })

    var form = $("#calculatorForm");

    form.submit(function (e) {
        e.preventDefault();

        //getting the selected Month
        var selectedMonth = parseInt($("#month").val());
        var remainingMonthsInCurrentQuater = ((12 - selectedMonth) % 3) + 1;
        //var remainingMonthsInCurrentQuater = selectedMonth % 3; 3 - Math.floor(selectedMonth / 3);
        var remainingQuaters = Math.floor((12 - selectedMonth) / 3);

        //getting the business percentage
        var businessPercentage = parseFloat($("#businessPercentage").val());

        //making the percentage in points by dividing it by 100
        businessPercentage = businessPercentage / 100.0;

        //getting driver income
        var totalIncome = parseFloat($("#driverIncome").val());

        //getting all expenses. Have made a class named 'expense-item' so will receive an array of expenses in it.
        var expenses = $(".expense-item");
        var allExpenses = 0.0;

        $.each(expenses, function (index, item) {
            //checking if user has filled that expense box.
            if ($.isNumeric(item.value)) {
                allExpenses += parseFloat(item.value);
            }
        });

        //getting all expenses. Have made a class named 'purchase-item' so will receive an array of purchases in it.
        var purchases = $(".purchase-item");
        var allPurchases = 0.0;

        $.each(purchases, function (index, item) {
            //checking if user has filled that purchase box.
            if ($.isNumeric(item.value)) {
                allPurchases += parseFloat(item.value);
            }
        })

        //adding all purchases into all expenses
        var expenseWithPurchases = allExpenses + allPurchases;

        //calculating total expenses
        var totalExpenses = businessPercentage * expenseWithPurchases;
        var totalExpensesWithoutPurchases = businessPercentage * allExpenses;

        //calculating total Income
        var netIncome = totalIncome - totalExpenses;
        var netIncomeWithoutPurchases = totalIncome - totalExpensesWithoutPurchases;

        //setting calculated net income on text box
        $("#netIncome").val(netIncome.toFixed(2))

        //calculating gst Quater
        var gstQuater = netIncome / 11.0;

        //setting calculated gst quater on text box
        $("#gstQuater").val(gstQuater.toFixed(2));

        //calculating average quaterly income.
        var averageQuaterlyIncome = (netIncomeWithoutPurchases * 3.0 / remainingMonthsInCurrentQuater) / 11.0;
        var gstAnnual = (gstQuater + (averageQuaterlyIncome * remainingQuaters));
        var averageQuarterlyIncomewithoutgst = (totalIncome * 3.0 / remainingMonthsInCurrentQuater);
        var averageQuarterlyExpensewithoutgst = (totalExpensesWithoutPurchases * 3.0 / remainingMonthsInCurrentQuater);

        ////Calculating gst Annual
        //var gstAnnual = ((netIncome * 4.0) * (selectedMonth / 12.0)) / 11.0;

        //setting calculated gst annual on text box
        $("#gstAnnual").val(gstAnnual.toFixed(2));

        //calculating earnings
        //var earnings = gstAnnual * (10.0 / 11.0);
        var earnings = (totalIncome + (averageQuarterlyIncomewithoutgst * remainingQuaters)) * 10 / 11;
        //var averageQuaterlyIncome = (netIncomeWithoutPurchases * 3.0 / remainingMonthsInCurrentQuater) / 11.0;
        //var gstAnnual = (gstQuater + (averageQuaterlyIncome * remainingQuaters));

        //setting calculated earnings on text box
        $("#earnings").val(earnings.toFixed(2));

        //getting uber fee
        // var uberFee = $("#uberFee").val();

        //checking if user has filled the box of uber fee
        // if (uberFee == "")
        //     uberFee = 0.0;
        // else
        //     uberFee = parseFloat(uberFee);

        //calculating deductions
        //var deduction = ((totalExpenses + uberFee) * 4.0) * (10.0 / 11.0);
        var deduction = ((allExpenses + (averageQuarterlyExpensewithoutgst * remainingQuaters)) + allPurchases) * (10.0 / 11.0);

        //(totalIncome + (averageQuarterlyincomewithoutgst * remainingQuaters)) * 10 / 11;

        //setting calculated deduction on text box
        $("#deduction").val(deduction.toFixed(2));

        //calculating taxable income
        var taxableIncome = earnings - deduction;

        //setting calculated taxable income on text box
        $("#taxableIncome").val(taxableIncome.toFixed(2));

        var taxRate = 0.0;

        //calculating tax on taxable income
        if (taxableIncome >= 0 && taxableIncome <= 18200)
            taxRate = 0;
        else if (taxableIncome >= 18201 && taxableIncome <= 45000)
            taxRate = (taxableIncome - 18201) * (19.0 / 100.0);
        else if (taxableIncome >= 45001 && taxableIncome <= 120000)
            taxRate = ((taxableIncome - 45001) * (32.5 / 100.0)) + 5092;
        else if (taxableIncome >= 120001 && taxableIncome <= 180000)
            taxRate = ((taxableIncome - 120001) * (37.0 / 100.0)) + 29467;
        else if (taxableIncome >= 180001)
            taxRate = ((taxableIncome - 180001) * (45.0 / 100.0)) + 51667;

        var lowIncomeOffset = 0.0;

        //calculating low income offset
        if (taxableIncome >= 0 && taxableIncome <= 37500) {
            lowIncomeOffset = 700;
        }
        else if (taxableIncome >= 37501 && taxableIncome <= 45000) {
            lowIncomeOffsetAmount = (700 - ((taxableIncome - 37500) * 0.05));
            lowIncomeOffset = 700 - lowIncomeOffsetAmount
        }
        else if (taxableIncome >= 45001 && taxableIncome <= 66667) {
            lowIncomeOffsetAmount = (325 - ((taxableIncome - 45000) * 0.015));
            lowIncomeOffset = 325 - lowIncomeOffsetAmount
        }
        else {
            lowIncomeOffset = 0.0;
        }

        var lowMiddleIncomeOffset = 0.0;

        //calculating low and middle income offset
        if (taxableIncome >= 0 && taxableIncome <= 37000) {
            lowMiddleIncomeOffset = 225;
        }
        else if (taxableIncome >= 37001 && taxableIncome <= 48000) {
            lowMiddleIncomeOffsetAmount = (255 + ((taxableIncome - 37000) * 0.075));
            lowMiddleIncomeOffset = 225 + lowIncomeOffsetAmount
        }
        else if (taxableIncome >= 48001 && taxableIncome <= 90000) {
            lowMiddleIncomeOffset = 1080
        }
        else if (taxableIncome >= 90001 && taxableIncome <= 126000) {
            lowMiddleIncomeOffsetAmount = (255 - ((taxableIncome - 90000) * 0.03));
            lowMiddleIncomeOffset = 225 + lowIncomeOffsetAmount
        }
        else {
            lowMiddleIncomeOffset = 0.00;
        }

        //calculating tax on taxable income
        var taxPayable = taxRate - (lowIncomeOffset + lowMiddleIncomeOffset);

        if (taxPayable < 0)
            taxPayable = 0;

        //setting calculated tax on taxable income on text box
        $("#taxPayable").val(taxPayable.toFixed(2));

        var medicareLevyRate = 0.0;

        //calculating medicare levy rate
        if (taxableIncome >= 0 && taxableIncome <= 20896)
            medicareLevyRate = 0.0;
        else if (taxableIncome >= 20897 && taxableIncome <= 26121)
            medicareLevyRate = (taxableIncome - 20896) * (10.0 / 100.0);
        else if (taxableIncome >= 26122)
            medicareLevyRate = (taxableIncome) * (2.0 / 100.0);

        //calculating medicare levy
        var medicareLevy = medicareLevyRate;

        //setting calculated medicare levy on text box
        $("#medicareLevy").val(medicareLevy.toFixed(2));

        $("#message1").text("You should save approximately $" + (taxPayable / (13.0 - selectedMonth) / 4.0).toFixed(2) + " per week to fulfill your tax obligation");
        $("#message2").text("You should save approximately $" + (averageQuaterlyIncome / 12.0).toFixed(2) + " per week to fulfill your GST obligation")
    })
});
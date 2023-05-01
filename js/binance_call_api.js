var auxIntervalValue = document.getElementById("intervalValue");
var auxExpectedPercentageV = document.getElementById("expectedPercentageV");
var timer = document.getElementById("timerCirc");

function setOptions() {

    if (auxIntervalValue.value != undefined || auxIntervalValue.value != 0 || auxIntervalValue.value != null) {
        window.localStorage.setItem("intervalValue", auxIntervalValue.value);
    }
    if (auxExpectedPercentageV.value != undefined || auxExpectedPercentageV.value != 0 || auxExpectedPercentageV.value != null) {
        window.localStorage.setItem("expectedPercentageV", auxExpectedPercentageV.value);
    }
    location.reload()
}

const cTable = document.getElementById("cTable")

var settingsCurrency = {
    "url": "https://fapi.binance.com/fapi/v1/exchangeInfo",
    "method": "GET",
    "timeout": 0,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
};

$.ajax(settingsCurrency).done(function(response) {

    console.log(response.symbols)
    var currencies = []
    response.symbols.forEach(function(item, index) {
        if (item.status == "TRADING") {
            currencies.push(item.symbol)
        }
    })


    var audio = document.getElementById("audio");
    var intervalValue = window.localStorage.getItem("intervalValue");
    auxIntervalValue.value = intervalValue
    var expectedPercentageV = window.localStorage.getItem("expectedPercentageV");
    auxExpectedPercentageV.value = expectedPercentageV

    if (intervalValue == undefined || intervalValue == 0 || intervalValue == null) {
        intervalValue = 60
        window.localStorage.setItem("intervalValue", intervalValue);
    }
    if (expectedPercentageV == undefined || expectedPercentageV == 0 || expectedPercentageV == null) {
        expectedPercentageV = 0.2
        window.localStorage.setItem("expectedPercentageV", expectedPercentageV);
    }

    timer.textContent = intervalValue

    var table = document.getElementById('currenci_table');
    table.setAttribute("cellpadding", 0)
    table.setAttribute("cellspacing", 0)
    table.setAttribute("border", 0)
    table.classList.add("sortable")

    var thead = document.createElement('thead');
    var trh = document.createElement('tr');
    var symbolh = document.createElement('th');
    var priceh = document.createElement('th');
    var updownh = document.createElement('th');
    var percentDiferenth = document.createElement('th');
    var candidateh = document.createElement('th');
    var linkh = document.createElement('th');
    trh.appendChild(symbolh);
    trh.appendChild(priceh);
    trh.appendChild(updownh);
    trh.appendChild(percentDiferenth);
    trh.appendChild(candidateh);
    trh.appendChild(linkh);




    var symbolt = document.createTextNode("Symbol");
    symbolh.appendChild(symbolt);
    var pricet = document.createTextNode("Price");
    priceh.appendChild(pricet);
    var updownt = document.createTextNode("UP/DOWN");
    updownh.appendChild(updownt);
    var percentDiferentt = document.createTextNode("percentD");
    percentDiferenth.appendChild(percentDiferentt);
    var candidatet = document.createTextNode("Candidate");
    candidateh.appendChild(candidatet);
    var linkht = document.createTextNode("Link");
    linkh.appendChild(linkht);
    thead.appendChild(trh);
    table.appendChild(thead);

    var tbody = document.createElement('tbody');

    var tableTabulator = new Tabulator("#currenci_table", {
        layout: "fitColumns",
        columns: [
            { title: "Symbol", field: "name" },
            { title: "Price", field: "Price", hozAlign: "right", sorter: "number" },
            { title: "UP/DOWN", field: "UP/DOWN", sorter: "boolean", formatter: "html", hozAlign: "center", },
            {
                title: "percentD",
                field: "percentD",
                hozAlign: "center",
                sorter: "number",
                sorterParams: {
                    decimalSeparator: ".",
                    alignEmptyValues: "top"
                }
            },
            { title: "Candidate", field: "Candidate", sorter: "number", formatter: "html" },
            { title: "Link", field: "Link", formatter: "html", hozAlign: "center", },
        ],
    });


    currencies.forEach(function(item, index) {
        var tr = document.createElement('tr');
        var td_name = document.createElement('td');
        var td_price = document.createElement('td');
        var flag = document.createElement('td');
        var percent = document.createElement('td');
        var prospect = document.createElement('td');
        var linkb = document.createElement('td');

        var currenci = document.createTextNode(item);
        td_price.setAttribute("id", 'td_price_' + item)
        flag.setAttribute("id", 'flag_' + item)
        tr.setAttribute("id", 'tr_' + item)
        percent.setAttribute("id", 'percent_' + item)
        prospect.setAttribute("id", 'prospect_' + item)
        linkb.setAttribute("id", 'linkb_' + item)


        td_name.appendChild(currenci);
        tr.appendChild(td_name);
        tr.appendChild(td_price);
        tr.appendChild(flag);
        tr.appendChild(percent);
        tr.appendChild(prospect);
        tr.appendChild(linkb);

        tbody.appendChild(tr);
        table.appendChild(tbody);
        cTable.appendChild(table);
    });


    function getPercentageIncrease(numA, numB) {
        x = ((numA - numB) / numB) * 100
        return x.toFixed(2);
    }

    function killTimer() {

        var tabledata = [];

        currencies.forEach(function(item, index) {
            var settings = {
                "url": "https://fapi.binance.com/fapi/v1/ticker/price?symbol=" + item,
                "method": "GET",
                "timeout": 0,
            };
            $.ajax(settings).done(function(response) {
                var td_price = document.getElementById("td_price_" + item)
                var flag = document.getElementById("flag_" + item)
                var percent = document.getElementById("percent_" + item)
                var prospect = document.getElementById("prospect_" + item)
                var linkb = document.getElementById("linkb_" + item)
                var price = document.createTextNode(response.price);


                td_price = ""

                td_price = price;
                linkb = "<a target='_blank' href='https://www.binance.com/es/futures/" + item + "'><svg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path fill='#333' d='m19 14v5c0 1.1045695-.8954305 2-2 2h-12c-1.1045695 0-2-.8954305-2-2v-12c0-1.1045695.8954305-2 2-2h5v2h-5v12h12v-5zm-.0028999-7.58578644-7.2928933 7.29289324-1.4142135-1.4142136 7.2928932-7.2928932h-4.5857864v-2h8v8h-2z' fill-rule='evenodd'/></svg></a>"


                last_price = window.localStorage.getItem("price_" + item);
                if (last_price == undefined) {
                    window.localStorage.setItem("price_" + item, response.price);
                } else {
                    flag = ""

                    percentValue = getPercentageIncrease(response.price, last_price)
                    percent_report = Math.abs(percentValue);
                    percent_target = expectedPercentageV
                    if (last_price < response.price) {
                        flag = "<svg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path fill='#27bd00' d='m15 20h-6v-8h-4.84l7.84-7.84 7.84 7.84h-4.84z'/></svg>"
                    } else {
                        flag = "<svg height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path fill='red' d='m9 4h6v8h4.84l-7.84 7.84-7.84-7.84h4.84z'/></svg>"
                    }
                    percent = percentValue
                    window.localStorage.setItem("price_" + item, response.price);
                    if (percent_report >= percent_target) {
                        audio.play();
                        prospect = ""
                        fires = Math.round(percent_report / percent_target)
                        for (var i = 0; i < fires; i++) {
                            prospect = prospect + "🔥"
                        }
                    } else {
                        prospect = ""
                    }
                }
                console.log("percent != NaN")
                console.log(percent != NaN)

                if (percent != NaN) {
                    tabledata.push({ "Symbol": item.toString(), "Price": response.price, "UP/DOWN": flag, "percentD": percent, "Candidate": prospect, "Link": linkb })
                    tableTabulator.updateOrAddRow(index, { "Symbol": item.toString(), "Price": response.price, "UP/DOWN": flag, "percentD": percent, "Candidate": prospect, "Link": linkb })
                }
            });
        });

    }

    setInterval(killTimer, intervalValue * 1000);
    startTimer()

    function startTimer() {
        let progressElm = document.getElementsByClassName('progress')[0];
        let circumference = 2 * Math.PI * progressElm.getAttribute('r');
        progressElm.style.strokeDasharray = circumference;
        progressElm.style.strokeDashoffset = circumference * 0;
        let max = parseInt(document.getElementsByClassName('seconds')[0].textContent);
        let seconds = max;
        let secondsElm = document.getElementsByClassName('seconds')[0];
        let timerId = setInterval(() => {
            seconds--;
            if (seconds <= 0)
                clearInterval(timerId);
            percentage = seconds / max * 100;
            progressElm.style.strokeDashoffset = circumference - (percentage / 100) * circumference;
            secondsElm.textContent = seconds.toString().padStart(2, '0');
            if (seconds <= 0) {
                timer.textContent = intervalValue
                startTimer()
            }

        }, 1000);
    }

});
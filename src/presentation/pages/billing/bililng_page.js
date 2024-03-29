import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import '../../../common.css';
import '../admin/admin_page.css';
import './billing_page.css';
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import { DEFAULT_ANALYTICS, getColorFromSeed } from "core/constants";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";
import moment from "moment";
import MonthPicker from "simple-react-month-picker";

function BillingPage() {
    const dispatch = useDispatch();
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [selectedMonthData, setSelectedMonthData] = useState({
        month: 9,
        year: 2023,
    });
    const [selectedMonth, setSelectedMonth] = useState('');

    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [usageTrendsBreakdownData, setUsageTrendsBreakdownData] = useState({
        headers: [
            { text: 'Name' },
            { text: 'Description' },
            { text: 'Models' },
            { text: 'ACU Incurred' }
        ],
        body: [

        ],
    });


    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    const months = [
        { value: '1', label: 'January' },
        { value: '2', label: 'February' },
        { value: '3', label: 'March' },
        { value: '4', label: 'April' },
        { value: '5', label: 'May' },
        { value: '6', label: 'June' },
        { value: '7', label: 'July' },
        { value: '8', label: 'August' },
        { value: '9', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' },
    ];


    const handleSelect = () => {
        const month = parseInt(selectedMonth);

        if (!isNaN(month)) {
            const selectedDate = new Date(month - 1);
            //   onMonthSelect(selectedDate);
            //   onClose();
        }
    };

    const proprocessTrendsBreakdownData = async (data) => {
        var processedData = [];

        for (let deployment of data) {
            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: "v3.2.1", customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "This is a short description of the compatiblity tag", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    {
                        Component: TagsListComponent, data: {
                            tags: [`model-name-${deployment}`, "smol-model" + ((deployment-5*234))], tableData: {
                                headers: [{ text: 'Name' }, { text: 'Description' }],
                                body: [
                                    [{ Component: TextOnlyComponent, data: { text: "model-name-1", customStyle: { fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins' } } }, { Component: TextOnlyComponent, data: { text: "This is a sample mfin description", customStyle: { fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins' } } }]
                                ]
                            }, tableTitle: "Linked Compatiblity Tag Details", truncationLimit: 2, expandable: true, highlightOnHover: true
                        }
                    },
                    { Component: TextOnlyComponent, data: { text: "341", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                ]
            );
        }

        const newData = { ...usageTrendsBreakdownData, body: processedData };
        setUsageTrendsBreakdownData(newData);
        dispatch(loaderActions.toggleLoader(false));
    }

    useEffect(() => {
        proprocessTrendsBreakdownData([1, 2, 3, 4, 5]);
    });

    return (
        <div className={`flexColumn adminPage`}>
            <div className={`flexColumn adminPageHeader`}>
                <div className={`adminPageTitle`}>Billing Information</div>
                <div className={`adminPageSubtitle`}>Monitor Active Compute Units In Realtime</div>
            </div>
            <div className={`adminPageContent`}>
                <p className="pageHeaders">Usage At A Glance</p>
                <div className="glanceCardsRow">
                    <div className="glanceCard" style={{ backgroundColor: getColorFromSeed("9") }}>
                        <p className="glanceCardTitle">105</p>
                        <p className="glanceCardSubTitle">Total ACU incurred this month till date</p>
                    </div>
                    <div className="glanceCard" style={{ backgroundColor: getColorFromSeed("9") }}>
                        <p className="glanceCardTitle">783</p>
                        <p className="glanceCardSubTitle">Previous month ACU usage</p>
                    </div>
                    <div className="glanceCard" style={{ backgroundColor: getColorFromSeed("9") }}>
                        <p className="glanceCardTitle">231</p>
                        <p className="glanceCardSubTitle">ACU usage till date previous month</p>
                    </div>
                    <div className="glanceCard" style={{ backgroundColor: getColorFromSeed("9") }}>
                        <p className="glanceCardTitle">598</p>
                        <p className="glanceCardSubTitle">Projected ACU by the end of this month</p>
                    </div>
                </div>

                <p className="pageHeaders">Usage Trends</p>
                <div className="graphBox">
                    <div className="graphInfo">
                        <div className="graphLegends">
                            <p className="pageSubHeaders">Legend</p>
                            <div className="graphLegend">
                                <div className="legendSolidLine"></div>
                                <p className="legendTitle">Usage Till Date</p>
                            </div>
                            <div className="graphLegend">
                                <div className="legendDottedLine"></div>
                                <p className="legendTitle">Projected Usage</p>
                            </div>
                        </div>
                        <div className="monthPicker" onClick={() => { setShowMonthPicker(true) }}>
                            <img style={{ marginRight: "4px" }} src={"/assets/icons/calendar.svg"} ></img>
                            <select value={selectedMonth} onChange={handleMonthChange} className="legendPickerFont" style={{ border: 'none', outline: 'none', background: 'none', appearance: 'none' }}>
                                {months.map((month) => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                            <img style={{ height: "8px" }} className="centerVertically" src={"/assets/icons/dropdownArrow.svg"} ></img>
                        </div>
                    </div>
                    <div className="usageTrendsGraph">
                        <AnalyticsLineChart
                            trends={DEFAULT_ANALYTICS["LatencyTrends"]}
                            trendsTimeline={DEFAULT_ANALYTICS["latencyTrendsTimeline"]}
                        ></AnalyticsLineChart>
                    </div>
                </div>

                <p className="pageHeaders">Usage Trends Breakdown</p>
                <div className="graphBox">
                    <div className="graphInfo">
                        <div className="graphLegends">
                            <p className="pageSubHeaders">Legend</p>
                            <div className="graphLegend">
                                <div className="legendSolidLine"></div>
                                <p className="legendTitle">Model</p>
                            </div>
                            <div className="graphLegend">
                                <div className="legendSolidLine"></div>
                                <p className="legendTitle">Script</p>
                            </div>
                        </div>
                        <div className="monthPicker" onClick={() => { setShowMonthPicker(true) }}>
                            <img style={{ marginRight: "4px" }} src={"/assets/icons/calendar.svg"} ></img>
                            <select value={selectedMonth} onChange={handleMonthChange} className="legendPickerFont" style={{ border: 'none', outline: 'none', background: 'none', appearance: 'none' }}>
                                {["Deployments", "Models", "Scripts", "Compatiblity Tags"].map((options) => (
                                    <option key={options} value={options}>
                                        {options}
                                    </option>
                                ))}
                            </select>
                            <img style={{ height: "8px" }} className="centerVertically" src={"/assets/icons/dropdownArrow.svg"} ></img>
                        </div>
                    </div>
                    <div className="usageTrendsGraph">
                        <StackedBarChart
                            trends={DEFAULT_ANALYTICS["LatencyTrends"]}
                            trendsTimeline={DEFAULT_ANALYTICS["latencyTrendsTimeline"]}
                        ></StackedBarChart>
                    </div>
                </div>

                <div className={`tasksTableView flexColumn overflowAuto`}>
                    <Table data={usageTrendsBreakdownData} />
                </div>
            </div>
            <a className="externalLink" href="https://codeclock.in">Please click here to perform advance queries.</a>
        </div>
    );
}

export default BillingPage;
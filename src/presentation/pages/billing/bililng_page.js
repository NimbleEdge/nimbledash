import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import '../../../common.css';
import '../admin/admin_page.css';
import './billing_page.css';
import AnalyticsLineChart from "presentation/components/charts/line_chart";
import { DEFAULT_ANALYTICS } from "core/constants";
import StackedBarChart from "presentation/components/charts/stacked_bar_chart";

function BillingPage() {
    const dispatch = useDispatch();
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

    const proprocessTrendsBreakdownData = async (data) => {
        var processedData = [];

        for (let deployment of data) {
            processedData.push(
                [
                    { Component: TextOnlyComponent, data: { text: "v3.2.1", customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: "This is a short description of the compatiblity tag", customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    {
                        Component: TagsListComponent, data: {
                            tags: ["model-name-1", "smol-model"], tableData: {
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
                    <div className="glanceCard">
                        <p className="glanceCardTitle">105</p>
                        <p className="glanceCardSubTitle">Total ACU incurred this month till date</p>
                    </div>
                    <div className="glanceCard">
                        <p className="glanceCardTitle">105</p>
                        <p className="glanceCardSubTitle">Total ACU incurred this month till date</p>
                    </div>
                    <div className="glanceCard">
                        <p className="glanceCardTitle">105</p>
                        <p className="glanceCardSubTitle">Total ACU incurred this month till date</p>
                    </div>
                    <div className="glanceCard">
                        <p className="glanceCardTitle">105</p>
                        <p className="glanceCardSubTitle">Total ACU incurred this month till date</p>
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
                        <div className="timeDropDown"></div>
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
                                <p className="legendTitle">Usage Till Date</p>
                            </div>
                            <div className="graphLegend">
                                <div className="legendDottedLine"></div>
                                <p className="legendTitle">Projected Usage</p>
                            </div>
                        </div>
                        <div className="timeDropDown"></div>
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
        </div>
    );
}

export default BillingPage;
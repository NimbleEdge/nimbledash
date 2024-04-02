//API ENDPOINTS
export const GET_ANALYTICS = "geteAnalytics";

//LOCAL STORAGE KEY
export const ACCESS_TOKEN = "at";
export const USER_EMAIL = "user_email";
export const CLIENT_ID = "client_id";
export const COGNITO_USERNAME = "cognito_username";
export const AUTH_METHOD = "auth_method";

// COLORS
export const ACCENT_COLOR = "#6565FF"
export const STROKE_COLORS_LIST = ["#F3AD84", "#DD8E8E", "#B57994", "#826A8D", "#515A78", "#2F4858", "#5F8F43", "#FFBEC1"];
export const GRAPH_COLORS = ["#0D2535", "#5388D8", "#F4BE37", "#FF9F40"];
export const TAG_COLORS = ['#FFC1C1', '#F8E3D3', '#F8F4D3', '#D3E8F8', '#D3F8EB', '#ECD3F8', '#D6D3F8'];
export const TAG_FONT_COLORS = ['#CF0000', '#903D00', '#9A8A00', '#0091FF', '#00A569', '#AD00FF', '#4E3FFF'];

export function getColorFromSeed(seed) {
    if (seed == null) seed = "randim";
    const seedNumber = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seedNumber % TAG_COLORS.length;
    return {
        background: TAG_COLORS[index],
        fontColor: TAG_FONT_COLORS[index]
    };
}

//APP GLOBAL CONFIG
export const APP_BASE_DMS_URL = process.env.REACT_APP_API_DMS_URL;
export const APP_BASE_MDS_URL = process.env.REACT_APP_API_MDS_URL;

//APP ENUMS
export const PermissionEnum = {
    READ_WRITE: "read_write",
    READ: "read_only",
    ADMIN: "admin"
}

//Defaults
export const DEFAULT_ANALYTICS = {
    "status": 200,
    "error": null,
    "totalInferences": 0,
    "totalErrors": 0,
    "averageInferences": 0,
    "averageLatency": 0,
    "activeUsersTrends": {
        "DummyAnalytics": 2
    },
    "LatencyTrends": {
        "DummyAnalytics": [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10
        ]
    },
    "totalInferenceTrends": {
        "DummyAnalytics": 136
    },
    "dau": {},
    "latencyTrendsTimeline": [
        "2023-06-19T12:45:00Z",
        "2023-06-19T10:11:00Z",
        "2023-06-19T07:37:00Z",
        "2023-06-19T05:03:00Z",
        "2023-06-19T02:29:00Z",
        "2023-06-18T23:55:00Z",
        "2023-06-18T21:21:00Z",
        "2023-06-18T18:47:00Z",
        "2023-06-18T16:13:00Z",
        "2023-06-18T13:39:00Z",
    ]
}
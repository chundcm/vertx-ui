const layout = {
    2016: "6,18",
    2108: "10,14",
    1024: "4,20",    // ---- ---- ---- ---- ---- ----
    3010: "10,14",
    3208: "10,14",

    4009: "16,8",    // ---- --
    4105: "10,14",   //        -- ----
    4205: "10,14",   //                ---- --
    4305: "10,14",   //                       -- ----
    3011: "13,11",   // ---- ----
    3107: "15,9",    //           ---- ----
    3207: "12,12",   //                     ---- ----
    3012: "12,12",   // ---- ---- ----
    3106: "10,14",   //                ---- --
    3206: "10,14",   //                       -- ----
    1012: "9,9",    // ---- ---- ----
    2014: "10,14",   // ---- ---- ----
    2110: "5,19",    //                ---- ---- ----
    2011: "13,11",    // ---- ----
    2113: "4,20,95", //           ---- ---- ---- ----
    2012: "13,11,92",// ---- ----
    2112: "8,16", //           ---- ---- ---- ----
    2013: "11,13,95",    // ---- ----
    2111: "4,20,93", //           ---- ---- ---- ----
    2009: "16,8",    // ---- ----
    2115: "3,21",    //           ---- ---- ---- ----
    2019: "8,16,95", // ---- ---- ---- ----
    2105: "8,16,95", //                     ---- ----
};
const adjust = {
    1024: "0%,0%"
};
export default {
    layout,
    adjust,
    row: {
        1: [24],
        2: [14, 10],
        3: [10, 7, 7],
        4: [9, 5, 5, 5]
    }
};
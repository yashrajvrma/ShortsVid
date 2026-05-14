"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTION_PLAN_CONFIG = exports.CREDITS_PER_VIDEO = exports.polar = void 0;
exports.getSubscriptionPlanConfigByProductId = getSubscriptionPlanConfigByProductId;
// src/lib/polar.ts
var sdk_1 = require("@polar-sh/sdk");
var client_1 = require("@prisma/client");
var env_1 = require("@/lib/env");
exports.polar = new sdk_1.Polar({
    // TODO : add all env in env.ts file
    accessToken: env_1.env.POLAR_ACCESS_TOKEN,
    server: env_1.env.POLAR_SERVER_ENVIRONMENT, // use "sandbox" for testing
});
exports.CREDITS_PER_VIDEO = 5;
exports.SUBSCRIPTION_PLAN_CONFIG = {
    BASIC_MONTHLY: {
        productId: env_1.env.POLAR_BASIC_MONTHLY_PRODUCT_ID,
        plan: client_1.SubscriptionPlan.BASIC,
        period: client_1.SubscriptionPeriod.MONTHLY,
        credits: 150,
        label: "Basic Monthly",
    },
    BASIC_YEARLY: {
        productId: env_1.env.POLAR_BASIC_YEARLY_PRODUCT_ID,
        plan: client_1.SubscriptionPlan.BASIC,
        period: client_1.SubscriptionPeriod.YEARLY,
        credits: 1800, // 150 × 12 — credited upfront
        label: "Basic Yearly",
    },
    PRO_MONTHLY: {
        productId: env_1.env.POLAR_PRO_MONTHLY_PRODUCT_ID,
        plan: client_1.SubscriptionPlan.PRO,
        period: client_1.SubscriptionPeriod.MONTHLY,
        credits: 500,
        label: "Pro Monthly",
    },
    PRO_YEARLY: {
        productId: env_1.env.POLAR_PRO_YEARLY_PRODUCT_ID,
        plan: client_1.SubscriptionPlan.PRO,
        period: client_1.SubscriptionPeriod.YEARLY,
        credits: 6000, // 500 × 12 — credited upfront
        label: "Pro Yearly",
    },
};
// reverse lookup: productId → plan config
function getSubscriptionPlanConfigByProductId(productId) {
    var entry = Object.entries(exports.SUBSCRIPTION_PLAN_CONFIG).find(function (_a) {
        var config = _a[1];
        return config.productId === productId;
    });
    if (!entry)
        return null;
    return __assign({ key: entry[0] }, entry[1]);
}

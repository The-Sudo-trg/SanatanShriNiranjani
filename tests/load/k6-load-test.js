// k6 load test (brief Phase 16) — realistic 10,000-VU traffic profile.
//
// RUN LOCALLY OR AGAINST AN AUTHORIZED STAGING ENVIRONMENT ONLY.
//   k6 run tests/load/k6-load-test.js
//   BASE_URL=https://staging.example.invalid k6 run tests/load/k6-load-test.js
// NEVER point this at the public production website.
//
// "10,000 virtual users" ≠ 10,000 simultaneous requests: VUs think between
// requests (real browsing). Stages ramp gradually; run against a sized load
// generator and record results. Mix (brief): 30% home/featured, 25% directory,
// 15% temple detail, 12% daily wisdom, 8% search/filter, 5% festivals/mantras,
// 5% preference actions (favorites are client-local, so covered by reads).

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend } from "k6/metrics";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

const latency = new Trend("page_latency_ms", true);

export const options = {
  scenarios: {
    visitors: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 200 }, // baseline + warm-up
        { duration: "3m", target: 1000 }, // stage 3
        { duration: "3m", target: 5000 }, // stage 4
        { duration: "5m", target: 10000 }, // stage 5 — target scenario
        { duration: "2m", target: 12000 }, // stage 6 — cautious stress probe
        { duration: "3m", target: 0 }, // stage 7 — recovery
      ],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    // Targets (brief §16) — interpret per endpoint/infra; tune after stage 1.
    http_req_failed: ["rate<0.01"],
    "http_req_duration{page:home}": ["p(95)<500"],
    "http_req_duration{page:temples}": ["p(95)<500"],
    "http_req_duration{page:temple_detail}": ["p(95)<800"],
  },
};

const TEMPLE_SLUGS = [
  "/temples/akshardham-temple-new-delhi",
  "/temples/kalkaji-mandir-new-delhi",
  "/temples/iskcon-temple-east-of-kailash-new-delhi",
  "/temples/pracheen-hanuman-mandir-connaught-place",
  "/temples/jhandewalan-temple-new-delhi",
];

const PAGES = [
  { url: "/", weight: 30, tag: "home" },
  { url: "/temples", weight: 25, tag: "temples" },
  { url: null, weight: 15, tag: "temple_detail" }, // picked from TEMPLE_SLUGS
  { url: "/daily-darshan", weight: 12, tag: "darshan" },
  { url: "/search", weight: 8, tag: "search" },
  { url: "/festivals", weight: 5, tag: "festivals" },
  { url: "/mantras", weight: 5, tag: "mantras" },
];

function pickPage() {
  let r = Math.random() * 100;
  for (const p of PAGES) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return PAGES[0];
}

export default function visitorJourney() {
  group("visitor journey", () => {
    const p = pickPage();
    const path = p.url ?? TEMPLE_SLUGS[Math.floor(Math.random() * TEMPLE_SLUGS.length)];
    const res = http.get(`${BASE_URL}${path}`, { tags: { page: p.tag } });
    latency.add(res.timings.duration, { page: p.tag });
    check(res, {
      "status 200": (r) => r.status === 200,
      "body present": (r) => r.body && r.body.length > 1000,
    });
    // simulate reading; light think-time keeps 10k VUs realistic
    sleep(2 + Math.random() * 6);
  });
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}

import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.4/index.js";

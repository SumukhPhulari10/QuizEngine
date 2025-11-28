(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__938c4a14._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/lib/branch-auth.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BRANCH_ALIASES",
    ()=>BRANCH_ALIASES,
    "enforceStudentBranch",
    ()=>enforceStudentBranch,
    "findCanonicalBranch",
    ()=>findCanonicalBranch,
    "getBranchFromRequest",
    ()=>getBranchFromRequest,
    "getRoleFromRequest",
    ()=>getRoleFromRequest,
    "getStudentContext",
    ()=>getStudentContext,
    "redirectToStudentBranch",
    ()=>redirectToStudentBranch,
    "validateStudentBranchRequest",
    ()=>validateStudentBranchRequest
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$headers$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/api/headers.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/server/request/cookies.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/api/navigation.react-server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/client/components/navigation.react-server.js [middleware-edge] (ecmascript)");
;
;
;
const normalize = (value = "")=>value.trim().toLowerCase();
const BRANCH_ALIASES = {
    cse: [
        "cse",
        "computer-science",
        "computer science engineering",
        "computer science"
    ],
    mech: [
        "mech",
        "mechanical",
        "mechanical engineering"
    ],
    civil: [
        "civil",
        "civil engineering"
    ],
    ece: [
        "ece",
        "electronics",
        "electronics and communication"
    ],
    aiml: [
        "aiml",
        "ai-ml",
        "ai",
        "ml",
        "artificial-intelligence",
        "machine-learning"
    ],
    it: [
        "it",
        "information-technology",
        "information technology"
    ]
};
const STUDENT_SEGMENT = "student";
const resolveBaseUrl = (req)=>{
    if (req) return req.url;
    return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
};
const findCanonicalBranch = (branch)=>{
    if (!branch) return undefined;
    const normalized = normalize(branch);
    return Object.entries(BRANCH_ALIASES).find(([, aliases])=>aliases.includes(normalized))?.[0];
};
const readCookie = (keys, req)=>{
    const valueFromRequest = keys.map((key)=>req?.cookies?.get(key)?.value).find((val)=>Boolean(val));
    if (valueFromRequest) return valueFromRequest;
    try {
        const cookieStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
        return keys.map((key)=>cookieStore.get(key)?.value).find((val)=>Boolean(val)) || "";
    } catch  {
        return "";
    }
};
function getRoleFromRequest(req) {
    return normalize(readCookie([
        "role",
        "qe-role"
    ], req));
}
function getBranchFromRequest(req) {
    return findCanonicalBranch(readCookie([
        "branch",
        "qe-branch"
    ], req));
}
function redirectToStudentBranch(branch, req) {
    const canonical = branch?.toLowerCase();
    const target = `/student/${canonical}/dashboard`;
    const url = new URL(target, resolveBaseUrl(req));
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
}
const extractBranchFromPath = (pathname)=>{
    const segments = pathname.split("/").filter(Boolean);
    const studentIdx = segments.indexOf(STUDENT_SEGMENT);
    if (studentIdx === -1) return undefined;
    const branchCandidate = segments[studentIdx + 1];
    return findCanonicalBranch(branchCandidate);
};
function validateStudentBranchRequest(req) {
    const role = getRoleFromRequest(req);
    const branchCookie = getBranchFromRequest(req);
    if (!role) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", resolveBaseUrl(req)));
    }
    if (role !== "student") return null;
    if (!branchCookie) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL("/login", resolveBaseUrl(req)));
    }
    const requestedBranch = extractBranchFromPath(req.nextUrl.pathname);
    if (!requestedBranch || requestedBranch !== branchCookie) {
        return redirectToStudentBranch(branchCookie, req);
    }
    return null;
}
async function getStudentContext() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$request$2f$cookies$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["cookies"])();
    const role = normalize(cookieStore.get("role")?.value || cookieStore.get("qe-role")?.value || "");
    const branch = findCanonicalBranch(cookieStore.get("branch")?.value || cookieStore.get("qe-branch")?.value);
    return {
        role,
        branch
    };
}
async function enforceStudentBranch(requiredBranch) {
    const { role, branch } = await getStudentContext();
    if (!role) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    if (role !== "student") {
        return {
            role,
            branch
        };
    }
    if (!branch) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["redirect"])("/login");
    }
    if (requiredBranch && branch !== requiredBranch) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["redirect"])(`/student/${branch}/dashboard`);
    }
    return {
        role,
        branch
    };
}
}),
"[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/middleware.js [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$lib$2f$branch$2d$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/OneDrive/Desktop/Quiz_engine/QuizEngine/lib/branch-auth.ts [middleware-edge] (ecmascript)");
;
;
function middleware(request) {
    const url = request.nextUrl.clone();
    const role = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$lib$2f$branch$2d$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getRoleFromRequest"])(request) || '';
    const branch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$lib$2f$branch$2d$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["getBranchFromRequest"])(request);
    if (url.pathname === '/dashboard' || url.pathname === '/dashboard/') {
        if (role === 'admin') {
            url.pathname = '/dashboard/admin';
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        if (role === 'teacher') {
            url.pathname = '/dashboard/teacher';
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
        if (role === 'student' && branch) {
            url.pathname = `/student/${branch}/dashboard`;
            return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(url);
        }
    }
    if (url.pathname.startsWith('/student/') || url.pathname.startsWith('/dashboard/student')) {
        const blocked = (0, __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$lib$2f$branch$2d$auth$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["validateStudentBranchRequest"])(request);
        if (blocked) return blocked;
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$OneDrive$2f$Desktop$2f$Quiz_engine$2f$QuizEngine$2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/student/:path*',
        '/dashboard/:path*',
        '/dashboard'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__938c4a14._.js.map
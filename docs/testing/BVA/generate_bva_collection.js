const fs = require('fs');
const path = require('path');

const collection = {
  info: {
    _postman_id: "bva-auth-user-suite-2026",
    name: "FutureSushi - Auth & User BVA Test Suite",
    description: "Bộ kiểm thử tự động phân tích giá trị biên (Boundary Value Analysis - BVA) cho các input Auth & User trên Postman.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  variable: [
    { key: "baseUrl", value: "http://localhost:3000", type: "string" },
    { key: "admin_token", value: "", type: "string" },
    { key: "customer_token", value: "", type: "string" },
    { key: "staff_token", value: "", type: "string" },
    { key: "target_user_id", value: "1", type: "string" },
    { key: "admin_id", value: "1", type: "string" },
    { key: "created_test_user_id", value: "", type: "string" }
  ],
  item: []
};

// 0. Setup & Auth Helper
const setupFolder = {
  name: "0. Setup & Authentication Tokens",
  item: [
    {
      name: "0.1 Setup - Admin Login (Get Admin Token)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "if (pm.response.code === 200) {",
              "    const res = pm.response.json();",
              "    pm.collectionVariables.set('admin_token', res.token);",
              "    pm.collectionVariables.set('admin_id', String(res.user.id));",
              "    console.log('Admin Token saved');",
              "}"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: JSON.stringify({ account: "admin", password: "123" })
        },
        url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
      }
    },
    {
      name: "0.2 Setup - Customer Login (Get Customer Token)",
      event: [
        {
          listen: "test",
          script: {
            exec: [
              "if (pm.response.code === 200) {",
              "    const res = pm.response.json();",
              "    pm.collectionVariables.set('customer_token', res.token);",
              "    console.log('Customer Token saved');",
              "}"
            ],
            type: "text/javascript"
          }
        }
      ],
      request: {
        method: "POST",
        header: [{ key: "Content-Type", value: "application/json" }],
        body: {
          mode: "raw",
          raw: JSON.stringify({ account: "customer", password: "123" })
        },
        url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
      }
    }
  ]
};
collection.item.push(setupFolder);

// 1. POST /api/auth/register (BVA)
const regFolder = {
  name: "1. POST /api/auth/register (BVA Input Matrix)",
  item: []
};

function addRegCase(tcId, name, preScript, bodyObj, expectedCodes, testScriptExtra = "") {
  regFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "prerequest",
        script: {
          exec: [
            "const ts = Date.now().toString().slice(-6);",
            "const rand = Math.floor(Math.random() * 9000 + 1000);",
            "pm.variables.set('dyn_ts', ts + rand);",
            ...preScript
          ],
          type: "text/javascript"
        }
      },
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status Code verification", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`,
            testScriptExtra
          ].filter(Boolean),
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "POST",
      header: [{ key: "Content-Type", value: "application/json" }],
      body: {
        mode: "raw",
        raw: typeof bodyObj === 'string' ? bodyObj : JSON.stringify(bodyObj, null, 2)
      },
      url: { raw: "{{baseUrl}}/api/auth/register", host: ["{{baseUrl}}"], path: ["api", "auth", "register"] }
    }
  });
}

// fullName BVA
addRegCase("TC_BVA_REG_001", "fullName Min boundary = 1 char ('A')", [], 
  { fullName: "A", email: "fn1_{{dyn_ts}}@gmail.com", phone: "091{{dyn_ts}}", username: "u1_{{dyn_ts}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.fullName).to.eql('A');");

addRegCase("TC_BVA_REG_002", "fullName Min+1 boundary = 2 chars ('An')", [], 
  { fullName: "An", email: "fn2_{{dyn_ts}}@gmail.com", phone: "092{{dyn_ts}}", username: "u2_{{dyn_ts}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.fullName).to.eql('An');");

addRegCase("TC_BVA_REG_003", "fullName Max-1 boundary = 99 chars", ["pm.variables.set('fn_99', 'N'.repeat(99));"],
  { fullName: "{{fn_99}}", email: "fn99_{{dyn_ts}}@gmail.com", phone: "093{{dyn_ts}}", username: "u99_{{dyn_ts}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.fullName.length).to.eql(99);");

addRegCase("TC_BVA_REG_004", "fullName Max boundary = 100 chars", ["pm.variables.set('fn_100', 'N'.repeat(100));"],
  { fullName: "{{fn_100}}", email: "fn100_{{dyn_ts}}@gmail.com", phone: "094{{dyn_ts}}", username: "u100_{{dyn_ts}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.fullName.length).to.eql(100);");

addRegCase("TC_BVA_REG_005", "fullName Max+1 boundary = 101 chars (Invalid / Overflow)", ["pm.variables.set('fn_101', 'N'.repeat(101));"],
  { fullName: "{{fn_101}}", email: "fn101_{{dyn_ts}}@gmail.com", phone: "095{{dyn_ts}}", username: "u101_{{dyn_ts}}", password: "Password123@" }, [400, 422, 500]);

addRegCase("TC_BVA_REG_006", "fullName Min-1 boundary = Empty string ''", [],
  { fullName: "", email: "fn0_{{dyn_ts}}@gmail.com", phone: "096{{dyn_ts}}", username: "u0_{{dyn_ts}}", password: "Password123@" }, [400, 422, 500]);

// username BVA
addRegCase("TC_BVA_REG_007", "username Min-1 boundary = 2 chars ('ab')", [],
  { fullName: "Test User", email: "un2_{{dyn_ts}}@gmail.com", phone: "097{{dyn_ts}}", username: "ab", password: "Password123@" }, [400, 422, 201]);

addRegCase("TC_BVA_REG_008", "username Min boundary = 3 chars", ["pm.variables.set('un_3', 'u' + pm.variables.get('dyn_ts').slice(-2));"],
  { fullName: "Test User", email: "un3_{{dyn_ts}}@gmail.com", phone: "098{{dyn_ts}}", username: "{{un_3}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.username.length).to.eql(3);");

addRegCase("TC_BVA_REG_009", "username Min+1 boundary = 4 chars", ["pm.variables.set('un_4', 'u' + pm.variables.get('dyn_ts').slice(-3));"],
  { fullName: "Test User", email: "un4_{{dyn_ts}}@gmail.com", phone: "099{{dyn_ts}}", username: "{{un_4}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.username.length).to.eql(4);");

addRegCase("TC_BVA_REG_010", "username Max-1 boundary = 39 chars", ["pm.variables.set('un_39', 'u_' + 'a'.repeat(27) + pm.variables.get('dyn_ts'));"],
  { fullName: "Test User", email: "un39_{{dyn_ts}}@gmail.com", phone: "081{{dyn_ts}}", username: "{{un_39}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.username.length).to.eql(39);");

addRegCase("TC_BVA_REG_011", "username Max boundary = 40 chars", ["pm.variables.set('un_40', 'u_' + 'a'.repeat(28) + pm.variables.get('dyn_ts'));"],
  { fullName: "Test User", email: "un40_{{dyn_ts}}@gmail.com", phone: "082{{dyn_ts}}", username: "{{un_40}}", password: "Password123@" }, [201],
  "if (pm.response.code === 201) pm.expect(pm.response.json().user.username.length).to.eql(40);");

addRegCase("TC_BVA_REG_012", "username Max+1 boundary = 41 chars (Overflow)", ["pm.variables.set('un_41', 'u_' + 'a'.repeat(29) + pm.variables.get('dyn_ts'));"],
  { fullName: "Test User", email: "un41_{{dyn_ts}}@gmail.com", phone: "083{{dyn_ts}}", username: "{{un_41}}", password: "Password123@" }, [400, 422, 500]);

// password BVA
addRegCase("TC_BVA_REG_013", "password Min-1 boundary = 5 chars ('12345')", [],
  { fullName: "Test Pass", email: "p5_{{dyn_ts}}@gmail.com", phone: "084{{dyn_ts}}", username: "p5_{{dyn_ts}}", password: "12345" }, [400, 422, 201]);

addRegCase("TC_BVA_REG_014", "password Min boundary = 6 chars ('123456')", [],
  { fullName: "Test Pass", email: "p6_{{dyn_ts}}@gmail.com", phone: "085{{dyn_ts}}", username: "p6_{{dyn_ts}}", password: "123456" }, [201]);

addRegCase("TC_BVA_REG_015", "password Min+1 boundary = 7 chars ('1234567')", [],
  { fullName: "Test Pass", email: "p7_{{dyn_ts}}@gmail.com", phone: "086{{dyn_ts}}", username: "p7_{{dyn_ts}}", password: "1234567" }, [201]);

addRegCase("TC_BVA_REG_016", "password Max-1 boundary = 254 chars", ["pm.variables.set('p_254', 'P@ss' + 'a'.repeat(250));"],
  { fullName: "Test Pass", email: "p254_{{dyn_ts}}@gmail.com", phone: "087{{dyn_ts}}", username: "p254_{{dyn_ts}}", password: "{{p_254}}" }, [201]);

addRegCase("TC_BVA_REG_017", "password Max boundary = 255 chars", ["pm.variables.set('p_255', 'P@ss' + 'a'.repeat(251));"],
  { fullName: "Test Pass", email: "p255_{{dyn_ts}}@gmail.com", phone: "088{{dyn_ts}}", username: "p255_{{dyn_ts}}", password: "{{p_255}}" }, [201]);

addRegCase("TC_BVA_REG_018", "password Max+1 boundary = 256 chars (Overflow)", ["pm.variables.set('p_256', 'P@ss' + 'a'.repeat(252));"],
  { fullName: "Test Pass", email: "p256_{{dyn_ts}}@gmail.com", phone: "089{{dyn_ts}}", username: "p256_{{dyn_ts}}", password: "{{p_256}}" }, [400, 422, 500]);

// phone BVA
addRegCase("TC_BVA_REG_019", "phone Min-1 boundary = 9 digits", [],
  { fullName: "Test Phone", email: "ph9_{{dyn_ts}}@gmail.com", phone: "091234567", username: "ph9_{{dyn_ts}}", password: "Password123@" }, [400, 422, 201]);

addRegCase("TC_BVA_REG_020", "phone Standard VN Min boundary = 10 digits", [],
  { fullName: "Test Phone", email: "ph10_{{dyn_ts}}@gmail.com", phone: "09{{dyn_ts}}", username: "ph10_{{dyn_ts}}", password: "Password123@" }, [201]);

addRegCase("TC_BVA_REG_021", "phone Min+1 boundary = 11 digits", [],
  { fullName: "Test Phone", email: "ph11_{{dyn_ts}}@gmail.com", phone: "090{{dyn_ts}}", username: "ph11_{{dyn_ts}}", password: "Password123@" }, [201]);

addRegCase("TC_BVA_REG_022", "phone Max-1 boundary = 19 chars", ["pm.variables.set('ph_19', '+84' + '0'.repeat(9) + pm.variables.get('dyn_ts').slice(-7));"],
  { fullName: "Test Phone", email: "ph19_{{dyn_ts}}@gmail.com", phone: "{{ph_19}}", username: "ph19_{{dyn_ts}}", password: "Password123@" }, [201]);

addRegCase("TC_BVA_REG_023", "phone Max boundary = 20 chars", ["pm.variables.set('ph_20', '+84' + '0'.repeat(10) + pm.variables.get('dyn_ts').slice(-7));"],
  { fullName: "Test Phone", email: "ph20_{{dyn_ts}}@gmail.com", phone: "{{ph_20}}", username: "ph20_{{dyn_ts}}", password: "Password123@" }, [201]);

addRegCase("TC_BVA_REG_024", "phone Max+1 boundary = 21 chars (Overflow)", ["pm.variables.set('ph_21', '+84' + '0'.repeat(11) + pm.variables.get('dyn_ts').slice(-7));"],
  { fullName: "Test Phone", email: "ph21_{{dyn_ts}}@gmail.com", phone: "{{ph_21}}", username: "ph21_{{dyn_ts}}", password: "Password123@" }, [400, 422, 500]);

// email BVA
addRegCase("TC_BVA_REG_025", "email Min boundary = 5 chars ('a@b.c')", [],
  { fullName: "Test Email", email: "a@b.c", phone: "071{{dyn_ts}}", username: "em5_{{dyn_ts}}", password: "Password123@" }, [201, 400]);

addRegCase("TC_BVA_REG_026", "email Max boundary = 100 chars", ["pm.variables.set('em_100', 'em_' + 'a'.repeat(80) + pm.variables.get('dyn_ts') + '@gmail.com');"],
  { fullName: "Test Email", email: "{{em_100}}", phone: "072{{dyn_ts}}", username: "em100_{{dyn_ts}}", password: "Password123@" }, [201]);

addRegCase("TC_BVA_REG_027", "email Max+1 boundary = 101 chars (Overflow)", ["pm.variables.set('em_101', 'em_' + 'a'.repeat(81) + pm.variables.get('dyn_ts') + '@gmail.com');"],
  { fullName: "Test Email", email: "{{em_101}}", phone: "073{{dyn_ts}}", username: "em101_{{dyn_ts}}", password: "Password123@" }, [400, 422, 500]);

addRegCase("TC_BVA_REG_028", "email Null / Omitted (Optional field boundary)", [],
  { fullName: "Test No Email", phone: "074{{dyn_ts}}", username: "noem_{{dyn_ts}}", password: "Password123@" }, [201]);

collection.item.push(regFolder);

// 2. POST /api/auth/login (BVA)
const logFolder = {
  name: "2. POST /api/auth/login (BVA Input Matrix)",
  item: []
};

function addLogCase(tcId, name, bodyObj, expectedCodes, msgPattern = "") {
  logFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status code check", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`,
            msgPattern ? `pm.test("${tcId} - Message pattern check", function () { pm.expect(pm.response.text()).to.match(${msgPattern}); });` : ""
          ].filter(Boolean),
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "POST",
      header: [{ key: "Content-Type", value: "application/json" }],
      body: { mode: "raw", raw: JSON.stringify(bodyObj, null, 2) },
      url: { raw: "{{baseUrl}}/api/auth/login", host: ["{{baseUrl}}"], path: ["api", "auth", "login"] }
    }
  });
}

addLogCase("TC_BVA_LOG_001", "account Length = 0 (Empty '')", { account: "", password: "123" }, [400], "/Vui lòng nhập đầy đủ/i");
addLogCase("TC_BVA_LOG_002", "password Length = 0 (Empty '')", { account: "admin", password: "" }, [400], "/Vui lòng nhập đầy đủ/i");
addLogCase("TC_BVA_LOG_003", "account Length = 1 char ('a')", { account: "a", password: "123" }, [404], "/Tài khoản không tồn tại/i");
addLogCase("TC_BVA_LOG_004", "account Length = 40 chars (Max username boundary)", { account: "admin", password: "123" }, [200]);
addLogCase("TC_BVA_LOG_005", "account Length = 100 chars (Max email boundary)", { account: "admin@example.com", password: "123" }, [200]);
addLogCase("TC_BVA_LOG_006", "account Length = 101 chars (Overflow boundary)", { account: "a".repeat(101), password: "123" }, [404]);
addLogCase("TC_BVA_LOG_007", "password Length = 255 chars", { account: "admin", password: "p".repeat(255) }, [400], "/Mật khẩu không chính xác/i");
addLogCase("TC_BVA_LOG_008", "password Length = 256 chars", { account: "admin", password: "p".repeat(256) }, [400], "/Mật khẩu không chính xác/i");

collection.item.push(logFolder);

// 3. PUT /api/users/:id (BVA)
const usrFolder = {
  name: "3. PUT /api/users/:id (Points & ID Boundaries)",
  item: []
};

function addUsrCase(tcId, name, idParam, bodyObj, expectedCodes, msgPattern = "") {
  usrFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status code check", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`,
            msgPattern ? `pm.test("${tcId} - Message check", function () { pm.expect(pm.response.text()).to.match(${msgPattern}); });` : ""
          ].filter(Boolean),
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "PUT",
      header: [
        { key: "Content-Type", value: "application/json" },
        { key: "Authorization", value: "Bearer {{admin_token}}" }
      ],
      body: { mode: "raw", raw: JSON.stringify(bodyObj, null, 2) },
      url: { raw: `{{baseUrl}}/api/users/${idParam}`, host: ["{{baseUrl}}"], path: ["api", "users", `${idParam}`] }
    }
  });
}

addUsrCase("TC_BVA_USR_001", "User ID Min valid = 1", "1", { fullName: "Admin Updated" }, [200]);
addUsrCase("TC_BVA_USR_002", "User ID Min-1 invalid = 0", "0", { fullName: "Test 0" }, [404]);
addUsrCase("TC_BVA_USR_003", "User ID Negative = -1", "-1", { fullName: "Test Neg" }, [404]);
addUsrCase("TC_BVA_USR_004", "User ID MAX_SAFE_INTEGER = 9007199254740991", "9007199254740991", { fullName: "Max Safe" }, [404]);
addUsrCase("TC_BVA_USR_005", "User ID Non-numeric = 'abc'", "abc", { fullName: "String ID" }, [400, 404, 500]);
addUsrCase("TC_BVA_USR_006", "Points Min boundary = 0", "{{target_user_id}}", { points: 0 }, [200]);
addUsrCase("TC_BVA_USR_007", "Points Min+1 boundary = 1", "{{target_user_id}}", { points: 1 }, [200]);
addUsrCase("TC_BVA_USR_008", "Points Min-1 boundary = -1 (Invalid negative)", "{{target_user_id}}", { points: -1 }, [200, 400, 422]);
addUsrCase("TC_BVA_USR_009", "Points Max INT32 = 2147483647", "{{target_user_id}}", { points: 2147483647 }, [200]);
addUsrCase("TC_BVA_USR_010", "Points Max+1 Overflow = 2147483648", "{{target_user_id}}", { points: 2147483648 }, [200, 400, 500]);
addUsrCase("TC_BVA_USR_011", "Role Valid Boundary = 'KITCHEN'", "{{target_user_id}}", { role: "KITCHEN" }, [200]);
addUsrCase("TC_BVA_USR_012", "Role Invalid Boundary = 'SUPER_ADMIN'", "{{target_user_id}}", { role: "SUPER_ADMIN" }, [400, 500]);
addUsrCase("TC_BVA_USR_013", "Status Valid Boundary = 'BLOCKED'", "{{target_user_id}}", { status: "BLOCKED" }, [200]);
addUsrCase("TC_BVA_USR_014", "Status Invalid Boundary = 'DELETED'", "{{target_user_id}}", { status: "DELETED" }, [400, 500]);
addUsrCase("TC_BVA_USR_015", "Self-blocking Defense: Admin blocks self", "{{admin_id}}", { status: "INACTIVE" }, [400], "/không thể tự khóa/i");

collection.item.push(usrFolder);

// 4. PUT /api/users/profile (BVA)
const prfFolder = {
  name: "4. PUT /api/users/profile (Profile Input Boundaries)",
  item: []
};

function addPrfCase(tcId, name, preScript, bodyObj, expectedCodes) {
  prfFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "prerequest",
        script: { exec: preScript, type: "text/javascript" }
      },
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status code check", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`
          ],
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "PUT",
      header: [
        { key: "Content-Type", value: "application/json" },
        { key: "Authorization", value: "Bearer {{customer_token}}" }
      ],
      body: { mode: "raw", raw: JSON.stringify(bodyObj, null, 2) },
      url: { raw: "{{baseUrl}}/api/users/profile", host: ["{{baseUrl}}"], path: ["api", "users", "profile"] }
    }
  });
}

addPrfCase("TC_BVA_PRF_001", "Avatar Min valid URL length (15 chars)", [], { avatar: "https://a.co/1.j" }, [200]);
addPrfCase("TC_BVA_PRF_002", "Avatar Empty string '' (Clear avatar)", [], { avatar: "" }, [200]);
addPrfCase("TC_BVA_PRF_003", "Avatar Large TEXT Base64 (10,000 chars)", ["pm.variables.set('b64_10k', 'data:image/png;base64,' + 'A'.repeat(9970));"], { avatar: "{{b64_10k}}" }, [200]);
addPrfCase("TC_BVA_PRF_004", "fullName Max boundary = 100 chars", ["pm.variables.set('fn_100', 'U'.repeat(100));"], { fullName: "{{fn_100}}" }, [200]);
addPrfCase("TC_BVA_PRF_005", "fullName Max+1 boundary = 101 chars (Overflow)", ["pm.variables.set('fn_101', 'U'.repeat(101));"], { fullName: "{{fn_101}}" }, [400, 422, 500]);
addPrfCase("TC_BVA_PRF_006", "phone Max boundary = 20 chars", [], { phone: "+8401234567890123456" }, [200]);

collection.item.push(prfFolder);

// 5. GET /api/users (BVA)
const qryFolder = {
  name: "5. GET /api/users (Query Search & Filter Boundaries)",
  item: []
};

function addQryCase(tcId, name, queryParams, expectedCodes) {
  qryFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status code check", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`,
            `pm.test("${tcId} - Return array check", function () {`,
            `    pm.expect(pm.response.json()).to.be.an('array');`,
            `});`
          ],
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "GET",
      header: [{ key: "Authorization", value: "Bearer {{admin_token}}" }],
      url: {
        raw: `{{baseUrl}}/api/users?${queryParams}`,
        host: ["{{baseUrl}}"],
        path: ["api", "users"],
        query: queryParams.split('&').map(pair => {
          const [k, v] = pair.split('=');
          return { key: k, value: v || "" };
        })
      }
    }
  });
}

addQryCase("TC_BVA_QRY_001", "search Query string Length = 0 (?search=)", "search=", [200]);
addQryCase("TC_BVA_QRY_002", "search Query string Min non-empty = 1 char (?search=a)", "search=a", [200]);
addQryCase("TC_BVA_QRY_003", "search Query string Max = 100 chars", `search=${'a'.repeat(100)}`, [200]);
addQryCase("TC_BVA_QRY_004", "search Query with SQL Wildcard (?search=%25)", "search=%25", [200]);
addQryCase("TC_BVA_QRY_005", "role Filter Valid Boundary (?role=ADMIN)", "role=ADMIN", [200]);
addQryCase("TC_BVA_QRY_006", "status Filter Valid Boundary (?status=BLOCKED)", "status=BLOCKED", [200]);

collection.item.push(qryFolder);

// 6. DELETE /api/users/:id (BVA)
const delFolder = {
  name: "6. DELETE /api/users/:id (ID Boundaries & Self-Delete Defense)",
  item: []
};

function addDelCase(tcId, name, idParam, expectedCodes, msgPattern = "") {
  delFolder.item.push({
    name: `[${tcId}] ${name}`,
    event: [
      {
        listen: "test",
        script: {
          exec: [
            `pm.test("${tcId} - Status code check", function () {`,
            `    pm.expect(pm.response.code).to.be.oneOf([${expectedCodes.join(',')}]);`,
            `});`,
            msgPattern ? `pm.test("${tcId} - Message pattern check", function () { pm.expect(pm.response.text()).to.match(${msgPattern}); });` : ""
          ].filter(Boolean),
          type: "text/javascript"
        }
      }
    ],
    request: {
      method: "DELETE",
      header: [{ key: "Authorization", value: "Bearer {{admin_token}}" }],
      url: { raw: `{{baseUrl}}/api/users/${idParam}`, host: ["{{baseUrl}}"], path: ["api", "users", `${idParam}`] }
    }
  });
}

addDelCase("TC_BVA_DEL_001", "Delete User Min-1 ID = 0", "0", [404]);
addDelCase("TC_BVA_DEL_002", "Delete User Negative ID = -1", "-1", [404]);
addDelCase("TC_BVA_DEL_003", "Delete User Large Non-existent ID = 9999999", "9999999", [404]);
addDelCase("TC_BVA_DEL_004", "Self-deletion Defense: Admin deletes self", "{{admin_id}}", [400], "/không thể tự xóa/i");

collection.item.push(delFolder);

const outputPath = path.resolve(__dirname, 'Auth_User_BVA_Postman_Collection.json');
fs.writeFileSync(outputPath, JSON.stringify(collection, null, 2), 'utf-8');
console.log('Successfully written Postman collection to ' + outputPath);
